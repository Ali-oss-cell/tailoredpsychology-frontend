/**
 * Tutorials in production: set `NEXT_PUBLIC_TUTORIALS=1` on the deployment (or leave unset = off).
 *
 * Local `next dev`: tutorials run by default so new accounts see the tour without editing env.
 * To turn them off locally: `NEXT_PUBLIC_TUTORIALS=0` in `.env.local`.
 */
export function tutorialsEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_TUTORIALS?.toLowerCase()
  if (raw === "0" || raw === "false") return false
  if (raw === "1" || raw === "true") return true
  return process.env.NODE_ENV === "development"
}
