import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { EUserRole } from "./enums/userEnums";

const PUBLIC_ROUTES = ["/privacy-policy", "/terms-condition"];
const AUTH_ROUTES = ["/login"];
const ALLOWED_ROLES: string[] = [EUserRole.SUPER_ADMIN, EUserRole.ADMIN];

interface DecodedToken {
  exp?: number;
  role?: string;
  [key: string]: unknown;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const token = request.cookies.get("accessToken")?.value;

  // 2. Validate token using jwt-decode
  let isValidToken = false;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const isNotExpired = !decoded.exp || Date.now() < decoded.exp * 1000;
      const hasAllowedRole = !decoded.role || ALLOWED_ROLES.includes(decoded.role as EUserRole);

      if (isNotExpired && hasAllowedRole) {
        isValidToken = true;
      }
    } catch {
      isValidToken = false;
    }
  }

  // 3. Authenticated user trying to access auth route (/login) -> redirect to dashboard
  if (isValidToken && isAuthRoute) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const redirectUrl = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";
    return NextResponse.redirect(new URL(redirectUrl, request.nextUrl));
  }

  // 4. Unauthenticated user trying to access protected route -> redirect to /login
  if (!isValidToken && !isAuthRoute) {
    const loginUrl = new URL("/login", request.nextUrl);
    const fullPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", fullPath);
    }

    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");
    response.cookies.delete("userRole");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)).*)",
  ],
};