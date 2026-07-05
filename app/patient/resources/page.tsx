import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { patientResourcesContent } from "@/content/patient-resources"

export default function PatientResourcesPage() {
  return (
    <PatientPortalPage
      title={patientResourcesContent.header.title}
      description={patientResourcesContent.header.description}
      eyebrow="Support"
      tutorialId="patient.page.resources"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {patientResourcesContent.categories.map((category) => (
          <Card key={category.title} className="interactive-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              {category.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </PatientPortalPage>
  )
}
