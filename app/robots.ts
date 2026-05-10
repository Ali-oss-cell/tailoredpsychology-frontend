import type { MetadataRoute } from "next"

const DEFAULT_SITE_URL = "https://tailoredpsychology.com.au"

function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const value = fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_SITE_URL
  return value.replace(/\/+$/, "")
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/manager",
          "/patient",
          "/psychologist",
          "/video-session",
          "/notification",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
