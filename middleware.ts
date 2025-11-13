import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const path = req.nextUrl.pathname

  // If user is not authenticated and trying to access protected routes
  if (!token && path !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If user is authenticated and trying to access login page
  if (token && path === "/login") {
    // Redirect based on role
    if (token.role === "GURU") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    } else if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
  }

  // Role-based access control
  if (token) {
    // Admin routes - only accessible by ADMIN
    if (path.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Guru routes - only accessible by GURU
    if (
      (path.startsWith("/dashboard") || 
       path.startsWith("/jurnal") || 
       path.startsWith("/analitik")) && 
      token.role !== "GURU"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/jurnal/:path*",
    "/analitik/:path*",
    "/admin/:path*",
    "/login"
  ]
}
