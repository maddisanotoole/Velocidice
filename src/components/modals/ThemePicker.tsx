import { useEffect, useRef, useState } from "react";
import { DEFAULT_THEME, THEMES, type ThemeId } from "../../theme/preferences";
import { cx, theme } from "../../theme/classes";
import { getThemeStyle } from "../../theme/styles";

const pips: Record<number, number[]> = { 1: [4], 3: [0, 4, 8], 5: [0, 2, 4, 6, 8] };

function PreviewDice() {
  return <span className="theme-preview-dice" aria-hidden="true">{[1, 5, 3].map((value) => (
    <span className="theme-preview-die" data-preview-state={value === 1 ? "available" : value === 5 ? "selected" : "held"} key={value}>{Array.from({ length: 9 }, (_, index) => <i key={index} className={pips[value].includes(index) ? "pip-visible" : ""} />)}</span>
  ))}</span>;
}

export function ThemePicker({ themeId, onApply, onClose }: {
  themeId: ThemeId;
  onApply: (id: ThemeId) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<ThemeId>(
    THEMES.some((item) => item.id === themeId) ? themeId : DEFAULT_THEME,
  );
  const panel = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    panel.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); close.current(); }
      if (event.key === "Tab") {
        const buttons = panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        if (!buttons?.length) return;
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  return <div className={theme.modal.centeredOverlay} onClick={onClose}>
    <section ref={panel} className={cx(theme.modal.panel, "max-w-lg")} role="dialog" aria-modal="true" aria-labelledby="theme-picker-title" onClick={(event) => event.stopPropagation()}>
      <div className={theme.modal.header}>
        <div><h2 id="theme-picker-title" className="text-2xl font-black">Choose your theme</h2><p className={cx("mt-1 text-sm", theme.text.muted)}>A new look for your dice and table.</p></div>
        <button type="button" className="theme-picker-back theme-choice-focus" onClick={onClose}>Back</button>
      </div>
      <div className="theme-live-preview" data-theme={selected} style={getThemeStyle(selected)} aria-label="Theme preview">
        <p className="theme-preview-title">{THEMES.find((item) => item.id === selected)?.name}</p>
        <PreviewDice />
        <div className="theme-preview-labels" aria-hidden="true"><span>Available</span><span>Selected</span><span>Held</span></div>
        <div className="theme-preview-actions" aria-hidden="true"><span>Reroll</span><span>Bank points</span></div>
      </div>
      <div className="theme-options" aria-label="Themes">
        {THEMES.map((item) => <button type="button" key={item.id} className="theme-option theme-choice-focus" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>
          <span data-theme={item.id} style={getThemeStyle(item.id)} className="theme-swatch"><PreviewDice /></span>
          <span className="theme-option-caption">
            <span className="theme-option-name">{item.name}</span>
            <span className="theme-option-state">{selected === item.id ? "✓ Selected" : "Preview"}</span>
          </span>
        </button>)}
      </div>
      <button type="button" className="theme-apply theme-choice-focus" onClick={() => { onApply(selected); onClose(); }}>Use this theme</button>
    </section>
  </div>;
}
