export type MatchQuizStep =
  | "location"
  | "concerns"
  | "audience"
  | "preferences"
  | "account"
  | "results"

export type MatchConcern =
  | "anxiety_stress"
  | "mood"
  | "relationships"
  | "trauma"
  | "adhd"
  | "grief"
  | "exploring"

export type MatchAudience = "individual" | "couple" | "teen" | "child"

export type MatchInsurance =
  | "medicare_mhtp"
  | "medicare_unsure"
  | "private"
  | "not_sure"

export type MatchQuizDraft = {
  state: string
  insurance: MatchInsurance | ""
  concerns: MatchConcern[]
  audience: MatchAudience | ""
  genderPreference: "no_preference" | "female" | "male" | "non_binary"
  language: string
  modality: "telehealth" | "in_clinic" | "either"
  firstName: string
  lastName: string
  email: string
  password: string
}

export type MatchedClinician = {
  id: string
  name: string
  specialty: string
  bio: string
  profileImageUrl?: string
  nextAvailable: string
  matchReasons: string[]
  score: number
}
