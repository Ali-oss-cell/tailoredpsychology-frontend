import type { MetadataRoute } from "next"

import { conditionPages } from "@/content/conditions"

const DEFAULT_SITE_URL = "https://tailoredpsychology.com.au"

function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const value = fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_SITE_URL
  return value.replace(/\/+$/, "")
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const publicRoutes = [
    "/",
    "/about",
    "/services",
    "/why-clink",
    "/pricing",
    "/trust",
    "/resources",
    "/contact",
    "/get-matched",
    "/medicare-rebates",
    "/telehealth-requirements",
    "/privacy-policy",
    "/terms-of-service",
    "/conditions",
    "/login",
    "/register",
  ]

  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }))

  const conditionEntries: MetadataRoute.Sitemap = conditionPages.map((condition) => ({
    url: `${siteUrl}/conditions/${condition.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }))

  return [...staticEntries, ...conditionEntries]
}
