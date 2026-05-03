---
name: client-database
description: Review clients.lol VRChat client TOML database changes
---

# Client Database Review

Use this skill when a PR changes `clients/*.toml`.

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
- feature values: `true` or `false`

## Data Quality Rules

- PRs should normally add or update one client at a time.
- The client ID comes from the filename; client TOML files should not include an
  `id` field.
- Do not invent websites, Discord invites, dates, feature support, status,
  access, or staff quality.
- If `website` has no reliable public URL or invite link, ask the contributor to
  omit it.
- Similar names may be duplicates or updates to existing clients; ask for
  verification rather than assuming.

## Comment Style

- Keep schema failures direct and actionable.
- Make URL and duplicate-name findings clear as verification requests.
- Do not duplicate `bun validate` output unless the deterministic findings
  include it.
