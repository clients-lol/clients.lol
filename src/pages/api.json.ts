import { getClients } from "../lib/clients";

export async function GET() {
  const data = await getClients();
  const payload = Object.fromEntries(
    data.map(({ data, slug }) => [slug, data]),
  );

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
