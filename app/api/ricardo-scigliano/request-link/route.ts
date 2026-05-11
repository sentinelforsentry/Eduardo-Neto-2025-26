import { NextResponse } from "next/server";
import { createMagicLinkToken, isAllowedRicardoEmail } from "@/lib/ricardo-auth";
import { isRicardoMagicLinkRateLimited } from "@/lib/ricardo-rate-limit";
import { getResend } from "@/lib/resend";

export const runtime = "nodejs";

function redirectToRequest(req: Request, params: Record<string, string>) {
  const url = new URL("/ricardo-scigliano", req.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url, { status: 303 });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildEmailHtml(link: string) {
  return `
    <div style="margin:0;padding:32px;background:#f6f1e8;font-family:Arial,sans-serif;color:#20211e">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ded5c8;border-radius:8px;padding:28px">
        <p style="margin:0 0 8px;color:#8f6042;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase">Ricardo Scigliano proposals</p>
        <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:32px;line-height:1.08;font-weight:400">Your secure access link</h1>
        <p style="font-size:16px;line-height:1.55;margin:0 0 22px;color:#4f4a42">Use the button below to open the branding proposal options. This link expires in 15 minutes.</p>
        <a href="${link}" style="display:inline-block;background:#191b18;color:#f6f1e8;text-decoration:none;padding:14px 18px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase">Open proposals</a>
        <p style="font-size:13px;line-height:1.5;margin:24px 0 0;color:#686258">If the button does not work, copy this URL into your browser:<br /><span style="word-break:break-all">${link}</span></p>
      </div>
    </div>
  `;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return redirectToRequest(req, { error: "invalid-email" });
  }

  if (!isAllowedRicardoEmail(email)) {
    return redirectToRequest(req, { sent: "1" });
  }

  const baseUrl = process.env.RICARDO_MAGIC_LINK_BASE_URL ??
    (process.env.NODE_ENV === "production" ? null : new URL(req.url).origin);

  if (!baseUrl) {
    return redirectToRequest(req, { error: "email-config" });
  }

  if (isRicardoMagicLinkRateLimited(email, req)) {
    return redirectToRequest(req, { error: "rate-limit" });
  }

  let link: string;

  try {
    const token = createMagicLinkToken(email);
    link = `${baseUrl}/ricardo-scigliano/auth/callback?token=${encodeURIComponent(token)}`;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }

    return redirectToRequest(req, { error: "email-config" });
  }

  try {
    const resend = getResend();

    await resend.emails.send({
      from: process.env.RICARDO_MAGIC_LINK_FROM ?? "Eduardo Neto <hello@eduardoneto.com>",
      to: email,
      subject: "Access the Ricardo Scigliano proposal options",
      html: buildEmailHtml(link),
      text: `Open the proposal options here: ${link}\n\nThis link expires in 15 minutes.`,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Magic link for local development:", link);
      console.error(error);
      return redirectToRequest(req, { sent: "1", dev: "1" });
    }

    return redirectToRequest(req, { error: "email-config" });
  }

  return redirectToRequest(req, { sent: "1" });
}
