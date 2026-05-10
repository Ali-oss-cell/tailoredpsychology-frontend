export const termsOfServiceEntityName = "Tailored Psychology Pty Ltd"

export const termsOfServiceEffectiveDate = "4 May 2026"

export type TermsSection = {
  id: string
  title: string
  paragraphs: string[]
}

export const termsOfServiceSections: TermsSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance",
    paragraphs: [
      `These Terms of Service ("Terms") govern your use of Tailored Psychology services operated by ${termsOfServiceEntityName}. By creating an account or using the Services, you agree to these Terms.`,
      "If you do not agree, do not use the Services.",
    ],
  },
  {
    id: "scope",
    title: "2. Service scope",
    paragraphs: [
      "Tailored Psychology provides software workflows for booking, telehealth session access, records handling, and related communication.",
      "Clinical care is delivered by qualified practitioners and organisations using the platform; platform availability does not replace emergency services.",
    ],
  },
  {
    id: "accounts",
    title: "3. Accounts and security",
    paragraphs: [
      "You are responsible for keeping your account credentials confidential and for activity performed through your account.",
      "You must provide accurate information and promptly report suspected unauthorised access.",
    ],
  },
  {
    id: "fees",
    title: "4. Fees and billing",
    paragraphs: [
      "Any applicable fees, rebates, invoices, and payment terms are communicated through the product and/or your clinic agreement.",
      "You agree to review appointment and billing information before confirming bookings.",
    ],
  },
  {
    id: "privacy",
    title: "5. Privacy and health information",
    paragraphs: [
      "Handling of personal and health information is described in the Privacy Policy. By using the Services, you acknowledge that health-related information may be required to deliver care and operations.",
    ],
  },
  {
    id: "usage",
    title: "6. Acceptable use",
    paragraphs: [
      "You must not misuse the Services, attempt unauthorised access, interfere with platform operation, or use the Services for unlawful purposes.",
      "We may suspend or restrict access for security, safety, or legal reasons.",
    ],
  },
  {
    id: "liability",
    title: "7. Liability and availability",
    paragraphs: [
      "The Services are provided on an as-available basis. To the maximum extent permitted by law, liability is limited as required by applicable consumer and health-related laws.",
      "Nothing in these Terms excludes non-excludable rights under Australian law.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes",
    paragraphs: [
      "We may update these Terms from time to time. Material updates may be communicated via in-product notice or email.",
      "Your continued use after updates take effect constitutes acceptance of the updated Terms.",
    ],
  },
  {
    id: "contact",
    title: "9. Contact",
    paragraphs: [
      "For legal or terms-related queries, use the contact channel listed on the public contact page.",
      "Legal ownership, counsel review, and approval status are tracked in `frontend/docs/LEGAL_SIGNOFF_TRACKER.md`.",
    ],
  },
]
