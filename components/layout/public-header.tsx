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
      className="bg-background/90 sticky top-0 z-50 border-b border-[color:var(--border-hairline)] backdrop-blur-sm supports-[backdrop-filter]:bg-background/75"
    >
      <HeaderScrollFx />
      <PageContainer
        data-public-header-inner
        className="relative flex min-h-[var(--public-header-height)] items-center gap-2 py-2 transition-[min-height,padding] duration-300 md:gap-3 [[data-public-header][data-scrolled=true]_&]:py-1.5"
      >
        <Link
          className="inline-flex shrink-0 items-center text-primary"
          href="/"
          aria-label="Tailored Psychology home"
        >
          <ClinkLogo
            alt=""
            className="size-8 transition-[width,height] duration-300 [[data-public-header][data-scrolled=true]_&]:size-7"
          />
        </Link>
        <PublicHeaderNav />
        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="default"
            className="hidden shadow-primary-glow sm:inline-flex"
          >
            <Link href="/get-matched">
              Find Your Psychologist
              <ArrowRight size={16} data-icon="inline-end" aria-hidden />
            </Link>
          </Button>
          <ThemeToggle />
          <PublicHeaderMobileNav />
        </div>
      </PageContainer>
    </header>
  )
}
