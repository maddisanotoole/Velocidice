import { createGameEventsHandler } from "../server/game-events-handler";
import { storeGameEvent } from "../server/store-game-event";

export default {
  fetch(request: Request) {
    return createGameEventsHandler({
      enabled: process.env.VERCEL_ENV === "production" && process.env.GAME_ANALYTICS_ENABLED === "true",
      origin: process.env.GAME_ANALYTICS_ORIGIN,
      store: storeGameEvent,
    })(request);
  },
};
