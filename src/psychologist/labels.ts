/** Human-readable labels for clinician portal enums (never show raw snake_case to clinicians). */

export type ReferralStatus = "missing_referral" | "linked_referral"
export type ReadinessStatus = "ready" | "attention" | "unknown"
export type IntakeState = "missing" | "draft_in_progress" | "committed"
export type WorkspaceRisk = "none" | "urgent_support_needed"
export type ClinicalRiskLevel = "low" | "medium" | "high"
export type SessionStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show"
export type NoteStatus = "draft" | "ready_for_signoff" | "signed"

const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  missing_referral: "Missing referral",
  linked_referral: "Referral on file",
}

const READINESS_STATUS_LABELS: Record<ReadinessStatus, string> = {
  ready: "Ready",
  attention: "Needs attention",
  unknown: "Unknown",
}

const INTAKE_STATE_LABELS: Record<IntakeState, string> = {
  missing: "No intake",
  draft_in_progress: "Intake in progress",
  committed: "Intake complete",
}

const WORKSPACE_RISK_LABELS: Record<WorkspaceRisk, string> = {
  none: "No risk flag",
  urgent_support_needed: "Urgent support needed",
}

const CLINICAL_RISK_LABELS: Record<ClinicalRiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
}

const NOTE_STATUS_LABELS: Record<NoteStatus, string> = {
  draft: "Draft",
  ready_for_signoff: "Ready for sign-off",
  signed: "Signed",
}

function fallbackLabel(value: string): string {
  return value.replaceAll("_", " ")
}

export function formatReferralStatusLabel(status: string): string {
  return REFERRAL_STATUS_LABELS[status as ReferralStatus] ?? fallbackLabel(status)
}

export function formatReadinessStatusLabel(status: string): string {
  return READINESS_STATUS_LABELS[status as ReadinessStatus] ?? fallbackLabel(status)
}

export function formatIntakeStateLabel(state: string): string {
  return INTAKE_STATE_LABELS[state as IntakeState] ?? fallbackLabel(state)
}

export function formatWorkspaceRiskLabel(risk: string): string {
  return WORKSPACE_RISK_LABELS[risk as WorkspaceRisk] ?? fallbackLabel(risk)
}

export function formatClinicalRiskLabel(level: string): string {
  return CLINICAL_RISK_LABELS[level as ClinicalRiskLevel] ?? fallbackLabel(level)
}

export function formatSessionStatusLabel(status: string): string {
  return SESSION_STATUS_LABELS[status as SessionStatus] ?? fallbackLabel(status)
}

export function formatNoteStatusLabel(status: string): string {
  return NOTE_STATUS_LABELS[status as NoteStatus] ?? fallbackLabel(status)
}
