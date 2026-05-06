import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"

type FeatureItem = {
  title: string
  description: string
}

type FeatureGridProps = {
  title: string
  items: FeatureItem[]
}

export function FeatureGrid({ title, items }: FeatureGridProps) {
  return (
    <PageSection>
      <PageContainer className="space-y-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                {item.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
