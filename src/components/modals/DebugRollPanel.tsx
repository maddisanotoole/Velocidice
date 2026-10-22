import { useState } from "react";
import { parseDebugRolls } from "../../game/debugRolls";

type DebugRollPanelProps = {
  onRollPresetTextChange: (text: string) => void;
  rollPresetText: string;
};

export function DebugRollPanel({
  onRollPresetTextChange,
  rollPresetText,
}: DebugRollPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queuedRollCount = parseDebugRolls(rollPresetText).length;

  return (
    <aside className="rounded-lg border border-[var(--accent)] bg-[var(--surface-deep)] text-[var(--ink)] shadow-2xl">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs font-black uppercase tracking-wide text-[var(--ink)]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>Debug Rolls</span>
        <span className="rounded bg-[var(--highlight)] px-2 py-0.5 text-[var(--highlight-ink)]">
          {queuedRollCount}
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-[var(--line)] p-3">
          <textarea
            className="h-28 w-full resize-none rounded-md border border-[var(--line)] bg-[var(--surface-deep)] p-2 font-mono text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            onChange={(event) => onRollPresetTextChange(event.target.value)}
            placeholder={"1 2 3 4 5 6\n2, 3, 4\n1 1 1 5 5 5"}
            spellCheck={false}
            value={rollPresetText}
          />
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            One upcoming roll per line. Values must be 1-6. Extra values are
            ignored for partial rerolls.
          </p>
        </div>
      )}
    </aside>
  );
}
