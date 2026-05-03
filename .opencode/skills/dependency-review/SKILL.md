---
name: dependency-review
description: Review package manifest and lockfile changes in clients.lol PRs
---

# Dependency Review

Use this skill when a PR changes dependency manifests or lockfiles.

## Rules

- If any `package.json` changes, `bun.lock` should usually change too when
  dependency versions changed.
- If `bun.lock` changes without a manifest change, ask maintainers to verify the
  lockfile-only update is intentional.
- Do not claim dependency changes are wrong without deterministic evidence.
- Do not ask contributors to hand-edit `bun.lock`; ask them to run
  `bun install`.

## Comment Style

- Phrase these findings as verification requests unless the deterministic
  finding is a hard failure.
- Mention the exact manifest or lockfile pattern involved.
