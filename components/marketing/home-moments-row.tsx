import Image from "next/image"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"

type Moment = {
  src: string
  alt: string
  caption: string
}

type HomeMomentsRowProps = {
  title: string
  description: string
  moments: Moment[]
}

export function HomeMomentsRow({ title, description, moments }: HomeMomentsRowProps) {
  return (
    <PageSection>
      <PageContainer className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed md:text-lg">{description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {moments.map((moment) => (
            <figure
              key={moment.src}
              className="overflow-hidden rounded-2xl border border-border/70 bg-muted/10 shadow-sm"
            >
              <Image
                src={moment.src}
                alt={moment.alt}
                width={480}
                height={320}
                className="aspect-[3/2] h-auto w-full object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <figcaption className="text-muted-foreground border-border/60 border-t px-3 py-2.5 text-xs leading-snug sm:text-sm">
                {moment.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
