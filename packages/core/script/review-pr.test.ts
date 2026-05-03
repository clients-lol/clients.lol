import { describe, expect, test } from "bun:test";

import { reviewPullRequestSnapshot } from "./review-pr";

const existingClients = [
  {
    id: "hex",
    name: "Hex",
    path: "clients/hex.toml",
  },
];

const validClient = `name = "Example Client"
os = "Windows"
type = "Standalone"
status = "Active"
staffQuality = "Unknown"
access = "Free"

[features]
movement = false
esp = false
teleports = false
vr = false
crashers = false
protections = false
`;

const missingAccessClient = `name = "Bad Client"
os = "Windows"
type = "Standalone"
status = "Active"
staffQuality = "Unknown"

[features]
movement = false
esp = false
teleports = false
vr = false
crashers = false
protections = false
`;

const suspiciousClient = `name = "Hex"
os = "Windows"
type = "Standalone"
status = "Active"
staffQuality = "Unknown"
access = "Free"
website = "https://example.com"

[features]
movement = false
esp = false
teleports = false
vr = false
crashers = false
protections = false
`;

describe("reviewPullRequestSnapshot", () => {
  test("does not flag a valid single client without a website", async () => {
    const findings = await reviewPullRequestSnapshot({
      body: "Adds Example Client.",
      changedFiles: [
        {
          filename: "clients/example-client.toml",
          status: "added",
        },
      ],
      existingClients,
      fetchFile: () => Promise.resolve(validClient),
      title: "feat: add example client",
    });

    expect(findings).toHaveLength(0);
  });

  test("flags generated dist files", async () => {
    const findings = await reviewPullRequestSnapshot({
      body: "",
      changedFiles: [
        {
          filename: "packages/web/dist/api.json",
          status: "added",
        },
      ],
      existingClients,
      fetchFile: () => Promise.resolve(),
      title: "feat: add generated output",
    });

    expect(findings).toContainEqual(
      expect.objectContaining({
        title: "Generated dist file committed",
      }),
    );
  });

  test("flags schema errors", async () => {
    const findings = await reviewPullRequestSnapshot({
      body: "",
      changedFiles: [
        {
          filename: "clients/bad-client.toml",
          status: "added",
        },
      ],
      existingClients,
      fetchFile: () => Promise.resolve(missingAccessClient),
      title: "feat: add bad client",
    });

    expect(findings).toContainEqual(
      expect.objectContaining({
        title: "Client schema mismatch",
      }),
    );
  });

  test("flags similar existing names and suspicious URLs", async () => {
    const findings = await reviewPullRequestSnapshot({
      body: "Adds a client.",
      changedFiles: [
        {
          filename: "clients/hex-v2.toml",
          status: "added",
        },
      ],
      existingClients,
      fetchFile: () => Promise.resolve(suspiciousClient),
      fetchUrl: () =>
        Promise.resolve({
          ok: false,
          reason: "not found",
          status: 404,
        }),
      title: "feat: add hex v2",
    });

    expect(findings.map((finding) => finding.title)).toContain("Similar existing client name");
    expect(findings.map((finding) => finding.title)).toContain("Suspicious website URL");
    expect(findings.map((finding) => finding.title)).toContain("Website URL may be unreachable");
  });
});
