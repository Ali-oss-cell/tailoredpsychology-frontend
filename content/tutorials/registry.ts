import {
  PATIENT_TELEHEALTH_101_LAST_STEP_ID,
  PATIENT_TELEHEALTH_101_STREAM_ID,
  patientTelehealth101Steps,
} from "@/content/tutorials/streams/patient.telehealth.101"
import {
  PATIENT_WELCOME_LAST_STEP_ID,
  PATIENT_WELCOME_STREAM_ID,
  patientWelcomeSteps,
} from "@/content/tutorials/streams/patient.welcome"
import type { TutorialStepDef } from "@/src/tutorials/types"

export function getTutorialStepsForStream(streamId: string): TutorialStepDef[] | null {
  if (streamId === PATIENT_WELCOME_STREAM_ID) return patientWelcomeSteps
  if (streamId === PATIENT_TELEHEALTH_101_STREAM_ID) return patientTelehealth101Steps
  return null
}

export {
  PATIENT_TELEHEALTH_101_LAST_STEP_ID,
  PATIENT_TELEHEALTH_101_STREAM_ID,
  PATIENT_WELCOME_LAST_STEP_ID,
  PATIENT_WELCOME_STREAM_ID,
}
