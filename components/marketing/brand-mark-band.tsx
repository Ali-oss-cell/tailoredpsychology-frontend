import Image from "next/image"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"

type BrandMarkBandProps = {
  title: string
  body?: string
  imageSrc: string
  imageAlt: string
  layout?: "mark" | "photo"
}

export function BrandMarkBand({ title, body, imageSrc, imageAlt, layout = "mark" }: BrandMarkBandProps) {
  return (
    <PageSection muted className="py-12 md:py-16">
      <PageContainer className="flex flex-col items-center gap-6 text-center">
        {layout === "photo" ? (
          <div className="border-border/60 relative aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-2xl border shadow-md">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 48rem"
              priority={false}
            />
          </div>
        ) : (
          <div className="relative max-w-md">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={640}
              height={200}
              className="mx-auto h-auto w-full max-w-[min(100%,20rem)] object-contain"
              sizes="(max-width: 768px) 100vw, 20rem"
              priority={false}
            />
          </div>
        )}
        <div className="max-w-xl space-y-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
          {body ? <p className="text-muted-foreground text-sm leading-relaxed md:text-base">{body}</p> : null}
        </div>
      </PageContainer>
    </PageSection>
  )
}
