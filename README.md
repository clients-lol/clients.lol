# clients.lol

An open-source database of VRChat clients.

## Development

Install dependencies and run the site locally:

```bash
bun install
bun dev
```

`bun dev` rebuilds the static site into `packages/web/dist` when files change.

Validate changes before opening a PR:

```bash
bun run validate
bun run build
```

## Structure

```text
clients/              # Client TOML files
packages/core/        # TOML loader and schema validation
packages/web/         # Static site/API build script
packages/web/dist/    # Generated deploy output
```

## Adding A Client

Each client is a TOML file in the root `clients/` directory. The client ID comes
from the filename, like `models.dev`.

1. Fork the repo.
2. Create a branch, for example `add-client-name`.
3. Add `clients/client-name.toml`.
4. Fill out the TOML fields.
5. Run `bun run validate`.
6. Run `bun run build`.
7. Commit the file and open a pull request.

Use a lowercase, hyphenated filename:

```text
clients/example-client.toml
```

Use this template:

```toml
name = "Example Client"
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
```

`website` is optional. If there is no public website or invite link, remove the
field.

`lastUpdated` is optional. Only include it when the update date matters:

```toml
lastUpdated = "2026-04-30"
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

- The client TOML file.
- A source for the website or Discord invite, if listed.
- A short note explaining any uncertain fields.

Do not include generated files such as `dist/`.

## API

The public JSON endpoint is:

```text
https://clients.lol/api.json
```
