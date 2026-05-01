import path from "node:path";

import { Client } from "./schema";

export async function generate(directory: string): Promise<Record<string, Client>> {
  const result: Record<string, Client> = {};

  for await (const clientPath of new Bun.Glob("*.toml").scan({
    absolute: true,
    cwd: directory,
  })) {
    const clientID = path.basename(clientPath, ".toml");
    const toml = await import(clientPath, {
      with: {
        type: "toml",
      },
    }).then((mod) => mod.default);
    const client = Client.safeParse({
      ...toml,
      id: clientID,
    });

    if (!client.success) {
      client.error.cause = { clientPath, toml };
      throw client.error;
    }

    result[clientID] = client.data;
  }

  return Object.fromEntries(
    Object.entries(result).sort(([, first], [, second]) => first.name.localeCompare(second.name)),
  );
}
