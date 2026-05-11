import { NextResponse } from "next/server";
import {
  createSessionToken,
  RICARDO_AUTH_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  verifyMagicLinkToken,
} from "@/lib/ricardo-auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const payload = verifyMagicLinkToken(url.searchParams.get("token") ?? undefined);

  if (!payload) {
    return NextResponse.redirect(new URL("/ricardo-scigliano?error=invalid-link", req.url));
  }

  const response = NextResponse.redirect(new URL("/ricardo-scigliano", req.url));

  response.cookies.set({
    name: RICARDO_AUTH_COOKIE,
    value: createSessionToken(payload.email),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/ricardo-scigliano",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
