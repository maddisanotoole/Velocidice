import { afterEach, describe, expect, it, vi } from "vitest";
import { loadTheme, saveTheme, THEMES, THEME_STORAGE_KEY } from "./preferences";

afterEach(() => vi.unstubAllGlobals());

function mockStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  vi.stubGlobal("window", { localStorage: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  } });
  return values;
}

describe("theme preferences", () => {
  it("defaults to Midnight Blue for new or invalid preferences", () => {
    mockStorage();
    expect(loadTheme()).toBe("midnight");
    mockStorage({ [THEME_STORAGE_KEY]: "unknown-theme" });
    expect(loadTheme()).toBe("midnight");
  });

  it.each(THEMES)("restores $name after saving and starting a new session", ({ id }) => {
    const records = '{"vsComputer":{"wins":42}}';
    const values = mockStorage({ "velocidice.records": records });
    expect(saveTheme(id)).toBe(true);
    // Recreate browser storage access, as on a fresh application load.
    mockStorage(Object.fromEntries(values));
    expect(loadTheme()).toBe(id);
    expect(values.get("velocidice.records")).toBe(records);
    expect([...values.keys()].sort()).toEqual(["velocidice.records", THEME_STORAGE_KEY].sort());
  });

  it("keeps the app usable when browser storage is unavailable", () => {
    vi.stubGlobal("window", { get localStorage() { throw new Error("Storage blocked"); } });
    expect(loadTheme()).toBe("midnight");
    expect(saveTheme("halloween")).toBe(false);
  });

  it("offers only the six decided themes and safely handles a retired preview preference", () => {
    expect(THEMES.map((theme) => theme.id)).toEqual([
      "current", "felt", "midnight", "vegas", "arcade", "halloween",
    ]);
    const records = '{"vsComputer":{"wins":42}}';
    const values = mockStorage({ [THEME_STORAGE_KEY]: "timber", "velocidice.records": records });
    expect(loadTheme()).toBe("midnight");
    expect(values.get("velocidice.records")).toBe(records);
  });
});
