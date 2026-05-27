import Link from "next/link"

import { ClinkLogo } from "@/components/brand/clink-logo"
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
      <PageContainer className="flex min-h-14 items-center justify-start gap-2 py-2 md:gap-3">
        <Link
          className="inline-flex shrink-0 translate-y-px items-center text-primary"
          href="/"
          aria-label="Tailored Psychology home"
        >
          <ClinkLogo alt="" className="size-9 sm:size-10" />
        </Link>
        <PublicHeaderNav />
        <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/get-matched">Find a psychologist</Link>
          </Button>
          <ThemeToggle />
        </div>
      </PageContainer>
    </header>
  )
}
