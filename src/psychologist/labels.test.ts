import {
  formatClinicalRiskLabel,
  formatIntakeStateLabel,
  formatNoteStatusLabel,
  formatReadinessStatusLabel,
  formatReferralStatusLabel,
  formatSessionStatusLabel,
  formatWorkspaceRiskLabel,
} from "@/src/psychologist/labels"

describe("psychologist labels", () => {
  it("maps referral and readiness enums to human copy", () => {
    expect(formatReferralStatusLabel("missing_referral")).toBe("Missing referral")
    expect(formatReferralStatusLabel("linked_referral")).toBe("Referral on file")
    expect(formatReadinessStatusLabel("attention")).toBe("Needs attention")
    expect(formatIntakeStateLabel("draft_in_progress")).toBe("Intake in progress")
    expect(formatWorkspaceRiskLabel("urgent_support_needed")).toBe("Urgent support needed")
    expect(formatClinicalRiskLabel("high")).toBe("High")
    expect(formatSessionStatusLabel("in_progress")).toBe("In progress")
    expect(formatNoteStatusLabel("ready_for_signoff")).toBe("Ready for sign-off")
  })
})
