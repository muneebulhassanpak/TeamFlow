// ─── Static constants ──────────────────────────────────────────────────────

/** Default colour palette shown in the project colour picker. */
export const DEFAULT_PROJECT_COLORS = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#F59E0B", // yellow
  "#8B5CF6", // purple
  "#F97316", // orange
  "#06B6D4", // cyan
  "#EC4899", // pink
] as const

// ─── Pure helpers ──────────────────────────────────────────────────────────

/** Returns the first character of a member's display name or email, uppercased,
 *  to use as an Avatar fallback. */
export function getMemberInitial(
  fullName: string | null | undefined,
  email: string
): string {
  return fullName?.[0]?.toUpperCase() ?? email[0]?.toUpperCase() ?? "?"
}
