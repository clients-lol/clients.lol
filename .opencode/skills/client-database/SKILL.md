---
name: client-database
description: Add, update, or review clients.lol VRChat client TOML database entries
---

# Client Database

Use this skill when adding, updating, or reviewing `clients/*.toml`.

## Workflow

- Inspect existing entries before editing.
- For updates, edit only the relevant existing TOML file unless the request explicitly asks for broader cleanup.
- For new clients, create one lowercase, hyphenated TOML file in `clients/`.
- The client ID comes from the filename; client TOML files should not include an `id` field.
- Keep changes small and focused. Add or update one client per PR unless the changes are clearly related.
- Run `bun run validate` before finishing client database changes.
- Do not commit generated files such as `packages/web/dist`.

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
- `access`: `Free`, `Invite`, `Paid`
- feature values: `true` or `false`

## Data Quality Rules

- Do not invent websites, Discord invites, dates, feature support, status,
  access, or staff quality.
- Use `Invite` for clients with private or gated access, regardless of whether
  payment is required.
- If a value is unknown and the schema permits it, use `Unknown`.
- If `website` has no reliable public URL or invite link, ask the contributor to
  omit it.
- Include `lastUpdated` only when the update date matters or the request/source
  provides a meaningful date.
- Similar names may be duplicates or updates to existing clients; ask for
  verification rather than assuming.

## Contributor Docs

`README.md` contains the public contribution guide. If this skill and the README
disagree, update both so schema values and data-quality guidance stay in sync.

## Comment Style

- Keep schema failures direct and actionable.
- Make URL and duplicate-name findings clear as verification requests.
- Do not duplicate `bun validate` output unless the deterministic findings
  include it.
