# clients.lol

A curated directory of VRChat clients. Browse, compare, and submit clients with comprehensive information about features, pricing, and quality.

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Deployment**: [SST](https://sst.dev) on Cloudflare Workers
- **Styling**: Custom CSS with CSS variables
- **Content**: Markdown with frontmatter via Astro Content Collections

## Development

```sh
pnpm install      # Install dependencies
pnpm dev          # Start dev server at localhost:4321
pnpm build        # Build for production
```

## Deployment

Pushes to `master` branch automatically deploy to https://clients.lol via GitHub Actions.

Other branches get preview URLs at `https://<random_id>.clients.lol`.

## Project Structure

```
src/
├── content/clients/    # Client markdown files
├── components/         # Astro components
├── layouts/           # Page layouts
├── pages/             # Route definitions
├── utils/             # Utility functions
└── styles/            # Global styles
```

## Adding a Client

1. Create a new `.md` file in `src/content/clients/`
2. Add frontmatter with client details:

```yaml
---
name: "Client Name"
description: "Brief description of the client"
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

3. Write a short description in the body

## Submit Form

The submit page includes CAPTCHA verification using [Cap.js](https://capjs.js.org) to prevent spam.

## License

[Add your license here]
