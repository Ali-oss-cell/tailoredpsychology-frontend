import { DeviceMobileCamera, ShieldCheck } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type BandItem = {
  title: string
  description: string
  icon: "telehealth" | "medicare"
}

type TelehealthRebatesBandProps = {
  title: string
  description: string
  items: BandItem[]
}

function getItemIcon(icon: BandItem["icon"]) {
  if (icon === "telehealth") return <DeviceMobileCamera size={20} />
  return <ShieldCheck size={20} />
}

export function TelehealthRebatesBand({
  title,
  description,
  items,
}: TelehealthRebatesBandProps) {
  return (
    <PageSection muted>
      <PageContainer>
        <div className="bg-primary text-primary-foreground grid gap-8 rounded-3xl p-6 md:grid-cols-2 md:p-10">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold md:text-3xl">{title}</h2>
            <p className="text-primary-foreground/85">{description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <Card
                key={item.title}
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground shadow-none"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {getItemIcon(item.icon)}
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-primary-foreground/85 text-sm">
                  {item.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    </PageSection>
  )
}
