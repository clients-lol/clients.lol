import { getCollection, type CollectionEntry } from "astro:content";

export type ClientEntry = CollectionEntry<"clients">;

export async function getClients(): Promise<ClientEntry[]> {
  return getCollection("clients");
}
