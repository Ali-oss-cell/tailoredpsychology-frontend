import type { Metadata } from "next"
import { Geist_Mono, Noto_Sans, Inter } from "next/font/google"

import "./globals.css"
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider"
import { AppSonner } from "@/components/ui/app-sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  icons: {
    icon: "/assets/logo-icon.png",
    apple: "/assets/logo-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", notoSans.variable, interHeading.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
          <AppSonner />
        </ThemeProvider>
      </body>
    </html>
  )
}
