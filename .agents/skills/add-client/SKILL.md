---
name: add-client
description: Add or update clients.lol VRChat client entries in clients/*.toml. Use when a user asks to add a client, update client metadata, adjust features/status/access/staff quality, or prepare a client database PR.
metadata:
  short-description: Add or update clients.lol client TOML entries
---

# Add Client

Use this skill when changing the client database in `clients/*.toml`.

`.opencode/skills/client-database/SKILL.md` is the source of truth for schema,
workflow, validation, and data-quality rules.

Before editing client entries, read and follow that file. In the final response,
mention the TOML file changed, whether `bun run validate` passed, and any fields
that need reviewer attention.
