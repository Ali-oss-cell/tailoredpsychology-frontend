import { Lock, ShieldCheck, Stethoscope } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

type AuthTrustIndicatorsProps = {
  className?: string
}

const items = [
  { icon: Stethoscope, label: "Medicare eligible" },
  { icon: ShieldCheck, label: "Secure access" },
  { icon: Lock, label: "Privacy protected" },
] as const

export function AuthTrustIndicators({ className }: AuthTrustIndicatorsProps) {
  return (
    <ul
      className={cn("flex flex-wrap items-center justify-center gap-x-5 gap-y-2", className)}
      aria-label="Trust and security indicators"
    >
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Icon size={14} weight="duotone" className="text-primary shrink-0" aria-hidden />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}
