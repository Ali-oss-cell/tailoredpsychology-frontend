import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthField } from "@/components/auth/auth-field"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authContent } from "@/content/auth"

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      sideTitle={authContent.forgotPassword.sideTitle}
      sideDescription={authContent.forgotPassword.sideDescription}
      sideImageSrc="/assets/resource-library.jpg"
      sideImageAlt="Resource and support library"
    >
      <AuthCard
        title={authContent.forgotPassword.title}
        description={authContent.forgotPassword.description}
        footer={
          <p className="text-center text-sm">
            <Link href="/login" className="text-primary font-medium hover:underline">
              Return to login
            </Link>
          </p>
        }
      >
        <form className="space-y-4">
          <AuthField id="email" label="Email Address" type="email" placeholder="name@example.com" />
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  )
}
