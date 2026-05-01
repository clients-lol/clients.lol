/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app() {
    return {
      name: "clients-lol",
      home: "cloudflare",
    };
  },
  async run() {
    const site = new sst.cloudflare.StaticSiteV2("Site", {
      domain: $app.stage === "master" ? "clients.lol" : undefined,
      build: {
        command: "bun run build",
        output: "packages/web/dist",
      },
      notFound: "404",
    });

    return {
      url: site.url,
    };
  },
});
