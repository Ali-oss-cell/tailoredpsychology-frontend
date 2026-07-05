import { cn } from "@/lib/utils"

export type ScrollSectionVariant =
  | "rise"
  | "rise-scale"
  | "split"
  | "cards"
  | "process"
  | "faq"
  | "band"

type ScrollSectionProps = {
  variant: ScrollSectionVariant
  children: React.ReactNode
  className?: string
}

/** Landing-page scroll target — animated by `HomepageObserver` (GSAP ScrollTrigger). */
export function ScrollSection({ variant, children, className }: ScrollSectionProps) {
  return (
    <div data-scroll-section={variant} className={cn(className)}>
      {children}
    </div>
  )
}
