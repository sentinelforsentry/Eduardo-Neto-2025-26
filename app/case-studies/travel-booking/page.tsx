import Link from "next/link";

export const metadata = { title: "Travel / Hospitality — Case Study" };

export default function TravelBookingCaseStudy() {
    return (
        <article className="py-12">
            <h1 className="text-3xl font-bold text-white">Hospitality Booking Widget</h1>
            <p className="mt-2 text-zinc-400">Client: Global Retail, Travel, and Media Brands</p>
            <div className="mt-6 grid gap-4 text-sm text-zinc-300 sm:grid-cols-3">
                <div><span className="text-zinc-400">Role:</span> Frontend Developer</div>
                <div><span className="text-zinc-400">Tech:</span> React, TypeScript, Custom Hooks</div>
                <div><span className="text-zinc-400">Outcome:</span> Accessible, performant booking UI</div>
            </div>

            <section className="mt-10 space-y-4">
                <h2 className="text-xl font-semibold text-[#ff8820]">1. The Challenge</h2>
                <p className="text-zinc-300">The existing hotel group booking platform suffered from a fragmented search experience — dates and guest counts were managed independently, leading to mismatched price estimates and a confusing user flow. The custom date-picker and guest counter components also had no keyboard accessibility, making the platform unusable for screen-reader users.</p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold text-[#ff8820]">2. My Solution</h2>
                <p className="text-zinc-300">Designed a unified booking widget powered by a custom React hook (<code className="rounded bg-white/10 px-1">useBookingFilter</code>) that co-locates date range and guest count state, computing a real-time price estimate via <code className="rounded bg-white/10 px-1">useMemo</code>. Applied <code className="rounded bg-white/10 px-1">React.memo</code> to isolated counter sub-components so rapid guest adjustments never cascade re-renders through the full modal tree. Built a fully accessible modal with ARIA roles, focus trapping, and ESC-to-close keyboard navigation.</p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold text-[#ff8820]">3. The Outcome</h2>
                <p className="text-zinc-300">Delivered a premium, responsive booking card that dynamically calculates pricing as users adjust dates and guest counts. The widget passed WCAG 2.1 AA accessibility audit and reduced booking-flow drop-off rates by providing immediate price feedback.</p>
            </section>

            <div className="mt-10 flex flex-wrap gap-3">
                <Link
                    href="/demos/travel-booking"
                    className="rounded-md bg-[#ff8820] px-4 py-2 text-sm font-medium text-black hover:brightness-110"
                >
                    See it in action — Booking Widget
                </Link>
                <Link
                    href="/demos"
                    className="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                >
                    All demos
                </Link>
            </div>
        </article>
    );
}
