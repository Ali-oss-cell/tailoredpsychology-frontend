import type { Metadata } from "next"

export const SITE_NAME = "Tailored Psychology"
export const DEFAULT_SITE_URL = "https://tailoredpsychology.com.au"
export const DEFAULT_DESCRIPTION =
  "Australian telehealth psychology with Medicare-aware intake, secure video sessions, and clinicians matched to your goals."

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const value = fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_SITE_URL
  return value.replace(/\/+$/, "")
}

type PageMetadataInput = {
  title: string
  description?: string
  path?: string
}

export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const resolvedDescription = description ?? DEFAULT_DESCRIPTION
  const url = path ? `${getSiteUrl()}${path}` : getSiteUrl()

  return {
    title,
    description: resolvedDescription,
    openGraph: {
      title,
      description: resolvedDescription,
      url,
      siteName: SITE_NAME,
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: resolvedDescription,
    },
  }
}
