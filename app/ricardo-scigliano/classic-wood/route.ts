import { serveProtectedHtml } from "@/lib/ricardo-protected-html";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  return serveProtectedHtml(req, "content/ricardo-scigliano/classicwood_rebrand.html");
}
