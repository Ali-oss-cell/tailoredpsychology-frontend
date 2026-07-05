import { cn } from "@/lib/utils"

type PortalPageHeaderProps = {
  title: string
  description: string
  eyebrow?: string
  className?: string
}

export function PortalPageHeader({ title, description, eyebrow, className }: PortalPageHeaderProps) {
  return (
    <header className={cn("space-y-2", className)}>
      {eyebrow ? <p className="card-eyebrow">{eyebrow}</p> : null}
      <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed md:text-base">{description}</p>
    </header>
  )
}
