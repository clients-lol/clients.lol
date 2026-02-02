// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import config from "./config.mjs";
import mdx from "@astrojs/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeCallouts from "rehype-callouts";

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

  integrations: [
    mdx({
      rehypePlugins: [rehypeCallouts],
    }),
  ],

  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeCallouts,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener"] }],
    ],
  },
});
