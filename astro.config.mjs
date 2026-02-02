// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import config from "./config.mjs";

// https://astro.build/config
export default defineConfig({
  site: config.url,
  base: "/",
  output: "static",
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  server: {
    host: "0.0.0.0",
  },
  devToolbar: {
    enabled: false,
  },
});
