import type { MatchAudience, MatchConcern, MatchInsurance } from "@/src/get-matched/types"

export const getMatchedQuizContent = {
  meta: {
    title: "Find your psychologist",
    subtitle: "A short, confidential quiz — about 2 minutes — to suggest clinicians who fit your situation.",
    privacyNote:
      "Your answers are confidential and used only to recommend suitable psychologists at Tailored Psychology. We do not share them for marketing.",
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
  },
  steps: {
    location: {
      title: "Where are you based?",
      description:
        "Psychologists must be registered to practise in your state or territory. We use this first so we do not suggest someone who cannot see you.",
      stateLabel: "State or territory",
      statePlaceholder: "Select your state",
      insuranceLabel: "How are you planning to pay for sessions?",
      insurancePlaceholder: "Select an option",
    },
    concerns: {
      title: "What is bringing you here?",
      description: "Choose everything that feels relevant. There is no wrong answer.",
    },
    audience: {
      title: "Who is this care for?",
      description: "This helps us suggest clinicians with the right experience and intake pathway.",
    },
    preferences: {
      title: "Therapist preferences",
      description: "Optional details that improve fit. You can always change clinician later.",
      genderLabel: "Clinician gender",
      languageLabel: "Preferred language",
      modalityLabel: "Session format",
    },
    account: {
      title: "Create your account to see your matches",
      description:
        "You are almost there. We will show 2–3 psychologists who fit what you shared — then you can book when you are ready.",
      privacyReassurance:
        "Your quiz answers and account details are confidential. Only our care team uses them to support matching and booking.",
    },
    results: {
      title: "Your suggested psychologists",
      description:
        "Based on what you told us, these clinicians are a strong starting point. Pick one to continue to booking, or contact us if you would like help deciding.",
      emptyTitle: "We could not find a close match",
      emptyDescription:
        "Please contact our team — we will personally help you find the right psychologist for your state and needs.",
      contactHref: "/contact",
    },
  },
  hero: {
    eyebrow: "Matching",
    title: "Find the right psychologist",
    titleAccent: "in about 2 minutes",
    description:
      "Answer a few simple questions about where you are, what you need, and your preferences. We will suggest psychologists who fit — no pressure to book until you are ready.",
  },
} as const

export const australianStates = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
] as const

export const insuranceOptions: { value: MatchInsurance; label: string; hint?: string }[] = [
  {
    value: "medicare_mhtp",
    label: "Medicare — I have (or am getting) a Mental Health Treatment Plan",
    hint: "Usually requires a GP referral for rebate eligibility.",
  },
  {
    value: "medicare_unsure",
    label: "Medicare — I am not sure about my referral yet",
    hint: "We can guide you on next steps during booking.",
  },
  { value: "private", label: "Private / self-funded" },
  { value: "not_sure", label: "Not sure yet" },
]

export const concernOptions: { value: MatchConcern; label: string }[] = [
  { value: "anxiety_stress", label: "Anxiety, worry, or stress" },
  { value: "mood", label: "Low mood or depression" },
  { value: "relationships", label: "Relationships or family" },
  { value: "trauma", label: "Trauma or difficult experiences" },
  { value: "adhd", label: "ADHD or focus challenges" },
  { value: "grief", label: "Grief or major life change" },
  { value: "exploring", label: "Not sure yet — exploring support" },
]

export const audienceOptions: { value: MatchAudience; label: string; hint?: string }[] = [
  { value: "individual", label: "Myself (adult)" },
  { value: "couple", label: "Couple / relationship", hint: "Both partners attend sessions." },
  { value: "teen", label: "Teenager (13–17)", hint: "Parent or guardian involved in intake." },
  { value: "child", label: "Child (under 13)", hint: "Parent or guardian required." },
]

export const genderPreferenceOptions = [
  { value: "no_preference" as const, label: "No preference" },
  { value: "female" as const, label: "Female clinician" },
  { value: "male" as const, label: "Male clinician" },
  { value: "non_binary" as const, label: "Non-binary clinician" },
]

export const languageOptions = [
  { value: "english", label: "English" },
  { value: "mandarin", label: "Mandarin" },
  { value: "arabic", label: "Arabic" },
  { value: "other", label: "Other / bilingual preferred" },
]

export const modalityOptions = [
  { value: "telehealth" as const, label: "Telehealth (video)" },
  { value: "in_clinic" as const, label: "In-clinic when available" },
  { value: "either" as const, label: "Either works for me" },
]

/** Catalog used for public matching (aligns with booking seed clinicians). */
export const matchClinicianCatalog = [
  {
    id: "clinician_001",
    name: "Avery Mitchell",
    specialty: "Clinical psychology · anxiety, stress, and burnout",
    bio: "Warm, structured care for adults navigating anxiety, work stress, and life transitions. Telehealth across eastern states.",
    profileImageUrl: "https://i.pravatar.cc/300?u=clink-clinician-001",
    nextAvailable: "Tue 10:30 AM",
    concerns: ["anxiety_stress", "mood", "grief", "exploring"] as MatchConcern[],
    audiences: ["individual", "couple"] as MatchAudience[],
    gender: "female" as const,
    languages: ["english"],
    states: ["NSW", "VIC", "QLD", "ACT"],
    modalities: ["telehealth", "in_clinic"] as const,
  },
  {
    id: "clinician_002",
    name: "Jordan Nguyen",
    specialty: "Trauma-informed · relationships and couples",
    bio: "Experienced in trauma-informed therapy, relationship distress, and emotional regulation. Evening telehealth slots available.",
    profileImageUrl: "https://i.pravatar.cc/300?u=clink-clinician-002",
    nextAvailable: "Wed 2:00 PM",
    concerns: ["trauma", "relationships", "anxiety_stress", "mood"] as MatchConcern[],
    audiences: ["individual", "couple"] as MatchAudience[],
    gender: "male" as const,
    languages: ["english", "mandarin"],
    states: ["NSW", "VIC", "SA", "WA"],
    modalities: ["telehealth"] as const,
  },
  {
    id: "clinician_003",
    name: "Samira Khan",
    specialty: "Mood, ADHD, and younger clients",
    bio: "Supports mood difficulties, ADHD-informed strategies, and teen clients with parent involvement. Bilingual English–Arabic.",
    profileImageUrl: "https://i.pravatar.cc/300?u=clink-clinician-003",
    nextAvailable: "Thu 9:00 AM",
    concerns: ["mood", "adhd", "anxiety_stress", "grief"] as MatchConcern[],
    audiences: ["individual", "teen", "child"] as MatchAudience[],
    gender: "female" as const,
    languages: ["english", "arabic"],
    states: ["NSW", "QLD", "WA", "NT"],
    modalities: ["telehealth", "in_clinic"] as const,
  },
] as const

export const initialMatchQuizDraft = {
  state: "",
  insurance: "" as MatchInsurance | "",
  concerns: [] as MatchConcern[],
  audience: "" as MatchAudience | "",
  genderPreference: "no_preference" as const,
  language: "english",
  modality: "telehealth" as const,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
}
