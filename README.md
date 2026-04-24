# clients.lol

A straightforward directory for VRChat clients. You can browse what's out there,
compare features and pricing, and submit new clients.

## Tech Stack

- [Astro](https://astro.build) - static site framework
- [SST](https://sst.dev) - deploys to Cloudflare Workers
- Custom CSS with variables for styling
- Content lives in Markdown files with frontmatter

## Development

```sh
bun install      # get dependencies
bun dev          # localhost:4321
bun run build    # production build
```

## Deployment

Push to `master` and GitHub Actions handles the rest - your changes go live at
https://clients.lol.

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

1. Drop a new `.md` file in `src/content/clients/`
2. Fill in the frontmatter:

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

There's a submit form with [Cap.js](https://capjs.js.org) CAPTCHA to keep the
spam bots away.

## License

Code is under [Apache 2.0](LICENSE). Content (client listings, descriptions,
all that data) is [CC BY-SA 4.0](DATA_LICENSE).

### Using Our Data

Building something with our data? Here's the deal:

1. Reach out first - let's talk about what you're making
2. Credit us - just say "data from clients.lol"
3. Share alike - modified data stays CC BY-SA 4.0
4. Commercial use? You'll need explicit permission

Get in touch if you want API access or need to discuss licensing.
