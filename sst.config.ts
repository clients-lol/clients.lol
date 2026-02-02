/// <reference path="./.sst/platform/config.d.ts" />

const PRODUCTION_STAGES = ["cold", "prod", "production"];

export default $config({
  app(input) {
    return {
      name: "me",
      removal: PRODUCTION_STAGES.includes(input?.stage) ? "retain" : "remove",
      protect: PRODUCTION_STAGES.includes(input?.stage),
      home: "cloudflare",
      providers: { cloudflare: "6.13.0", random: "4.19.1" },
    };
  },
  async run() {
    const { stage } = $app;
    const isProduction = PRODUCTION_STAGES.includes(stage);

    let domain;

    if (isProduction) {
      domain = "xvh.lol";
    } else {
      const subdomainId = new random.RandomId("preview-subdomain", {
        byteLength: 3,
        keepers: {
          stage: stage,
          appName: $app.name,
        },
      });

      domain = $interpolate`${subdomainId.hex}.xvh.lol`;
    }

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
