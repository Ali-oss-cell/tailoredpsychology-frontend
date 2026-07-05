import { render, screen } from "@testing-library/react"

import PatientMyClinicianPage from "@/app/patient/my-clinician/page"
import { patientMyClinicianContent } from "@/content/patient-my-clinician"

jest.mock("@/components/patient/patient-shell", () => ({
  PatientShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/patient/patient-portal-page", () => ({
  PatientPortalPage: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))
jest.mock("@/components/patient/my-clinician/patient-my-clinician-section", () => ({
  PatientMyClinicianSection: () => <div>Care team section</div>,
}))

describe("PatientMyClinicianPage", () => {
  it("renders portal header and care team section", () => {
    render(<PatientMyClinicianPage />)
    expect(screen.getByRole("heading", { name: patientMyClinicianContent.header.title })).toBeInTheDocument()
    expect(screen.getByText("Care team section")).toBeInTheDocument()
  })
})
