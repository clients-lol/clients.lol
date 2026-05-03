---
name: workflow-security
description:
  Review GitHub Actions workflow changes for automation and token-permission
  risk
---

# Workflow Security Review

Use this skill when a PR changes `.github/workflows/**`.

## Rules

- Workflow changes can affect repository automation, secrets, token permissions,
  and PR trust boundaries.
- `pull_request_target` requires extra scrutiny because it runs with
  base-repository permissions.
- Check whether permissions are scoped to the minimum required access.
- Check whether contributor-controlled code could run with privileged tokens.
- Keep findings advisory unless deterministic checks prove a concrete problem.

## Comment Style

- Ask maintainers to verify triggers, permissions, and privileged execution
  paths.
- Avoid overstating risk when the deterministic finding only says a workflow
  changed.
