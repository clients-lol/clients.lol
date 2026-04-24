import { getCollection } from "astro:content";

export async function GET() {
  const clients = await getCollection("clients");

  const data = clients.map((client) => ({
    slug: client.slug,
    ...client.data,
    body: client.body,
  }));

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
