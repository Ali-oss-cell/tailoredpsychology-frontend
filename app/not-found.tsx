import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-md">
        <CardContent className="space-y-4 p-6 text-center">
          <p className="card-eyebrow">404</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The page you requested does not exist or may have moved. If you were signed in, your account is still safe.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/patient/dashboard">Patient dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
