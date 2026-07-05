import { hasPublishedContactDetails, publicContactDetails } from "@/content/legal/public-contact"

export function PublicContactDetailsSection() {
  if (!hasPublishedContactDetails()) {
    return null
  }

  const lines: { label: string; value: string }[] = []
  if (publicContactDetails.privacyOfficerName.trim()) {
    lines.push({ label: "Privacy officer", value: publicContactDetails.privacyOfficerName.trim() })
  }
  if (publicContactDetails.privacyEmail.trim()) {
    lines.push({ label: "Privacy enquiries", value: publicContactDetails.privacyEmail.trim() })
  }
  if (publicContactDetails.generalEmail.trim()) {
    lines.push({ label: "General enquiries", value: publicContactDetails.generalEmail.trim() })
  }
  if (publicContactDetails.phone.trim()) {
    lines.push({ label: "Phone", value: publicContactDetails.phone.trim() })
  }
  if (publicContactDetails.postalAddress.trim()) {
    lines.push({ label: "Postal address", value: publicContactDetails.postalAddress.trim() })
  }
  if (publicContactDetails.abn?.trim()) {
    lines.push({ label: "ABN", value: publicContactDetails.abn.trim() })
  }

  return (
    <section className="border-border/50 border-b py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wide">Contact details</p>
        <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {publicContactDetails.entityName}
        </h2>
        <dl className="mt-6 space-y-4">
          {lines.map((line) => (
            <div key={line.label}>
              <dt className="text-muted-foreground text-sm font-medium">{line.label}</dt>
              <dd className="mt-1 text-sm leading-relaxed whitespace-pre-line md:text-base">{line.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
