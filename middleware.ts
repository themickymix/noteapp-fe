import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hasToken = req.cookies.has("token"); // Check if token exists
  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users to /login (except /login and /signup)
  if (!hasToken && pathname !== "/login" && pathname !== "/signup") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from /login and /signup to /
  if (hasToken && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all pages except API calls & static files
export const config = {
  matcher: ["/((?!_next|api|_next/static|_next/image|favicon.ico).*)"], // Protects all pages except API routes
};
