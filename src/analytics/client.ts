import type { GameEvent } from "./events";
import { createGameTracker } from "./tracker";

export function canCollectGameAnalytics(enabled: boolean, hostname: string, doNotTrack?: string | null, globalPrivacyControl?: boolean) {
  return enabled && !["localhost", "127.0.0.1", "[::1]"].includes(hostname)
    && doNotTrack !== "1" && !globalPrivacyControl;
}

export function analyticsEnabled() {
  if (typeof window === "undefined") return false;
  return canCollectGameAnalytics(import.meta.env.GAME_ANALYTICS_ENABLED === true, window.location.hostname,
    navigator.doNotTrack, (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
}

// One bounded retry uses the same event ID; PostgreSQL deduplicates accepted events.
export async function sendGameEvent(event: GameEvent, send: typeof fetch = fetch): Promise<void> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await send("/api/game-events", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event), credentials: "omit", keepalive: true,
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok || (response.status >= 400 && response.status < 500)) return;
    } catch { /* Best-effort reporting; no persistent queue or player identifier. */ }
  }
}

export function createBrowserGameTracker() {
  return createGameTracker({ enabled: analyticsEnabled, send: event => { void sendGameEvent(event); }, id: () => crypto.randomUUID() });
}
