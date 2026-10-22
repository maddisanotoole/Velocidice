import type { ThemeId } from "./palettes";
export type { ThemeId } from "./palettes";

export const THEMES = [
  { id: "current", name: "Original Charcoal" },
  { id: "felt", name: "Classic Felt" },
  { id: "midnight", name: "Midnight Blue" },
  { id: "vegas", name: "Las Vegas Casino" },
  { id: "arcade", name: "80s Arcade" },
  { id: "halloween", name: "Halloween" },
] as const;

export const THEME_STORAGE_KEY = "velocidice.theme";

export function loadTheme(): ThemeId {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.find((theme) => theme.id === stored)?.id ?? "current";
  } catch {
    return "current";
  }
}

export function saveTheme(id: ThemeId): boolean {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, id);
    return true;
  } catch {
    return false;
  }
}
