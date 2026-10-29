import { afterEach, describe, expect, it, vi } from "vitest";
import { createGameEventsHandler } from "./game-events-handler";
import { isGameEvent, type GameEvent } from "../src/analytics/events";
import { storeGameEvent } from "./store-game-event";
import endpoint from "../api/game-events";

const { query } = vi.hoisted(() => ({ query: vi.fn().mockResolvedValue([]) }));
vi.mock("@neondatabase/serverless", () => ({ neon: vi.fn(() => query) }));
const event: GameEvent = {
  version: 1, eventId: "00000000-0000-4000-8000-000000000001", gameId: "00000000-0000-4000-8000-000000000002", matchId: "00000000-0000-4000-8000-000000000003",
  kind: "game_completed", mode: "computer", targetScore: 2000, matchLength: 3,
  winner: "player", playerScore: 2000, opponentScore: 500, turnCount: 10, playerWins: 1, opponentWins: 0,
};
function request(body: unknown = event, headers: Record<string, string> = {}) {
  return new Request("https://example.com/api/game-events", { method: "POST", headers: { origin: "https://example.com", "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
}
afterEach(() => { vi.clearAllMocks(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("game event ingestion", () => {
  it("stores accepted events and exposes no reads or identifying response", async () => {
    const store = vi.fn().mockResolvedValue(undefined);
    const handler = createGameEventsHandler({ enabled: true, origin: "https://example.com", store });
    const response = await handler(request());
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(store).toHaveBeenCalledWith(event);
    const get = await handler(new Request("https://example.com/api/game-events"));
    expect(get.status).toBe(405);
    expect(get.headers.get("allow")).toBe("POST");
  });

  it("rejects foreign/missing origins, oversized payloads, unknown fields and invalid results before storage", async () => {
    const store = vi.fn();
    const handler = createGameEventsHandler({ enabled: true, origin: "https://example.com", store });
    for (const [payload, headers, status] of [
      [event, { origin: "https://other.com" }, 403], [event, { origin: "" }, 403],
      [event, { "sec-fetch-site": "cross-site" }, 403], [event, { "content-type": "text/plain" }, 415],
      [{ ...event, playerName: "not allowed" }, {}, 400], [{ ...event, turnCount: -1 }, {}, 400],
      [{ ...event, eventId: "bad" }, {}, 400], [{ ...event, playerScore: 100 }, {}, 400],
      [{ ...event, playerScore: 2051 }, {}, 400], [{ ...event, targetScore: 9999 }, {}, 400],
      [{ ...event, kind: "match_completed" }, {}, 400], [{ ...event, extra: "x".repeat(3000) }, {}, 413],
    ] as [unknown, Record<string, string>, number][]) {
      expect((await handler(request(payload, headers))).status).toBe(status);
    }
    const malformed = request();
    expect((await handler(new Request(malformed.url, { method: "POST", headers: malformed.headers, body: "{" }))).status).toBe(400);
    expect(store).not.toHaveBeenCalled();
  });

  it("fails closed outside production or when disabled, without accessing the database", async () => {
    vi.stubEnv("VERCEL_ENV", "preview"); vi.stubEnv("GAME_ANALYTICS_ENABLED", "true");
    expect((await endpoint.fetch(request())).status).toBe(503);
    expect(query).not.toHaveBeenCalled();
    vi.stubEnv("VERCEL_ENV", "production"); vi.stubEnv("GAME_ANALYTICS_ENABLED", "false");
    expect((await endpoint.fetch(request())).status).toBe(503);
  });

  it("connects the production endpoint to the parameterised database writer", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("GAME_ANALYTICS_ENABLED", "true");
    vi.stubEnv("GAME_ANALYTICS_ORIGIN", "https://example.com");
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost/test");
    expect((await endpoint.fetch(request())).status).toBe(204);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0]).toContain(event.eventId);
  });

  it("reports storage failures without leaking credentials or submitted data", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const handler = createGameEventsHandler({ enabled: true, origin: "https://example.com", store: async () => { throw new Error("private database details"); } });
    const response = await handler(request());
    expect(response.status).toBe(503);
    expect(await response.text()).toBe("");
    expect(log).toHaveBeenCalledExactlyOnceWith("Game analytics write failed");
  });

  it("uses parameterised SQL and database conflict handling for retry deduplication", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost/test");
    await storeGameEvent(event);
    const [sql, ...values] = query.mock.calls[0];
    expect(sql.join("?")).toContain("ON CONFLICT DO NOTHING");
    expect(values).toContain(event.eventId);
    expect(values).toContain(event.gameId);
    expect(values).toContain(event.matchId);
  });

  it("accepts valid start and match events and rejects premature starts after a won match", () => {
    expect(isGameEvent({ ...event, kind: "game_started", winner: null, playerScore: 0, opponentScore: 0, turnCount: 0 })).toBe(true);
    expect(isGameEvent({ ...event, kind: "game_started", winner: null, playerScore: 0, opponentScore: 0, turnCount: 0, playerWins: 2 })).toBe(false);
    expect(isGameEvent({ ...event, kind: "match_completed", playerWins: 2 })).toBe(true);
  });
});
