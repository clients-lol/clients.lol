# clients.lol

A directory of VRChat clients with information about features, pricing, and compatibility.

## Tech Stack

- [Astro](https://astro.build) - static site framework
- [SST](https://sst.dev) - deploys to Cloudflare Workers
- [Bun](https://bun.sh) - package manager and runtime

## Development

```bash
bun install      # get dependencies
bun dev          # localhost:4321
bun run build    # production build
```

## Deployment

Push to `master` and GitHub Actions handles the rest - changes go live at https://clients.lol.

## Project Structure

```
src/
├── content/clients/    # each client has its own .md file
├── components/         # reusable Astro bits
├── layouts/           # page templates
├── pages/             # routes
├── utils/             # helper functions
└── styles/            # CSS
```

## Adding a Client

1. Create a new `.md` file in `src/content/clients/`
2. Add frontmatter with client details:

```yaml
---
name: "Client Name"
description: "What this client does"
os: "Windows | Linux | Windows & Linux"
type: "Standalone | BepInEx | MelonLoader | Abyss Loader"
status: "Active | Inactive | Discontinued"
staffQuality: "Excellent | Good | Average | Poor | Unknown"
pricing:
  - plan: "Monthly"
    price: "$10"
    period: "month"
owner:
  name: "Developer Name"
  avatar: "/avatars/name.webp"
features:
  - "Feature 1"
  - "Feature 2"
---
```

3. Add a brief description below the frontmatter

## Submit Form

There's a submit form with [Cap.js](https://capjs.js.org) CAPTCHA to keep spam away.

## License

MIT. Code, content, data - it's all under [MIT License](LICENSE).

## Contributing

Data is stored as Markdown files in `src/content/clients/`.

To add or update a client, open a PR with your changes.

## Questions?

Open an issue or PR on [GitHub](https://github.com/clients-lol/clients.lol).

---

clients.lol is maintained by the VRChat community.
