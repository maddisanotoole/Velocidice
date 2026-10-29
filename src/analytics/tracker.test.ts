import { afterEach, describe, expect, it, vi } from "vitest";
import { isGameEvent, type GameEvent } from "./events";
import { createGameTracker } from "./tracker";
import { canCollectGameAnalytics, sendGameEvent } from "./client";

const config = { mode: "computer" as const, targetScore: 2000, matchLength: 3 as const };
function setup(enabled = true) {
  const events: GameEvent[] = [];
  const tracker = createGameTracker({ enabled: () => enabled, id: () => crypto.randomUUID(), send: event => { events.push(event); } });
  return { tracker, events };
}
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("anonymous game tracking", () => {
  it("counts games separately from matches, preserves match ID and deduplicates completion", () => {
    const { tracker, events } = setup();
    tracker.start(config, true);
    tracker.turnEnded(); tracker.turnEnded();
    tracker.complete("player", { player: 2000, player2: 500 }, { player: 1, player2: 0 }, null);
    tracker.complete("player", { player: 2000, player2: 500 }, { player: 1, player2: 0 }, null);
    expect(events.map(event => event.kind)).toEqual(["game_started", "game_completed"]);
    expect(events[1].turnCount).toBe(2);
    tracker.start(config, false);
    tracker.turnEnded();
    tracker.complete("player", { player: 2050, player2: 0 }, { player: 2, player2: 0 }, "player");
    expect(events.map(event => event.kind)).toEqual(["game_started", "game_completed", "game_started", "game_completed", "match_completed"]);
    expect(events[2].gameId).not.toBe(events[0].gameId);
    expect(events.every(event => event.matchId === events[0].matchId)).toBe(true);
    expect(events[4].turnCount).toBe(3);
    expect(events.every(isGameEvent)).toBe(true);
  });

  it("uses a new match on restart, emits nothing for menu return, and counts single/local matches", () => {
    const { tracker, events } = setup();
    tracker.start(config, true);
    const previous = events[0].matchId;
    tracker.start({ ...config, mode: "local", matchLength: 1 }, true);
    expect(events[1].matchId).not.toBe(previous);
    tracker.turnEnded();
    tracker.complete("player2", { player: 0, player2: 2000 }, { player: 0, player2: 1 }, "player2");
    expect(events.slice(-2).map(event => event.kind)).toEqual(["game_completed", "match_completed"]);
    expect(events.slice(-2).every(event => event.mode === "local" && event.winner === "player2")).toBe(true);
    tracker.stop();
    tracker.turnEnded();
    tracker.complete("player", { player: 2000, player2: 0 }, { player: 1, player2: 0 }, "player");
    expect(events).toHaveLength(4);
  });

  it("does not collect disabled games or games that never start (tutorial practice)", () => {
    const { tracker, events } = setup(false);
    tracker.start(config, true);
    tracker.turnEnded();
    tracker.complete("player", { player: 2000, player2: 0 }, { player: 1, player2: 0 }, null);
    expect(events).toEqual([]);
    const tutorial = setup();
    tutorial.tracker.turnEnded();
    tutorial.tracker.complete("player", { player: 2000, player2: 0 }, { player: 1, player2: 0 }, null);
    expect(tutorial.events).toEqual([]);
  });

  it("excludes the entire debug match, including later games, but allows a fresh normal match", () => {
    const { tracker, events } = setup();
    tracker.start(config, true, true);
    tracker.turnEnded();
    tracker.complete("player", { player: 2000, player2: 0 }, { player: 1, player2: 0 }, null);
    tracker.start(config, false);
    expect(events).toEqual([]);
    tracker.start(config, true);
    tracker.exclude();
    tracker.turnEnded();
    tracker.complete("player", { player: 2000, player2: 0 }, { player: 1, player2: 0 }, null);
    expect(events.map(event => event.kind)).toEqual(["game_started"]);
  });

  it("honours deployment, localhost and browser privacy gates", () => {
    expect(canCollectGameAnalytics(false, "velocidice.vercel.app")).toBe(false);
    expect(canCollectGameAnalytics(true, "velocidice.vercel.app")).toBe(true);
    expect(canCollectGameAnalytics(true, "velocidice.vercel.app", "1")).toBe(false);
    expect(canCollectGameAnalytics(true, "velocidice.vercel.app", "0", true)).toBe(false);
    expect(canCollectGameAnalytics(true, "localhost")).toBe(false);
  });

  it("retries with the identical event ID, omits credentials, and swallows unavailable endpoints", async () => {
    const { tracker, events } = setup(); tracker.start(config, true);
    const send = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(null, { status: 503 })).mockResolvedValueOnce(new Response(null, { status: 204 }));
    await sendGameEvent(events[0], send);
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[0][1]?.body).toBe(send.mock.calls[1][1]?.body);
    expect(send.mock.calls[0][1]?.credentials).toBe("omit");
    send.mockReset().mockRejectedValue(new Error("offline"));
    await expect(sendGameEvent(events[0], send)).resolves.toBeUndefined();
    expect(send).toHaveBeenCalledTimes(2);
    send.mockReset().mockResolvedValue(new Response(null, { status: 400 }));
    await sendGameEvent(events[0], send);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("does not let unavailable ID generation or reporting interrupt play", () => {
    const tracker = createGameTracker({ enabled: () => true, id: () => { throw new Error("unavailable"); }, send: () => {} });
    expect(() => tracker.start(config, true)).not.toThrow();
  });
});
