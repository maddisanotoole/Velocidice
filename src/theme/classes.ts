export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const theme = {
  app: {
    shell:
      "flex min-h-dvh flex-col items-center justify-start gap-4 bg-zinc-900 px-3 py-16 text-white sm:justify-center sm:gap-8 sm:px-4 sm:py-8",
  },
  button: {
    base: "select-none rounded-xl font-bold transition-colors duration-200 [-webkit-touch-callout:none]",
    disabled:
      "disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300 disabled:opacity-60 disabled:hover:bg-zinc-600 disabled:active:bg-zinc-600",
    color: {
      green: "bg-green-500 hover:bg-green-600 active:bg-green-700",
      blue: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
      red: "bg-red-500 hover:bg-red-600 active:bg-red-700",
      yellow: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700",
      purple: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700",
    },
    size: {
      normal: "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base",
      small: "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm",
    },
  },
  iconButton: {
    base: "rounded-full transition-colors active:bg-zinc-600",
    dark: "bg-zinc-950 hover:bg-zinc-700",
    raised: "bg-zinc-800 text-white shadow-lg hover:bg-zinc-700",
    size: "p-2.5 sm:p-3",
    fixedTopRight: "fixed right-3 top-3 z-40 sm:right-4 sm:top-4",
  },
  linkButton:
    "flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 font-bold text-white transition-colors hover:bg-zinc-700",
  modal: {
    overlay:
      "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-4 sm:items-center sm:px-4",
    centeredOverlay:
      "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 px-3 py-4 sm:px-4",
    panel:
      "max-h-[calc(100dvh-2rem)] w-full overflow-y-auto rounded-xl bg-zinc-800 p-4 text-white shadow-2xl sm:p-6",
    header: "mb-5 flex items-start justify-between gap-3 sm:mb-6 sm:gap-4",
  },
  menu: {
    overlay:
      "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-zinc-950 px-3 py-3 text-white sm:items-center sm:px-4 sm:py-4",
    panel:
      "flex min-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-y-auto rounded-xl bg-zinc-800 p-3 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:min-h-[42rem] sm:p-6",
    footer: "mt-auto pt-5 sm:pt-6",
  },
  brand: {
    logoTile:
      "mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2 shadow-lg",
    logoImage: "h-full w-full",
  },
  panel: {
    section:
      "mt-4 rounded-lg border border-zinc-700 px-3 py-3 sm:mt-6 sm:px-4",
    compact: "rounded-lg border border-zinc-700 px-3 py-3 sm:px-4",
    tile: "rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3",
  },
  option: {
    base: "rounded-lg border font-black uppercase transition-colors",
    selected: "border-purple-300 bg-purple-500 text-white",
    unselected: "border-zinc-600 bg-zinc-900 text-zinc-300 hover:bg-zinc-700",
  },
  text: {
    muted: "text-zinc-400",
    body: "text-zinc-300",
    heading: "text-white",
  },
  divider: {
    table: "divide-y divide-zinc-700 overflow-hidden rounded-lg border border-zinc-700",
  },
  feedback: {
    default: "text-white",
    danger: "text-red-400",
    success: "text-green-400",
  },
} as const;

export type ThemeButtonColor = keyof typeof theme.button.color;
export type ThemeButtonSize = keyof typeof theme.button.size;
