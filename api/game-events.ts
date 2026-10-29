import { createGameEventsHandler } from "../server/game-events-handler.js";
import { storeGameEvent } from "../server/store-game-event.js";

export default {
  fetch(request: Request) {
    return createGameEventsHandler({
      enabled: process.env.VERCEL_ENV === "production" && process.env.GAME_ANALYTICS_ENABLED === "true",
      origin: process.env.GAME_ANALYTICS_ORIGIN,
      store: storeGameEvent,
    })(request);
  },
};
