import type { CSSProperties } from "react";
import { PALETTES, type ThemeId, type ThemeRole } from "./palettes";

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((index) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

export function readableInk(hex: string): string {
  const background = luminance(hex), dark = luminance("#171717");
  const contrast = (Math.max(background, dark) + 0.05) / (Math.min(background, dark) + 0.05);
  return contrast >= 1.05 / (background + 0.05) ? "#171717" : "#ffffff";
}

// Shared surfaces retain semantic aliases; interactive components use their own roles.
const aliases: Record<string, ThemeRole> = {
  table: "table_surface", surface: "menu_surface", "surface-deep": "disabled_surface",
  ink: "menu_text", muted: "disabled_text", line: "disabled_text", hover: "menu_surface",
  dice: "available", pip: "available", selected: "selected", accent: "focus_ring",
  roll: "reroll_button", bank: "bank_button", positive: "start_button", secondary: "menu_selection",
  "danger-button": "confirm_button", success: "success_message", danger: "error_message",
  warning: "warning_message", highlight: "active_score", "opponent-dice": "opponent_available",
  disabled: "disabled_surface", "disabled-ink": "disabled_text", points: "point_increase",
  neutral: "neutral_message",
};

export function getThemeStyle(id: ThemeId): CSSProperties {
  const palette = PALETTES[id] ?? PALETTES.current;
  const vars: Record<string, string> = { "--overlay": "#000b", "--icon-filter": "none" };
  for (const [role, color] of Object.entries(palette)) {
    vars[`--${role}`] = color;
    vars[`--${role}-ink`] = readableInk(color);
  }
  for (const [alias, role] of Object.entries(aliases)) {
    vars[`--${alias}`] = palette[role];
    vars[`--${alias}-ink`] = readableInk(palette[role]);
  }
  // Pips contrast with available dice; disabled labels keep the supplied text colour.
  vars["--pip"] = readableInk(palette.available);
  vars["--disabled-ink"] = palette.disabled_text;
  return vars as CSSProperties;
}
