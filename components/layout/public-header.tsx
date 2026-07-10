import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { ClinkLogo } from "@/components/brand/clink-logo"
import { HeaderScrollFx } from "@/components/layout/header-scroll-fx"
import { PublicHeaderMobileNav } from "@/components/layout/public-header-mobile-nav"
import { PublicHeaderNav } from "@/components/layout/public-header-nav"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function PublicHeader() {
  return (
    <header
      data-public-header
      className="bg-background/95 sticky top-0 z-50 border-b border-border/70 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      style={{ "--public-header-height": "5.25rem" } as CSSProperties}
    >
      <HeaderScrollFx />
      <PageContainer
        data-public-header-inner
        className="relative flex min-h-[5.25rem] items-center gap-3 py-3 transition-[min-height,padding] duration-300 md:gap-4 md:py-3.5 [[data-public-header][data-scrolled=true]_&]:min-h-[4.5rem] [[data-public-header][data-scrolled=true]_&]:py-2"
      >
        <Link
          className="inline-flex shrink-0 items-center text-primary"
          href="/"
          aria-label="Tailored Psychology home"
        >
          <ClinkLogo alt="" className="size-9 transition-transform duration-300 sm:size-10 [[data-public-header][data-scrolled=true]_&]:size-8" />
        </Link>
        <PublicHeaderNav />
        <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden min-h-11 rounded-xl sm:inline-flex"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="marketing-cta hidden rounded-xl shadow-primary-glow transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <Link href="/get-matched">
              Find Your Psychologist
              <ArrowRight size={18} data-icon="inline-end" aria-hidden />
            </Link>
          </Button>
          <ThemeToggle />
          <PublicHeaderMobileNav />
        </div>
      </PageContainer>
    </header>
  )
}
