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
    <main className="bg-background text-foreground min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden border-r border-border/60 lg:block">
          {sideImageSrc ? (
            <Image
              src={sideImageSrc}
              alt={sideImageAlt}
              fill
              className="object-cover opacity-40"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-surface-2/40 via-surface-2/70 to-surface-1/95" />
          <div className="relative z-10 flex h-full flex-col justify-between p-10">
            <Link href="/" className="inline-flex items-center" aria-label="Clink home">
              <ClinkLogo alt="" className="size-11" />
            </Link>
            <div className="max-w-md space-y-4">
              <h2 className="font-heading text-3xl leading-tight font-semibold">
                {sideTitle ?? "Care that feels clear and human."}
              </h2>
              <p className="text-muted-foreground text-base">
                {sideDescription ??
                  "Modern psychology care with secure workflows, trusted clinicians, and thoughtful support at every step."}
              </p>
            </div>
          </div>
        </aside>
        <section className="flex min-h-screen items-center justify-center p-6 md:p-10">
          <div className={cn("w-full max-w-md")}>{children}</div>
        </section>
      </div>
    </main>
  )
}
