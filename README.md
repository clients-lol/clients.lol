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

This repository uses a dual license structure:

**Code**: [Apache License 2.0](LICENSE) - Website source code, components, and utilities

**Data/Content**: [CC BY-SA 4.0](DATA_LICENSE) - Client listings, descriptions, and curated database

### Using Our Data

If you're building a Discord bot, app, or integration that uses clients.lol data:

1. **Ask first** - Send us a message to discuss your use case
2. **Give credit** - Must attribute "data from clients.lol"
3. **Share alike** - Any modified datasets must also be CC BY-SA 4.0
4. **Non-commercial use preferred** - Commercial applications require explicit permission

Contact us to request API access or discuss data licensing.
