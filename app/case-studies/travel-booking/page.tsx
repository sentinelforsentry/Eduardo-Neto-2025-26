import React from 'react';
import Link from 'next/link';
import { BookingWidget } from '../../components/use-cases/booking-widget/BookingWidget';

export const metadata = { title: "Travel/Hospitality Booking Widget — Case Study" };

export default function TravelBookingCaseStudy() {
    return (
        <article className="py-12 max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Hospitality Booking Widget</h1>
            <p className="text-zinc-400 mb-8">Role: Front-End Engineer | Tech: React, TypeScript, Tailwind CSS</p>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-[#ff8820] mb-4">1. The Feature</h2>
                <p className="text-zinc-300 leading-relaxed">
                    In a recent platform redesign for a hotel group, I built a custom Search & Booking Widget. It required interdependent state management between selected dates and guest counts, along with real-time price estimation. The UI needed to feel premium, featuring smooth animations and fully accessible keyboard navigation.
                </p>
            </section>

            {/* Interactive Demo */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-[#ff8820] mb-6">2. Interactive Demo</h2>
                <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
                    {/* Decorative shapes to make background feel premium */}
                    <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <h3 className="text-center text-white text-xl font-medium mb-8">Try the Booking Widget</h3>
                        <BookingWidget />
                    </div>
                </div>
            </section>

            {/* Code Examples */}
            <section className="space-y-12">
                <h2 className="text-2xl font-bold text-[#ff8820]">3. Implementation Highlights</h2>

                {/* Highlight 1: useBookingFilter */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Custom Hook: useBookingFilter</h3>
                    <p className="text-zinc-400 mb-4 text-sm">
                        Manages the complex interdependence between Check-In/Out dates and guest limits, exposing clean methods and real-time price estimates.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-5 overflow-x-auto border border-gray-700">
                        <pre className="text-sm text-green-400 font-mono">
                            {`const updateGuests = useCallback((type: keyof GuestCounts, count: number) => {
  setGuests(prev => {
    const limit = GUEST_LIMITS[type];
    if (count < limit.min || count > limit.max) return prev;
    return { ...prev, [type]: count };
  });
}, []);

const priceEstimate = useMemo(() => {
  if (!checkIn || !checkOut) return 0;
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  if (timeDiff <= 0) return 0;
  
  const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const guestMultiplier = guests.adults + (guests.children * CHILD_MULTIPLIER);
  
  return nights * BASE_PRICE * guestMultiplier;
}, [checkIn, checkOut, guests.adults, guests.children]);`}
                        </pre>
                    </div>
                </div>

                {/* Highlight 2: Memoization */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Performance via Memoization</h3>
                    <p className="text-zinc-400 mb-4 text-sm">
                        When users rapidly tap the guest counter, we prevent the entire modal from re-rendering by applying <code>React.memo</code> to isolated child components.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-5 overflow-x-auto border border-gray-700">
                        <pre className="text-sm text-blue-400 font-mono">
                            {`const Counter = memo(({ label, value, min, max, onChange }) => {
  return (
    // ... layout
    <button onClick={() => onChange(value + 1)} disabled={value >= max}>+</button>
  );
});
Counter.displayName = 'Counter';`}
                        </pre>
                    </div>
                </div>

                {/* Highlight 3: Accessibility */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Accessible Modal</h3>
                    <p className="text-zinc-400 mb-4 text-sm">
                        Focus trapping and ARIA attributes ensure the widget is navigable securely with screen readers and a keyboard.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-5 overflow-x-auto border border-gray-700">
                        <pre className="text-sm text-yellow-300 font-mono">
                            {`// Trap focus inside modal
useEffect(() => {
  if (!isOpen) return;
  const focusable = modalNode.querySelectorAll('button, input, select');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleClose();
    if (e.key === 'Tab') {
      // Loop focus between first and last elements
    }
  };
  
  first?.focus();
  modalNode.addEventListener('keydown', handleKeyDown);
  // ...
}, [isOpen, handleClose]);`}
                        </pre>
                    </div>
                </div>
            </section>

            <div className="mt-16 border-t border-gray-800 pt-8 flex justify-between items-center">
                <Link href="/case-studies" className="text-[#ff8820] hover:text-white transition-colors">
                    &larr; Back to Case Studies
                </Link>
            </div>
        </article>
    );
}
