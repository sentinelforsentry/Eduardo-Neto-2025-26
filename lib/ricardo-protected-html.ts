import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getRicardoSession } from "@/lib/ricardo-auth";

const htmlHeaders = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "private, no-store",
};

export async function serveProtectedHtml(req: Request, contentPath: string) {
  const session = await getRicardoSession();

  if (!session) {
    return NextResponse.redirect(new URL("/ricardo-scigliano", req.url));
  }

  const html = await fs.readFile(path.join(process.cwd(), contentPath), "utf8");

  return new NextResponse(html, {
    headers: htmlHeaders,
  });
}
