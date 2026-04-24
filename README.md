# clients.lol

A open-source database of VRChat clients.

## Development

```bash
bun install
bun dev
bun run build
```

## Adding a Client

1. Add a new `.md` file in `src/content/clients/`
2. Include frontmatter like this:

```yaml
---
name: "Client Name"
description: "What this client does"
os: "Windows | Linux | Windows & Linux"
type: "Standalone | BepInEx | MelonLoader | Abyss Loader"
status: "Active | Inactive | Discontinued"
staffQuality: "Excellent | Good | Average | Poor | Unknown"
access: "Free | Paid"
features:
  movement: true | false
  esp: true | false
  teleports: true | false
  vrSupport: true | false
  crashers: true | false
  protections: true | false
website: "https://example.com"  # can also be a Discord invite
---
```

3. Add a short body description below the frontmatter

## License

MIT. Code, content, data - it's all under [MIT License](LICENSE).

## Contributing

Open a PR with client additions or updates.
