import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ServiceCard = {
  title: string
  description: string
}

type ServicesPreviewProps = {
  title: string
  description: string
  services: ServiceCard[]
}

export function ServicesPreview({
  title,
  description,
  services,
}: ServicesPreviewProps) {
  return (
    <PageSection>
      <PageContainer className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">{description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="h-full">
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-6">
                  {service.description}
                </CardDescription>
                <Button asChild variant="link" className="h-auto p-0">
                  <Link href="/services" className="inline-flex items-center gap-2">
                    Learn more <ArrowRight size={16} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
