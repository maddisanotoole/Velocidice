import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Button from "../components/buttons/GameButton";
import { DieFace } from "../components/dice/DiceFace";
import { DieStatus } from "../types";
import { getThemeStyle } from "./styles";

describe("approved component themes", () => {
  it("keeps menu selection, Stats, turn banners and reroll colours independent", () => {
    expect(getThemeStyle("vegas")).toMatchObject({
      "--menu_selection": "#28583f", "--stats_button": "#dbcba1",
      "--opponent_turn": "#813346", "--opponent_available": "#d5a5a6",
    });
    expect(getThemeStyle("midnight")).toMatchObject({
      "--your_turn": "#f5faff", "--reroll_button": "#92e0c6",
      "--held": "#92e0c6", "--selected": "#39d6f0",
    });
    expect(getThemeStyle("current")).toMatchObject({
      "--start_button": "#1d4ed8", "--confirm_button": "#7e22ce",
      "--rules_button": "#d8d8da", "--theme_button": "#d8d8da",
    });
  });

  it("lets a game action use its own role instead of its legacy button colour", () => {
    const html = renderToStaticMarkup(createElement(Button, {
      onClick: () => {}, color: "blue", themeRole: "reroll_button", children: "Hold & Reroll",
    }));
    expect(html).toContain('data-theme-role="reroll_button"');
    expect(html).toContain("var(--reroll_button)");
  });

  it("preserves the opponent identity for selected dice and gives held dice precedence", () => {
    const props = {
      onClick: () => {}, currentPlayer: "player2" as const, rollAnimationKey: "preview",
      die: { id: 1, value: 5, status: DieStatus.SELECTED },
    };
    const selected = renderToStaticMarkup(createElement(DieFace, props));
    expect(selected).toContain('data-player="player2"');
    expect(selected).toContain('data-state="selected"');
    const held = renderToStaticMarkup(createElement(DieFace, { ...props, isBanked: true }));
    expect(held).toContain('data-state="held"');
    expect(held).not.toContain('class="vd-selection-tick"');
  });
});
