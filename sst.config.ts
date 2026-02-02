/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "blog",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
      providers: { cloudflare: "6.13.0" },
    };
  },
  async run() {
    const { url } = new sst.cloudflare.StaticSite("Blog", {
      domain: "xvh.lol",
      build: {
        command: "pnpm build",
        output: "dist",
      },
    });

    return { url };
  },
});
