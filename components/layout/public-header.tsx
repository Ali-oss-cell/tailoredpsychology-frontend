import Link from "next/link"

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
    >
      <HeaderScrollFx />
      <PageContainer className="relative flex min-h-[4.25rem] items-center gap-3 py-2.5 md:gap-4">
        <Link
          className="inline-flex shrink-0 items-center text-primary"
          href="/"
          aria-label="Tailored Psychology home"
        >
          <ClinkLogo alt="" className="size-9 sm:size-10" />
        </Link>
        <PublicHeaderNav />
        <div className="ms-auto flex shrink-0 items-center gap-2">
          <Button
            asChild
            size="sm"
            className="shadow-primary-glow sm:hidden"
          >
            <Link href="/get-matched">Find a psychologist</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden shadow-primary-glow sm:inline-flex md:h-10 md:px-4 md:text-sm"
          >
            <Link href="/get-matched">Find a psychologist</Link>
          </Button>
          <ThemeToggle />
          <PublicHeaderMobileNav />
        </div>
      </PageContainer>
    </header>
  )
}
