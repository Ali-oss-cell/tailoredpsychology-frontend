import type { TutorialStepDef } from "@/src/tutorials/types"

export const PATIENT_TELEHEALTH_101_STREAM_ID = "patient.telehealth_101" as const

export const PATIENT_TELEHEALTH_101_LAST_STEP_ID = "patient.telehealth_101.done" as const

/**
 * Short orientation for telehealth join + readiness (Wave 17 / Wave 16 §3.1).
 * All steps assume `/patient/dashboard` so anchors exist without navigation.
 */
export const patientTelehealth101Steps: TutorialStepDef[] = [
  {
    id: "patient.telehealth_101.notifications",
    target: "shell.header.notifications",
    title: "Session updates",
    body: "The bell collects booking changes, reminders, and messages about visits. When it is time to join, you may also see an action that takes you straight to the video workspace.",
    side: "bottom",
    align: "end",
    waitForRoute: "/patient/dashboard",
  },
  {
    id: "patient.telehealth_101.appointments_join",
    target: "shell.sidebar.appointments",
    title: "Join from Appointments too",
    body: "Your upcoming list has the same Join Telehealth Session button as the dashboard card. Use one consistent path when it is time to enter the video workspace.",
    side: "right",
    align: "start",
    waitForRoute: "/patient/dashboard",
  },
  {
    id: "patient.telehealth_101.video_setup",
    target: "patient.dashboard.video-setup-link",
    title: "Test camera and microphone",
    body: "Open Test camera & microphone before the visit if you want a low-stress rehearsal. It does not connect you to your clinician.",
    side: "left",
    align: "start",
    waitForRoute: "/patient/dashboard",
  },
  {
    id: PATIENT_TELEHEALTH_101_LAST_STEP_ID,
    target: "shell.header.tour-help",
    title: "Replay or hide tips",
    body: "Use the ? beside the bell to replay this short telehealth tour or hide tutorials for this browser. Join is never blocked by a tour.",
    side: "bottom",
    align: "end",
    waitForRoute: "/patient/dashboard",
  },
]
