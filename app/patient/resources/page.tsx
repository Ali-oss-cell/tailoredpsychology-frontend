import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { patientResourcesContent } from "@/content/patient-resources"

export default function PatientResourcesPage() {
  return (
    <section className="space-y-6" data-tutorial="patient.page.resources">
      <PatientPageHeader
        title={patientResourcesContent.header.title}
        description={patientResourcesContent.header.description}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {patientResourcesContent.categories.map((category) => (
          <Card key={category.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              {category.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
