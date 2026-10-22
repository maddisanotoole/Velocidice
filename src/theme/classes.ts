export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const theme = {
  app: {
    shell:
      "vd-shell flex min-h-dvh flex-col items-center justify-start gap-3 bg-[var(--surface-deep)] px-3 py-3 text-[var(--ink)] sm:justify-center sm:gap-8 sm:px-4 sm:py-8",
  },
  button: {
    base: "select-none rounded-xl font-bold transition-colors duration-200 [-webkit-touch-callout:none]",
    disabled:
      "disabled:cursor-not-allowed disabled:bg-[var(--disabled)] disabled:text-[var(--muted)] disabled:opacity-60 disabled:hover:bg-[var(--disabled)] disabled:active:bg-[var(--disabled)]",
    color: {
      green: "bg-[var(--positive)] hover:bg-[var(--positive)] active:bg-[var(--positive)]",
      blue: "bg-[var(--roll)] hover:bg-[var(--roll)] active:bg-[var(--roll)]",
      red: "bg-[var(--danger-button)] hover:bg-[var(--danger-button)] active:bg-[var(--danger-button)]",
      yellow: "bg-[var(--bank)] hover:bg-[var(--bank)] active:bg-[var(--bank)]",
      purple: "bg-[var(--secondary)] hover:bg-[var(--secondary)] active:bg-[var(--secondary)]",
    },
    size: {
      normal: "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base",
      small: "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm",
    },
  },
  iconButton: {
    base: "rounded-full transition-colors active:bg-[var(--disabled)]",
    dark: "bg-[var(--surface-deep)] hover:bg-[var(--hover)]",
    raised: "bg-[var(--surface)] text-[var(--ink)] shadow-lg hover:bg-[var(--hover)]",
    size: "p-2.5 sm:p-3",
    fixedTopRight: "fixed right-3 top-3 z-50 sm:right-4 sm:top-4",
  },
  linkButton:
    "flex items-center justify-center gap-2 rounded-xl bg-[var(--surface-deep)] px-4 py-3 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--hover)]",
  modal: {
    overlay:
      "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--overlay)] px-3 py-4 sm:items-center sm:px-4",
    centeredOverlay:
      "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[var(--overlay)] px-3 py-4 sm:px-4",
    panel:
      "max-h-[calc(100dvh-2rem)] w-full overflow-y-auto rounded-xl bg-[var(--surface)] p-4 text-[var(--ink)] shadow-2xl sm:p-6",
    header: "mb-5 flex items-start justify-between gap-3 sm:mb-6 sm:gap-4",
  },
  menu: {
    overlay:
      "vd-menu fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--surface-deep)] px-3 py-3 text-[var(--ink)] sm:items-center sm:px-4 sm:py-4",
    panel:
      "flex min-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-y-auto rounded-xl bg-[var(--surface)] p-3 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:min-h-[42rem] sm:p-6",
    footer: "mt-auto pt-5 sm:pt-6",
  },
  brand: {
    logoTile:
      "mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--dice)] p-2 shadow-lg",
    logoImage: "h-full w-full",
  },
  panel: {
    section:
      "mt-4 rounded-lg border border-[var(--line)] px-3 py-3 sm:mt-6 sm:px-4",
    compact: "rounded-lg border border-[var(--line)] px-3 py-3 sm:px-4",
    tile: "rounded-lg border border-[var(--line)] bg-[var(--surface-deep)] px-3 py-3",
  },
  option: {
    base: "rounded-lg border font-black uppercase transition-colors",
    selected: "border-[var(--line)] bg-[var(--secondary)] text-[var(--secondary-ink)]",
    unselected: "border-[var(--line)] bg-[var(--surface-deep)] text-[var(--muted)] hover:bg-[var(--hover)]",
  },
  text: {
    muted: "text-[var(--muted)]",
    body: "text-[var(--muted)]",
    heading: "text-[var(--ink)]",
  },
  divider: {
    table: "divide-y divide-[var(--line)] overflow-hidden rounded-lg border border-[var(--line)]",
  },
  feedback: {
    default: "text-[var(--neutral)]",
    danger: "text-[var(--danger)]",
    success: "text-[var(--success)]",
    warning: "text-[var(--warning)]",
  },
} as const;

export type ThemeButtonColor = keyof typeof theme.button.color;
export type ThemeButtonSize = keyof typeof theme.button.size;
