import removeMd from "remove-markdown";

/**
 * GitHub-style alert block types supported in markdown content.
 */
export enum AlertType {
  NOTE = "note",
  TIP = "tip",
  IMPORTANT = "important",
  WARNING = "warning",
  CAUTION = "caution",
}

const ALERT_TYPES = Object.values(AlertType);

/**
 * Type guard — returns true if `value` is a valid {@link AlertType}
 */
export function isAlertType(value: unknown): value is AlertType {
  return Object.values(AlertType).some((t) => String(t) === value);
}

/**
 * Checks whether a string begins with a GitHub alert prefix (e.g. `[!NOTE]`)
 * and returns the matched {@link AlertType} and the remaining text, or `null`
 * if no prefix is found.
 */
export function parseAlertPrefix(
  value: string,
): { type: AlertType; rest: string } | null {
  for (const type of ALERT_TYPES) {
    const prefix = `[!${type.toUpperCase()}]`;
    if (value.toUpperCase().startsWith(prefix)) {
      return { type, rest: value.slice(prefix.length).trim() };
    }
  }
  return null;
}

/**
 * Converts markdown content to plain text, stripping all markdown syntax and
 * GitHub alert block markers (e.g. `[!NOTE]`) before processing.
 */
export function toPlainText(content: string): string {
  let text = content;
  for (const type of ALERT_TYPES) {
    text = text.replaceAll(`[!${type.toUpperCase()}]`, "");
  }
  return removeMd(text.trim());
}
