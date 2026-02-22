"use client";

import { BookingWidget } from "@/app/components/use-cases/booking-widget/BookingWidget";

export default function BookingDemoPane() {
    return (
        <div className="rounded-lg border border-white/10 bg-black/40 p-6 shadow-lg shadow-black/40">
            <p className="mb-6 text-sm text-zinc-300">
                Click the card below to open the search modal. Adjust dates and guest
                counts to see the price estimate react in real time. Use{" "}
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-zinc-200">Tab</kbd>{" "}
                and{" "}
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-zinc-200">Esc</kbd>{" "}
                to verify keyboard accessibility.
            </p>
            <BookingWidget />
        </div>
    );
}
