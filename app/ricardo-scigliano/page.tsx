import Link from "next/link";
import { getRicardoSession } from "@/lib/ricardo-auth";

type PageProps = {
  searchParams?: Promise<{
    sent?: string;
    error?: string;
    dev?: string;
  }>;
};

function messageForError(error: string | undefined) {
  if (error === "invalid-email") return "Please enter a valid email address.";
  if (error === "invalid-link") return "That magic link is invalid or has expired. Request a new one.";
  if (error === "email-config") return "Email sending is not configured yet. Check the Resend environment variables.";
  return null;
}

function LoginGate({
  sent,
  error,
  dev,
}: {
  sent?: string;
  error?: string;
  dev?: string;
}) {
  const errorMessage = messageForError(error);

  return (
    <div className="py-16 sm:py-24">
      <section className="mx-auto grid max-w-5xl gap-8 rounded-2xl border border-white/10 bg-black/50 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-10 lg:grid-cols-[1fr_0.84fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff8820]">
            Private Proposal
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-6xl">
            Ricardo Scigliano proposal options
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            Enter your email to receive a secure magic link. After opening the link, you can compare
            both branding directions and choose the proposal that feels right.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#222222]/90 p-5">
          <form action="/api/ricardo-scigliano/request-link" method="post" className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-zinc-200">Email address</span>
              <input
                required
                type="email"
                name="email"
                placeholder="ricardo@example.com"
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#ff8820]"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#ff8820] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-black transition hover:bg-[#ffa64f]"
            >
              Send magic link
            </button>
          </form>

          {sent ? (
            <p className="mt-4 rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-100">
              If that email is allowed, a secure link has been sent. The link expires in 15 minutes.
              {dev ? " In local development, the link was also printed to the terminal." : null}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-4 rounded-lg border border-red-400/25 bg-red-400/10 p-3 text-sm leading-6 text-red-100">
              {errorMessage}
            </p>
          ) : null}

          <p className="mt-5 text-xs leading-5 text-zinc-500">
            Access is protected by an HTTP-only session cookie after the magic link is opened.
          </p>
        </div>
      </section>
    </div>
  );
}

function ProposalCard({
  href,
  eyebrow,
  title,
  description,
  points,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[360px] flex-col justify-between rounded-2xl border border-white/10 bg-black/55 p-6 shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:border-[#ff8820] hover:bg-black/65"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff8820]">{eyebrow}</p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-7 text-zinc-300">{description}</p>
        <ul className="mt-6 space-y-3 text-sm leading-6 text-zinc-300">
          {points.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff8820]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <span className="mt-8 inline-flex text-sm font-bold uppercase tracking-[0.14em] text-[#ff8820] transition group-hover:text-[#ffa64f]">
        Open proposal
      </span>
    </Link>
  );
}

function ProposalsIndex({ email }: { email: string }) {
  return (
    <div className="py-16 sm:py-24">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff8820]">
          Private Proposal Index
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-6xl">
          Choose the branding direction to review
        </h1>
        <p className="mt-5 text-lg leading-8 text-zinc-300">
          You are signed in as <span className="text-white">{email}</span>. These two options are
          intentionally separate so Ricardo can compare the strategic direction clearly.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <ProposalCard
          href="/ricardo-scigliano/scigliano"
          eyebrow="Option A"
          title="New personal umbrella brand"
          description="A premium new brand direction built around the Scigliano name and two specialist services."
          points={[
            "Best when the goal is a more personal, scalable brand.",
            "Separates premium woodcraft from build and renovation work.",
            "Creates a stronger long-term brand architecture.",
          ]}
        />
        <ProposalCard
          href="/ricardo-scigliano/classic-wood"
          eyebrow="Option B"
          title="Classic Wood rebrand"
          description="A lower-risk direction that keeps the recognised Classic Wood name and elevates the visual identity."
          points={[
            "Best when existing name recognition is the priority.",
            "Preserves Checkatrade, Instagram and customer memory.",
            "Modernises the logo, positioning, social content and SEO.",
          ]}
        />
      </section>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/45 p-5 text-sm leading-6 text-zinc-400">
        Suggested WhatsApp framing: “Option A is a bigger brand move. Option B keeps the known name
        and improves the presentation. Pick the one that feels most natural for your customers.”
      </div>
    </div>
  );
}

export default async function RicardoSciglianoPage({ searchParams }: PageProps) {
  const session = await getRicardoSession();
  const params = await searchParams;

  if (!session) {
    return <LoginGate sent={params?.sent} error={params?.error} dev={params?.dev} />;
  }

  return <ProposalsIndex email={session.email} />;
}
