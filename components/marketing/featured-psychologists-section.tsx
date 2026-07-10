import Image from "next/image"
import Link from "next/link"
import { Translate } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Button } from "@/components/ui/button"

export type FeaturedClinicianCard = {
  id: string
  name: string
  specialty: string
  languages: readonly string[]
  profileImageUrl: string
  bookHref: string
}

type FeaturedPsychologistsSectionProps = {
  title: string
  description: string
  disclaimer: string
  clinicians: FeaturedClinicianCard[]
}

function formatLanguages(languages: readonly string[]): string {
  return languages
    .map((lang) => lang.charAt(0).toUpperCase() + lang.slice(1))
    .join(", ")
}

export function FeaturedPsychologistsSection({
  title,
  description,
  disclaimer,
  clinicians,
}: FeaturedPsychologistsSectionProps) {
  return (
    <PageSection id="psychologists" muted className="scroll-mt-24">
      <PageContainer className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <h2 className="marketing-h2 text-balance">{title}</h2>
          <p className="marketing-body text-muted-foreground">{description}</p>
          <p className="marketing-small italic">{disclaimer}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {clinicians.map((clinician) => (
            <article key={clinician.id} className="marketing-card interactive-lift overflow-hidden">
              <div className="relative aspect-[4/3] bg-muted/40">
                <Image
                  src={clinician.profileImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
              <div className="space-y-3 p-5 md:p-6">
                <div>
                  <h3 className="text-lg font-semibold leading-snug">{clinician.name}</h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {clinician.specialty}
                  </p>
                </div>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Translate size={16} weight="duotone" aria-hidden />
                  <span>{formatLanguages(clinician.languages)}</span>
                </p>
                <Button asChild className="marketing-cta w-full sm:w-auto">
                  <Link href={clinician.bookHref}>Book with {clinician.name.split(" ")[0]}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
