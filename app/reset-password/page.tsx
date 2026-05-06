import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthField } from "@/components/auth/auth-field"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authContent } from "@/content/auth"

export default function ResetPasswordPage() {
  return (
    <AuthShell
      sideTitle={authContent.resetPassword.sideTitle}
      sideDescription={authContent.resetPassword.sideDescription}
      sideImageSrc="/assets/telehealth-session.jpg"
      sideImageAlt="Secure account recovery flow"
    >
      <AuthCard
        title={authContent.resetPassword.title}
        description={authContent.resetPassword.description}
        footer={
          <p className="text-muted-foreground text-center text-sm">
            Need help?{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Contact support
            </Link>
          </p>
        }
      >
        <form className="space-y-4">
          <AuthField id="newPassword" label="New Password" type="password" placeholder="Enter new password" />
          <AuthField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            hint="Use at least 8 characters with letters and numbers."
          />
          <Button type="submit" className="w-full">
            Save New Password
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  )
}
