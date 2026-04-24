import { defineCollection, z } from "astro:content";

const clients = defineCollection({
  type: "content",
  schema: z
    .object({
      name: z.string(),
      os: z.string(),
      type: z.string(),
      status: z.enum(["Active", "Inactive", "Discontinued", "Unknown"]),
      lastUpdated: z.coerce.date().optional(),
      staffQuality: z.enum(["Excellent", "Good", "Average", "Poor", "Unknown"]),
      access: z.enum(["Free", "Paid"]),
      features: z
        .object({
          movement: z.boolean().default(false),
          esp: z.boolean().default(false),
          teleports: z.boolean().default(false),
          vr: z.boolean().default(false),
          crashers: z.boolean().default(false),
          protections: z.boolean().default(false),
        })
        .strict(),
      website: z.string().url().optional(),
    })
    .strict(),
});

export const collections = { clients };
