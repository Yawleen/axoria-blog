import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SIGN_IN_ROUTE } from "./config/routes";

export async function middleware(req) {
  const authCheckUrl = new URL("/api/auth/validateSession", req.url);

  const authResponse = await fetch(authCheckUrl, {
    headers: {
      cookie: (await cookies()).toString(),
      cache: "force-cache",
      next: {
        tags: ["auth-session"],
      },
    },
  });

  const { authorized } = await authResponse.json();

  if (!authorized) {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
