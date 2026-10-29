import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "import.meta.env.GAME_ANALYTICS_ENABLED": JSON.stringify(process.env.VERCEL_ENV === "production" && process.env.GAME_ANALYTICS_ENABLED === "true"),
  },
});
