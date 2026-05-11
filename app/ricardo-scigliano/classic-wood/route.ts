import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getRicardoSession } from "@/lib/ricardo-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getRicardoSession();

  if (!session) {
    return NextResponse.redirect(new URL("/ricardo-scigliano", req.url));
  }

  const html = await fs.readFile(
    path.join(process.cwd(), "content/ricardo-scigliano/classicwood_rebrand.html"),
    "utf8",
  );

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
