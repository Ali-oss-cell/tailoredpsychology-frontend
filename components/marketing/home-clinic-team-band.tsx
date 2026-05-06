import Image from "next/image"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"

type HomeClinicTeamBandProps = {
  title: string
  description: string
  clinic: { src: string; alt: string; caption: string }
  team: { src: string; alt: string; caption: string }
}

export function HomeClinicTeamBand({ title, description, clinic, team }: HomeClinicTeamBandProps) {
  return (
    <PageSection>
      <PageContainer className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed md:text-lg">{description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[clinic, team].map((block) => (
            <figure
              key={block.src}
              className="overflow-hidden rounded-2xl border border-border/70 bg-muted/10 shadow-sm"
            >
              <Image
                src={block.src}
                alt={block.alt}
                width={720}
                height={480}
                className="aspect-[4/3] h-auto w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <figcaption className="text-muted-foreground border-border/60 border-t px-3 py-2.5 text-sm leading-snug">
                {block.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
