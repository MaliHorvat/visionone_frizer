import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "frizer_session";

const ADMIN_ONLY_PATHS = ["/admin/uporabniki", "/admin/storitve", "/admin/frizerji"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/prijava") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/prijava", request.url));
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("No secret");
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

      if (ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
        if (payload.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
    } catch {
      const response = NextResponse.redirect(new URL("/admin/prijava", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
