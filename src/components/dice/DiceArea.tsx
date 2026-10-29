import type { ReactNode } from "react";

export function DiceArea({ hasFarkled, children }: { hasFarkled: boolean; children: ReactNode }) {
  return (
    <div className="vd-dice-area" data-farkled={hasFarkled ? "true" : undefined}>
      <div className="vd-dice-area-tray">{children}</div>
      <div className="vd-farkle-announcement" role="status" aria-atomic="true">
        {hasFarkled && (
          <div className="vd-farkle-card">
            <strong className="vd-farkle-title">FARKLE!</strong>
            <span className="vd-farkle-description">No scoring dice · Turn points lost</span>
          </div>
        )}
      </div>
    </div>
  );
}
