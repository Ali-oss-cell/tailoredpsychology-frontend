import { NextResponse } from "next/server"

import { SESSION_ROLE_COOKIE } from "@/src/auth/session"

export async function GET(request: Request) {
  const url = new URL("/login", request.url)
  const response = NextResponse.redirect(url)

  response.cookies.set({
    name: SESSION_ROLE_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  })

  return response
}
