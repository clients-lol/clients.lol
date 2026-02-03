/// <reference path="./.sst/platform/config.d.ts" />

const PRODUCTION_STAGES = ["cold", "prod", "production", "main"];

function getDomain(stage: string) {
  const isProduction = PRODUCTION_STAGES.includes(stage);

  if (isProduction) {
    return "clients.lol";
  }

  const subdomainId = new random.RandomId("preview-subdomain", {
    byteLength: 3,
    keepers: {
      stage: stage,
      appName: $app.name,
    },
  });

  return $interpolate`${subdomainId.hex}.clients.lol`;
}

export default $config({
  app(input) {
    return {
      name: "clients-lol",
      removal: PRODUCTION_STAGES.includes(input?.stage) ? "retain" : "remove",
      protect: PRODUCTION_STAGES.includes(input?.stage),
      home: "cloudflare",
      providers: { cloudflare: "6.13.0", random: "4.19.1" },
    };
  },
  async run() {
    const { stage } = $app;
    const domain = getDomain(stage);

    const site = new sst.cloudflare.StaticSite("Site", {
      domain,
      build: {
        command: "pnpm build",
        output: "dist",
      },
    });

    return {
      url: site.url,
      stage: stage,
    };
  },
});
