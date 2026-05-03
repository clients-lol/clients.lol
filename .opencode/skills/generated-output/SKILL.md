---
name: generated-output
description:
  Review PRs for generated files and build artifacts that should not be
  committed
---

# Generated Output Review

Use this skill when reviewing changed files for generated output.

## Rules

- `packages/web/dist/**` is generated deploy output and should not be included
  in PRs.
- Generated output findings are deterministic and should be treated as
  actionable.
- Ask contributors to remove generated files rather than editing them by hand.
- Do not flag source files, configs, tests, or lockfiles as generated output
  unless a deterministic finding says they are generated.

## Comment Style

- Keep the comment short.
- Name the generated path.
- Explain that the generated output should be removed from the PR.
