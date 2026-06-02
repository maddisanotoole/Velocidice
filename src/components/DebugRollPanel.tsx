import { useState } from "react";
import { parseDebugRolls } from "../game/debugRolls";

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
    <aside className="fixed bottom-3 left-3 z-40 w-[min(22rem,calc(100vw-1.5rem))] rounded-lg border border-amber-300 bg-zinc-950/95 text-white shadow-2xl">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs font-black uppercase tracking-wide text-amber-200"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>Debug Rolls</span>
        <span className="rounded bg-amber-300 px-2 py-0.5 text-zinc-950">
          {queuedRollCount}
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-zinc-700 p-3">
          <textarea
            className="h-28 w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-white outline-none focus:border-amber-300"
            onChange={(event) => onRollPresetTextChange(event.target.value)}
            placeholder={"1 2 3 4 5 6\n2, 3, 4\n1 1 1 5 5 5"}
            spellCheck={false}
            value={rollPresetText}
          />
          <p className="mt-2 text-xs leading-5 text-zinc-400">
            One upcoming roll per line. Values must be 1-6. Extra values are
            ignored for partial rerolls.
          </p>
        </div>
      )}
    </aside>
  );
}
