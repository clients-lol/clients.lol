import { defineCollection, z } from "astro:content";

const clients = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    os: z.string(),
    type: z.string(),
    status: z.enum(["Active", "Inactive", "Discontinued", "Unknown"]),
    lastUpdated: z.coerce.date().optional(),
    staffQuality: z.enum(["Excellent", "Good", "Average", "Poor", "Unknown"]),
    pricing: z.array(
      z.object({
        plan: z.string(),
        price: z.string(),
        period: z.string().optional(),
      })
    ).default([]),
    owner: z.object({
      name: z.string(),
      avatar: z.string().optional(),
    }),
    features: z.array(z.string()).default([]),
    website: z.string().url().optional(),
    discord: z.string().url().optional(),
  }),
});

export const collections = { clients };
