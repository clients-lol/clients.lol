#!/usr/bin/env bun

import path from "node:path";
import { parseArgs } from "node:util";
import type { ZodError } from "zod";

import { Client } from "../src/schema";

const generatedPrefixes = ["packages/web/dist/"];
const clientPrefix = "clients/";
const tomlExtension = ".toml";
const urlTimeoutMs = 5_000;
const warning = "warning";
const failure = 1;
const success = 0;
const missingOutput = "";

type FindingSeverity = "error" | "warning";

interface Finding {
  readonly title: string;
  readonly body: string;
  readonly path?: string;
  readonly severity: FindingSeverity;
}

interface ChangedFile {
  readonly filename: string;
  readonly raw_url?: string;
  readonly status: string;
}

interface ExistingClient {
  readonly id: string;
  readonly name: string;
  readonly path: string;
}

interface PullRequestSnapshot {
  readonly body: string;
  readonly changedFiles: readonly ChangedFile[];
  readonly existingClients: readonly ExistingClient[];
  readonly fetchFile: (file: ChangedFile) => Promise<string | void>;
  readonly fetchUrl?: (url: string) => Promise<UrlCheck>;
  readonly title: string;
}

interface UrlCheck {
  readonly ok: boolean;
  readonly reason: string;
  readonly status?: number;
}

interface GitHubPullRequest {
  readonly body: string | null;
  readonly head: {
    readonly repo: {
      readonly full_name: string;
    };
    readonly sha: string;
  };
  readonly title: string;
}

interface GitHubContentFile {
  readonly content?: string;
  readonly encoding?: string;
  readonly type?: string;
}

const suspiciousHosts = new Set([
  "bit.ly",
  "cutt.ly",
  "example.com",
  "goo.gl",
  "is.gd",
  "localhost",
  "rb.gy",
  "tinyurl.com",
  "t.co",
]);

const urlPlaceholderPatterns = [/example/i, /placeholder/i, /your-?/i, /todo/i, /test/i];

export async function reviewPullRequestSnapshot(
  snapshot: PullRequestSnapshot,
): Promise<readonly Finding[]> {
  const findings: Finding[] = [];
  const { changedFiles } = snapshot;
  const clientFiles = changedFiles.filter((file) => isClientFile(file.filename));

  for (const file of changedFiles) {
    if (generatedPrefixes.some((prefix) => file.filename.startsWith(prefix))) {
      findings.push({
        body: "Generated deploy output should not be committed. Remove the generated dist files from this PR.",
        path: file.filename,
        severity: "error",
        title: "Generated dist file committed",
      });
    }
  }

  if (clientFiles.length > 1) {
    findings.push({
      body: `This PR changes ${clientFiles.length} client TOML files. Client database PRs should normally add or update one client at a time.`,
      severity: "warning",
      title: "Multiple client files changed",
    });
  }

  for (const file of clientFiles) {
    if (file.status === "removed") {
      findings.push({
        body: "Client removal should be called out explicitly in the PR description so maintainers can verify it is intentional.",
        path: file.filename,
        severity: "warning",
        title: "Client file removed",
      });
      continue;
    }

    const content = await snapshot.fetchFile(file);
    if (typeof content !== "string") {
      findings.push({
        body: "Could not read this client TOML file from the PR head. Please verify the file content manually.",
        path: file.filename,
        severity: "warning",
        title: "Unable to read changed client file",
      });
      continue;
    }

    const clientID = path.basename(file.filename, tomlExtension);
    findings.push(...(await reviewClientFile(file.filename, clientID, content, snapshot)));
  }

  return findings;
}

async function reviewClientFile(
  filename: string,
  clientID: string,
  content: string,
  snapshot: PullRequestSnapshot,
): Promise<readonly Finding[]> {
  const findings: Finding[] = [];
  const parsed = parseToml(filename, content);

  if (parsed instanceof Error) {
    return [
      {
        body: parsed.message,
        path: filename,
        severity: "error",
        title: "Invalid TOML",
      },
    ];
  }

  const client = Client.safeParse({
    ...parsed,
    id: clientID,
  });

  if (!client.success) {
    findings.push({
      body: formatZodError(client.error),
      path: filename,
      severity: "error",
      title: "Client schema mismatch",
    });
  }

  const rawName = readStringProperty(parsed, "name");
  if (rawName) {
    findings.push(...findSimilarNames(clientID, rawName, snapshot.existingClients, filename));
  }

  const rawWebsite = readStringProperty(parsed, "website");
  if (rawWebsite) {
    findings.push(...(await reviewUrl(rawWebsite, filename, snapshot)));
  }

  return findings;
}

function parseToml(filename: string, content: string): Error | Record<string, unknown> {
  try {
    const parsed = Bun.TOML.parse(content);
    if (!isRecord(parsed)) {
      return new Error(`${filename} did not parse to a TOML object.`);
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
    return new Error(String(error));
  }
}

function formatZodError(error: ZodError): string {
  return error.errors
    .map((issue) => {
      const location = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `- ${location}: ${issue.message}`;
    })
    .join("\n");
}

function findSimilarNames(
  clientID: string,
  clientName: string,
  existingClients: readonly ExistingClient[],
  filename: string,
): readonly Finding[] {
  const normalizedName = normalizeName(clientName);
  const similar = existingClients.filter((client) => {
    if (client.id === clientID) {
      return false;
    }

    const existingName = normalizeName(client.name);
    if (existingName === normalizedName) {
      return true;
    }

    if (existingName.includes(normalizedName) || normalizedName.includes(existingName)) {
      return Math.min(existingName.length, normalizedName.length) >= 4;
    }

    return levenshteinDistance(existingName, normalizedName) <= 2;
  });

  return similar.map((client) => ({
    body: `This client name is similar to existing entry \`${client.name}\` in \`${client.path}\`. Confirm this is a distinct client and not a duplicate/update.`,
    path: filename,
    severity: warning,
    title: "Similar existing client name",
  }));
}

async function reviewUrl(
  rawWebsite: string,
  filename: string,
  snapshot: PullRequestSnapshot,
): Promise<readonly Finding[]> {
  const findings: Finding[] = [];
  const parsed = parseWebsite(rawWebsite);

  if (!parsed) {
    return [
      {
        body: `The website value \`${rawWebsite}\` is not a valid URL.`,
        path: filename,
        severity: "error",
        title: "Invalid website URL",
      },
    ];
  }

  if (parsed.protocol !== "https:") {
    findings.push({
      body: "Prefer an HTTPS website or invite URL when one is available.",
      path: filename,
      severity: warning,
      title: "Website URL is not HTTPS",
    });
  }

  const host = parsed.hostname.toLowerCase();
  if (
    suspiciousHosts.has(host) ||
    urlPlaceholderPatterns.some((pattern) => pattern.test(rawWebsite))
  ) {
    findings.push({
      body: `The website value \`${rawWebsite}\` looks like a placeholder, shortener, or non-source URL. Please provide a reliable public URL or omit \`website\`.`,
      path: filename,
      severity: warning,
      title: "Suspicious website URL",
    });
  }

  const prText = `${snapshot.title}\n${snapshot.body}`.toLowerCase();
  if (!prText.includes(rawWebsite.toLowerCase()) && !prText.includes(host)) {
    findings.push({
      body: "The PR description does not mention this website or domain. Add a source note for the URL, or omit it if it cannot be verified.",
      path: filename,
      severity: warning,
      title: "Website URL lacks PR source context",
    });
  }

  if (snapshot.fetchUrl) {
    const check = await snapshot.fetchUrl(rawWebsite);
    if (!check.ok) {
      const status = check.status ? ` HTTP ${check.status}.` : "";
      findings.push({
        body: `The website URL did not pass a basic reachability check:${status} ${check.reason}`,
        path: filename,
        severity: warning,
        title: "Website URL may be unreachable",
      });
    }
  }

  return findings;
}

function parseWebsite(value: string): URL | void {
  try {
    return new URL(value);
  } catch {
    return;
  }
}

function isClientFile(filename: string): boolean {
  return filename.startsWith(clientPrefix) && filename.endsWith(tomlExtension);
}

function normalizeName(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

function readStringProperty(value: Record<string, unknown>, key: string): string | undefined {
  const property = value[key];
  return typeof property === "string" && property.length > 0 ? property : void 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function levenshteinDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_value, index) => index);

  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    const current = [leftIndex + 1];

    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      const insert = (current[rightIndex] ?? 0) + 1;
      const remove = (previous[rightIndex + 1] ?? 0) + 1;
      const replace = (previous[rightIndex] ?? 0) + (left[leftIndex] === right[rightIndex] ? 0 : 1);
      current.push(Math.min(insert, remove, replace));
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length] ?? 0;
}

async function loadExistingClients(directory: string): Promise<readonly ExistingClient[]> {
  const clients: ExistingClient[] = [];

  for await (const clientPath of new Bun.Glob("*.toml").scan({
    absolute: true,
    cwd: directory,
  })) {
    const content = await Bun.file(clientPath).text();
    const parsed = parseToml(clientPath, content);
    if (parsed instanceof Error) {
      continue;
    }

    const name = readStringProperty(parsed, "name");
    if (!name) {
      continue;
    }

    clients.push({
      id: path.basename(clientPath, tomlExtension),
      name,
      path: path.join("clients", path.basename(clientPath)),
    });
  }

  return clients;
}

async function githubJson<T>(endpoint: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;

  if (!token) {
    throw new Error("GITHUB_TOKEN is required.");
  }

  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed for ${repository ?? "repository"}: ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

async function loadChangedFiles(
  repository: string,
  prNumber: string,
): Promise<readonly ChangedFile[]> {
  const files: ChangedFile[] = [];

  for (let page = 1; ; page += 1) {
    const batch = await githubJson<ChangedFile[]>(
      `/repos/${repository}/pulls/${prNumber}/files?per_page=100&page=${page}`,
    );
    files.push(...batch);

    if (batch.length < 100) {
      return files;
    }
  }
}

function loadPullRequest(repository: string, prNumber: string): Promise<GitHubPullRequest> {
  return githubJson<GitHubPullRequest>(`/repos/${repository}/pulls/${prNumber}`);
}

async function loadPrFileContent(pr: GitHubPullRequest, filename: string): Promise<string | void> {
  const encodedPath = filename.split("/").map(encodeURIComponent).join("/");
  const endpoint = `/repos/${pr.head.repo.full_name}/contents/${encodedPath}?ref=${pr.head.sha}`;
  const response = await githubJson<GitHubContentFile>(endpoint);

  if (response.type !== "file" || response.encoding !== "base64" || !response.content) {
    return;
  }

  return Buffer.from(response.content, "base64").toString("utf8");
}

async function fetchUrl(url: string): Promise<UrlCheck> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(urlTimeoutMs),
    });

    if (response.ok) {
      return {
        ok: true,
        reason: "reachable",
        status: response.status,
      };
    }

    if (response.status === 405 || response.status === 403) {
      const getResponse = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(urlTimeoutMs),
      });

      return {
        ok: getResponse.ok,
        reason: getResponse.ok ? "reachable" : getResponse.statusText,
        status: getResponse.status,
      };
    }

    return {
      ok: false,
      reason: response.statusText,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

function formatFindings(findings: readonly Finding[]): string {
  if (findings.length === 0) {
    return missingOutput;
  }

  const lines = [
    "<!-- client-pr-reviewer -->",
    "Client PR reviewer found items that need maintainer or contributor attention:",
    "",
  ];

  for (const finding of findings) {
    const prefix = finding.severity === "error" ? "Error" : "Warning";
    const location = finding.path ? ` in \`${finding.path}\`` : "";
    lines.push(`- **${prefix}: ${finding.title}**${location}`);
    lines.push(finding.body);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

async function main(): Promise<number> {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      "clients-dir": {
        default: "clients",
        type: "string",
      },
      output: {
        short: "o",
        type: "string",
      },
    },
  });

  const repository = process.env.GITHUB_REPOSITORY;
  const prNumber = process.env.PR_NUMBER ?? process.env.GITHUB_PR_NUMBER;

  if (!repository || !prNumber) {
    throw new Error("GITHUB_REPOSITORY and PR_NUMBER are required.");
  }

  const pr = await loadPullRequest(repository, prNumber);
  const changedFiles = await loadChangedFiles(repository, prNumber);
  const existingClients = await loadExistingClients(values["clients-dir"]);

  const findings = await reviewPullRequestSnapshot({
    body: pr.body ?? "",
    changedFiles,
    existingClients,
    fetchFile: (file) => loadPrFileContent(pr, file.filename),
    fetchUrl,
    title: pr.title,
  });

  const output = formatFindings(findings);
  if (values.output) {
    await Bun.write(values.output, output);
  } else if (output.length > 0) {
    console.log(output);
  }

  return success;
}

if (import.meta.main) {
  main()
    .then((code) => process.exit(code))
    .catch((error) => {
      console.error(error);
      process.exit(failure);
    });
}
