import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { IntakeQueueCard } from "@/components/ops/intake-queue-card"
import { assignIntakeQueueItem, getAssignableClinicians, getIntakeQueue } from "@/src/ops/queue/api"

jest.mock("@/src/ops/queue/api", () => ({
  getIntakeQueue: jest.fn(),
  getAssignableClinicians: jest.fn(),
  assignIntakeQueueItem: jest.fn(),
}))

const mockedGetIntakeQueue = getIntakeQueue as jest.MockedFunction<typeof getIntakeQueue>
const mockedGetAssignableClinicians = getAssignableClinicians as jest.MockedFunction<typeof getAssignableClinicians>
const mockedAssignIntakeQueueItem = assignIntakeQueueItem as jest.MockedFunction<typeof assignIntakeQueueItem>

describe("IntakeQueueCard assignment", () => {
  it("opens picker and assigns selected clinician", async () => {
    mockedGetIntakeQueue.mockResolvedValue([
      {
        queueItemId: "booking_request:br_1",
        sourceType: "booking_request",
        sourceId: "br_1",
        patientId: "user_patient_001",
        state: "requested",
        risk: "none",
        referralStatus: "missing_referral",
        medicareUncertain: false,
        assignedClinicianId: undefined,
        updatedAt: new Date().toISOString(),
      },
    ])
    mockedGetAssignableClinicians.mockResolvedValue([
      { clinicianId: "user_psychologist_001", displayName: "Clinician One", specialties: ["anxiety"] },
      { clinicianId: "user_psychologist_002", displayName: "Clinician Two", specialties: ["trauma"] },
    ])
    mockedAssignIntakeQueueItem.mockResolvedValue({
      queueItemId: "booking_request:br_1",
      sourceType: "booking_request",
      sourceId: "br_1",
      patientId: "user_patient_001",
      state: "requested",
      risk: "none",
      referralStatus: "missing_referral",
      medicareUncertain: false,
      assignedClinicianId: "user_psychologist_002",
      updatedAt: new Date().toISOString(),
    })

    render(<IntakeQueueCard />)
    await screen.findByText("booking_request:br_1")

    fireEvent.click(screen.getByRole("button", { name: "Assign" }))
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "user_psychologist_002" } })
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }))

    await waitFor(() => {
      expect(mockedAssignIntakeQueueItem).toHaveBeenCalledWith("booking_request:br_1", "user_psychologist_002")
    })
  })
})
