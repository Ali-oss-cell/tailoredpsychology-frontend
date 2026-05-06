type PatientPageHeaderProps = {
  title: string
  description: string
}

export function PatientPageHeader({ title, description }: PatientPageHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground max-w-3xl text-sm md:text-base">{description}</p>
    </header>
  )
}
