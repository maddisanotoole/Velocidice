export function logDebug(event: string, details?: Record<string, unknown>) {
  if (!import.meta.env.DEV) {
    return;
  }

  console.debug(event, details);
}
