import type { CollectionEntry } from "astro:content";

type ClientEntry = CollectionEntry<"clients">;

const OS_ORDER = {
  Linux: 1,
  MacOS: 3,
  Other: 4,
  Windows: 0,
  "Windows & Linux": 2,
};

const TYPE_ORDER = {
  "Abyss Loader": 3,
  BepInEx: 1,
  MelonLoader: 2,
  Other: 4,
  Standalone: 0,
};

export function sortClients(clients: ClientEntry[]): ClientEntry[] {
  return clients.sort((a, b) => {
    // Primary sort: by OS
    const osA = OS_ORDER[a.data.os as keyof typeof OS_ORDER] ?? 4;
    const osB = OS_ORDER[b.data.os as keyof typeof OS_ORDER] ?? 4;

    if (osA !== osB) {
      return osA - osB;
    }

    // Secondary sort: by Type
    const typeA = TYPE_ORDER[a.data.type as keyof typeof TYPE_ORDER] ?? 4;
    const typeB = TYPE_ORDER[b.data.type as keyof typeof TYPE_ORDER] ?? 4;

    if (typeA !== typeB) {
      return typeA - typeB;
    }

    // Tertiary sort: alphabetically by name
    return a.data.name.localeCompare(b.data.name);
  });
}
