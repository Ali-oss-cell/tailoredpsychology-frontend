import type * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { ClinkLogo } from "@/components/brand/clink-logo"
import { cn } from "@/lib/utils"

type AuthShellProps = {
  children: React.ReactNode
  sideTitle?: string
  sideDescription?: string
  sideImageSrc?: string
  sideImageAlt?: string
}

export function AuthShell({
  children,
  sideTitle,
  sideDescription,
  sideImageSrc,
  sideImageAlt = "Auth visual",
}: AuthShellProps) {
  return (
    <main className="bg-dashboard text-foreground min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden border-r border-border/50 lg:block">
          {sideImageSrc ? (
            <Image
              src={sideImageSrc}
              alt={sideImageAlt}
              fill
              className="object-cover opacity-35"
              priority
            />
          ) : null}
          <div className="from-primary/8 via-dashboard-bg/85 to-dashboard-bg absolute inset-0 bg-gradient-to-b" />
          <div className="relative z-10 flex h-full flex-col justify-between p-10">
            <Link
              href="/"
              className="focus-visible:ring-ring inline-flex items-center rounded-lg focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Tailored Psychology home"
            >
              <ClinkLogo alt="" className="size-11" />
            </Link>
            <div className="max-w-md space-y-4">
              <h2 className="font-heading text-3xl leading-tight font-semibold tracking-tight">
                {sideTitle ?? "Care that feels clear and human."}
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                {sideDescription ??
                  "Modern psychology care with secure workflows, trusted clinicians, and thoughtful support at every step."}
              </p>
            </div>
          </div>
        </aside>
        <section className="from-dashboard-bg via-dashboard-bg to-primary/5 flex min-h-screen items-center justify-center bg-gradient-to-b p-6 md:p-10">
          <div className={cn("w-full max-w-md")}>
            <Link
              href="/"
              className="focus-visible:ring-ring mb-6 inline-flex items-center rounded-lg lg:hidden focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Tailored Psychology home"
            >
              <ClinkLogo alt="" className="size-10" />
            </Link>
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
