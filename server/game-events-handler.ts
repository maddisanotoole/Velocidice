import { isGameEvent, type GameEvent } from "../src/analytics/events";

type Settings = { enabled: boolean; origin: string | undefined; store: (event: GameEvent) => Promise<void> };

export function createGameEventsHandler({ enabled, origin, store }: Settings) {
  return async (request: Request): Promise<Response> => {
    const reply = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store", ...(status === 405 ? { Allow: "POST" } : {}) } });
    if (request.method !== "POST") return reply(405);
    if (!enabled || !origin) return reply(503);
    // Check a configured canonical origin, not caller-controlled forwarded headers.
    if (request.headers.get("origin") !== origin || request.headers.get("sec-fetch-site") === "cross-site") return reply(403);
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return reply(415);
    if (Number(request.headers.get("content-length")) > 2048) return reply(413);
    let event: unknown;
    try {
      const body = await request.text();
      if (new TextEncoder().encode(body).length > 2048) return reply(413);
      event = JSON.parse(body);
    } catch { return reply(400); }
    if (!isGameEvent(event)) return reply(400);
    try {
      await store(event);
      return reply(204);
    } catch {
      // Do not log payloads, request headers or database credentials.
      console.error("Game analytics write failed");
      return reply(503);
    }
  };
}
