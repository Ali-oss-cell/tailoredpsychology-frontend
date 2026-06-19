import { fireEvent, render, screen, waitFor } from "@testing-library/react"

jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock("@/src/patient/mood/api", () => ({
  getMoodCheckins: jest.fn(),
  postMoodCheckin: jest.fn(),
}))

import { getCurrentUser } from "@/src/auth/current-user"
import { getMoodCheckins, postMoodCheckin } from "@/src/patient/mood/api"

import { MoodCheckinCard } from "./mood-checkin-card"

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockedGetMood = getMoodCheckins as jest.MockedFunction<typeof getMoodCheckins>
const mockedPostMood = postMoodCheckin as jest.MockedFunction<typeof postMoodCheckin>

const options = [
  { emoji: "😞", label: "Very low" },
  { emoji: "🙂", label: "Good" },
]

describe("MoodCheckinCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetCurrentUser.mockResolvedValue({
      id: "user_patient_001",
      email: "patient@clink.test",
      displayName: "Pat",
      role: "patient",
      accountSetupComplete: true,
    })
    mockedGetMood.mockResolvedValue({ items: [] })
    mockedPostMood.mockResolvedValue({ id: "mood_1", moodLabel: "Good", createdAt: new Date().toISOString() })
  })

  it("shows skeleton while loading instead of loading text", async () => {
    mockedGetMood.mockImplementation(() => new Promise(() => undefined))

    render(<MoodCheckinCard options={options} />)

    expect(screen.getByLabelText("Loading mood check-in")).toBeInTheDocument()
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument()
  })

  it("submits mood when emoji is clicked", async () => {
    render(<MoodCheckinCard options={options} />)

    await waitFor(() => expect(mockedGetMood).toHaveBeenCalled())

    fireEvent.click(screen.getByRole("button", { name: "Good" }))
    await waitFor(() => expect(mockedPostMood).toHaveBeenCalledWith("user_patient_001", "Good"))
  })
})
