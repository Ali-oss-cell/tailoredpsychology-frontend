/**
 * Decorative background for public marketing routes. Purely visual; keep behind content with `main.relative` + z-index stacking.
 */
export function PublicMarketingAmbient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="bg-primary/[0.055] absolute -left-[20%] -top-32 h-[28rem] w-[28rem] rounded-full blur-3xl md:h-[32rem] md:w-[32rem]" />
      <div className="absolute -right-[15%] top-1/4 h-[22rem] w-[22rem] rounded-full bg-primary/[0.04] blur-3xl md:h-[28rem] md:w-[28rem]" />
      <div className="absolute bottom-0 left-1/3 h-64 w-72 rounded-full bg-muted/40 blur-3xl dark:bg-muted/20" />
    </div>
  )
}
