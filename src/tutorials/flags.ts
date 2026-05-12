/**
 * Tutorials are **on** in all environments unless explicitly disabled.
 * Set `NEXT_PUBLIC_TUTORIALS=0` (or `false`) in production to hide tours.
 */
export function tutorialsEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_TUTORIALS?.toLowerCase()
  if (raw === "0" || raw === "false") return false
  return true
}
