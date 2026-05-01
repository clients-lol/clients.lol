#!/usr/bin/env bun

import { watch, type FSWatcher } from "node:fs";
import path from "node:path";

const rootDir = path.join(import.meta.dirname, "..", "..", "..");
const distDir = path.join(rootDir, "packages", "web", "dist");
const debounceMs = 75;
const defaultPort = 6521;
const notFound = 404;
const port = Number(Bun.env.PORT ?? defaultPort);
const success = 0;
const watchTargets = [
  "clients",
  "packages/core/src",
  "packages/web/src",
  "packages/web/script",
  "packages/web/config.ts",
] as const;

let buildQueued = false;
let building = false;
let timer: ReturnType<typeof setTimeout> | null = null;
const queuedBuildReasons = new Set<string>();

function formatQueuedBuildReason(): string {
  const reasons = [...queuedBuildReasons];
  queuedBuildReasons.clear();

  if (reasons.length === 0) {
    return "queued changes";
  }

  if (reasons.length === 1) {
    return `queued change: ${reasons[0]}`;
  }

  return `queued changes: ${reasons.join(", ")}`;
}

async function runBuild(reason: string): Promise<boolean> {
  if (building) {
    buildQueued = true;
    queuedBuildReasons.add(reason);
    return true;
  }

  building = true;
  console.log(`[dev] build: ${reason}`);

  const proc = Bun.spawn(["bun", "./packages/web/script/build.ts"], {
    cwd: rootDir,
    stderr: "inherit",
    stdout: "inherit",
  });
  const exitCode = await proc.exited;
  const succeeded = exitCode === success;

  if (!succeeded) {
    console.error(`[dev] build failed with exit code ${exitCode}`);
  }

  building = false;

  if (buildQueued) {
    buildQueued = false;
    const queuedReason = formatQueuedBuildReason();
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      runBuild(queuedReason).catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
      });
    }, debounceMs);
  }

  return succeeded;
}

function scheduleBuild(reason: string): void {
  if (timer !== null) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    runBuild(reason).catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
  }, debounceMs);
}

const watchers: FSWatcher[] = watchTargets.map((target) => {
  const absoluteTarget = path.join(rootDir, target);
  return watch(absoluteTarget, { recursive: true }, (_event, filename) => {
    const changed = filename ? path.join(target, filename.toString()) : target;
    scheduleBuild(changed);
  });
});

const server = Bun.serve({
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = decodeURIComponent(url.pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const filePath = path.join(distDir, relativePath);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file);
    }

    return new Response(Bun.file(path.join(distDir, "404.html")), {
      status: notFound,
    });
  },
  port,
});

process.on("SIGINT", () => {
  for (const watcher of watchers) {
    watcher.close();
  }
  server.stop();
  process.exit(success);
});

const startupSucceeded = await runBuild("startup");
if (!startupSucceeded) {
  for (const watcher of watchers) {
    watcher.close();
  }
  server.stop();
  process.exit(1);
}

console.log(`[dev] watching ${watchTargets.join(", ")}`);
console.log(`[dev] serving http://localhost:${server.port}`);
