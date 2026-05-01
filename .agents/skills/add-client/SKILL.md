---
name: add-client
description: Add or update clients.lol VRChat client entries in clients/*.toml. Use when a user asks to add a client, update client metadata, adjust features/status/access/staff quality, or prepare a client database PR.
metadata:
  short-description: Add or update clients.lol client TOML entries
---

# Add Client

Use this skill when changing the client database in `clients/*.toml`.

## Workflow

1. Inspect existing entries before editing:

   ```bash
   ls clients
   ```

2. For a new client, create one lowercase, hyphenated TOML file:

   ```text
   clients/example-client.toml
   ```

   The client `id` is derived from the filename by the build pipeline. Do not add an `id` field to TOML.

3. For an update, edit only the relevant existing TOML file unless the user explicitly asks for broader cleanup.

4. Use `assets/client-template.toml` as the starting point for new entries.

5. Validate before final response:

   ```bash
   bun run validate
   ```

6. Do not commit generated output from `packages/web/dist`.

## Schema Rules

Required top-level fields:

```toml
name = "Example Client"
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
```

Optional top-level fields:

```toml
website = "https://example.com"
lastUpdated = "2026-04-30"
```

Allowed values:

- `status`: `Active`, `Inactive`, `Discontinued`, `Unknown`
- `staffQuality`: `Excellent`, `Good`, `Average`, `Poor`, `Unknown`
- `access`: `Free`, `Paid`
- Feature values: `true` or `false`

## Data Quality Rules

- Do not invent websites, Discord invites, dates, feature support, status, access, or staff quality.
- If a value is unknown and the schema permits it, use `Unknown`.
- If `website` has no reliable public URL or invite link, omit it.
- Include `lastUpdated` only when the user provides a meaningful update date or source.
- Keep each PR small: one client per PR unless related changes are explicitly requested.
- Include source notes in the final response when any listed URL or uncertain field came from user-provided evidence.
- Do not run `bun run build` for client-only validation unless the user asks for a site build check.

## PR Expectations

For new clients, the final response should mention:

- The TOML file added or changed.
- Whether `bun run validate` passed.
- Any uncertain fields that need reviewer attention.
