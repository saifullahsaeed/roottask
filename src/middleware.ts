import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");
  const isPublicPage = request.nextUrl.pathname === "/"; // Landing page is public

  // Allow public pages
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Redirect to home if logged in user tries to access auth pages
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Redirect to login if not authenticated on protected routes
  if (!token) {
    const loginUrl = new URL("/login", request.url);

    // Get the current URL path
    const currentPath = request.nextUrl.pathname;

    // Only set callbackUrl if it's not already a login or signup page
    if (
      !currentPath.startsWith("/login") &&
      !currentPath.startsWith("/signup")
    ) {
      loginUrl.searchParams.set("callbackUrl", currentPath);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
