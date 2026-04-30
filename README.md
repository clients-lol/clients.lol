# clients.lol

An open-source database of VRChat clients.

## Development

Install dependencies and run the site locally:

```bash
bun install
bun dev
```

Validate changes before opening a PR:

```bash
bun run build
```

## Adding A Client

Each client is a Markdown file in `src/content/clients/`. To add one:

1. Fork the repo.
2. Create a branch, for example `add-client-name`.
3. Add `src/content/clients/client-name.md`.
4. Fill out the frontmatter.
5. Leave the Markdown body empty.
6. Run `bun run build`.
7. Commit the file and open a pull request.

Use a lowercase, hyphenated filename:

```text
src/content/clients/example-client.md
```

Use this template:

```yaml
---
name: "Example Client"
os: "Windows"
type: "Standalone"
status: "Active"
staffQuality: "Unknown"
access: "Free"
features:
  movement: false
  esp: false
  teleports: false
  vr: false
  crashers: false
  protections: false
website: "https://example.com"
---
```

`website` is optional. If there is no public website or invite link, remove the
field.

`lastUpdated` is optional. Only include it when the update date matters:

```yaml
lastUpdated: "2026-04-30"
```

## Accepted Values

`status` must be one of:

```text
Active
Inactive
Discontinued
Unknown
```

`staffQuality` must be one of:

```text
Excellent
Good
Average
Poor
Unknown
```

`access` must be one of:

```text
Free
Paid
```

Feature values must be `true` or `false`.

## Pull Requests

PRs should be small and focused. Add or update one client per PR unless the
changes are clearly related.

For a new client PR, include:

- The client Markdown file.
- A source for the website or Discord invite, if listed.
- A short note explaining any uncertain fields.

Do not include generated files such as `dist/`.

## API

The public JSON endpoint is:

```text
https://clients.lol/api.json
```
