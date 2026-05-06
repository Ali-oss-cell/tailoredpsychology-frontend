export type ConditionContent = {
  slug: string
  title: string
  summary: string
  whenToSeekSupport: string[]
  clinkApproach: string[]
  nextStep: string
}

export const conditionPages: ConditionContent[] = [
  {
    slug: "anxiety",
    title: "Anxiety support",
    summary: "Evidence-based therapy pathways for persistent worry, panic, and stress responses.",
    whenToSeekSupport: ["Worry is affecting sleep or concentration.", "Avoidance is reducing daily function."],
    clinkApproach: ["Structured assessment and collaborative goals.", "CBT-informed care and practical coping plans."],
    nextStep: "Start with a focused intake so we can match you to the right clinician.",
  },
  {
    slug: "depression",
    title: "Depression support",
    summary: "Care for low mood, loss of motivation, and reduced day-to-day functioning.",
    whenToSeekSupport: ["Low mood lasts more than two weeks.", "Daily tasks feel consistently harder to complete."],
    clinkApproach: ["Safety-aware intake and mood baseline.", "Evidence-based treatment planning with regular review."],
    nextStep: "Book an initial session to build a practical treatment plan.",
  },
  {
    slug: "trauma-ptsd",
    title: "Trauma and PTSD support",
    summary: "Trauma-informed therapy pathways focused on safety, stabilization, and recovery.",
    whenToSeekSupport: ["Intrusive memories or hypervigilance are persistent.", "Trauma reminders trigger high distress."],
    clinkApproach: ["Paced, trauma-informed engagement.", "Stabilization and evidence-based trauma treatment where appropriate."],
    nextStep: "Use intake to share key triggers and support preferences.",
  },
  {
    slug: "adhd",
    title: "ADHD support",
    summary: "Psychological support for attention regulation, planning, and daily functioning.",
    whenToSeekSupport: ["Focus and task completion are repeatedly impacted.", "Executive function challenges affect work or study."],
    clinkApproach: ["Function-first assessment of routines and demands.", "Skills-based interventions and practical structure plans."],
    nextStep: "Get matched with a clinician experienced in ADHD-informed care.",
  },
  {
    slug: "stress-burnout",
    title: "Stress and burnout support",
    summary: "Care pathways for overwhelm, exhaustion, and recovery from sustained stress loads.",
    whenToSeekSupport: ["Recovery between workdays is no longer happening.", "Stress symptoms are affecting health or relationships."],
    clinkApproach: ["Load mapping and pressure-point identification.", "Recovery planning and boundaries-based coping tools."],
    nextStep: "Book a consult to create a sustainable recovery plan.",
  },
  {
    slug: "sleep",
    title: "Sleep and insomnia support",
    summary: "Psychology-led support for sleep disruption and insomnia patterns.",
    whenToSeekSupport: ["Difficulty falling or staying asleep is frequent.", "Fatigue is affecting daytime performance."],
    clinkApproach: ["Sleep pattern and behavior assessment.", "Structured sleep interventions and routine optimization."],
    nextStep: "Start intake and include your recent sleep pattern.",
  },
  {
    slug: "perinatal",
    title: "Perinatal mental health support",
    summary: "Support during pregnancy and early parenthood for mood, anxiety, and adjustment challenges.",
    whenToSeekSupport: ["Emotional distress is increasing during pregnancy or postpartum.", "Adjustment feels overwhelming and persistent."],
    clinkApproach: ["Context-aware perinatal assessment.", "Supportive, practical care planning for parent wellbeing."],
    nextStep: "Book an initial consult with perinatal support context.",
  },
  {
    slug: "grief-loss",
    title: "Grief and loss support",
    summary: "Compassionate support through bereavement, life transitions, and prolonged grief.",
    whenToSeekSupport: ["Grief feels stuck or increasingly isolating.", "Loss is significantly disrupting functioning."],
    clinkApproach: ["Personalized grief-informed therapy.", "Meaning-making and coping in your own pace."],
    nextStep: "Start intake and share the support style you prefer.",
  },
  {
    slug: "relationships",
    title: "Relationship challenges support",
    summary: "Support for communication, conflict cycles, and relational stress.",
    whenToSeekSupport: ["Recurring conflict patterns feel unresolved.", "Relationship stress is affecting wellbeing."],
    clinkApproach: ["Relational pattern mapping.", "Communication and boundary strategies tailored to goals."],
    nextStep: "Book an appointment to discuss relational goals.",
  },
  {
    slug: "ocd",
    title: "OCD support",
    summary: "Specialized support for intrusive thoughts and compulsive behavior patterns.",
    whenToSeekSupport: ["Obsessions or compulsions are time-consuming.", "Avoidance behaviors are growing over time."],
    clinkApproach: ["Clear OCD-informed formulation.", "Evidence-based intervention planning and progress review."],
    nextStep: "Use intake to capture symptom patterns and priorities.",
  },
]

export function getConditionBySlug(slug: string): ConditionContent | undefined {
  return conditionPages.find((item) => item.slug === slug)
}
