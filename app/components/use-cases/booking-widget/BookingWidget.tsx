'use client';

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useBookingFilter, GUEST_LIMITS } from './useBookingFilter';

// Memoized counter component to prevent re-renders
const Counter = memo(({ label, value, min, max, onChange }: {
    label: string; value: number; min: number; max: number; onChange: (val: number) => void;
}) => {
    return (
        <div className="flex items-center justify-between py-3">
            <span className="text-zinc-200 font-medium">{label}</span>
            <div className="flex items-center space-x-4">
                <button
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-300 cursor-pointer hover:border-[#ff8820] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff8820] transition-colors"
                    onClick={() => onChange(value - 1)}
                    disabled={value <= min}
                    aria-label={`Decrease ${label}`}
                >
                    −
                </button>
                <span className="w-6 text-center text-white tabular-nums font-semibold" aria-live="polite">
                    {value}
                </span>
                <button
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-300 cursor-pointer hover:border-[#ff8820] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff8820] transition-colors"
                    onClick={() => onChange(value + 1)}
                    disabled={value >= max}
                    aria-label={`Increase ${label}`}
                >
                    +
                </button>
            </div>
        </div>
    );
});
Counter.displayName = 'Counter';

const DatePicker = memo(({
    checkIn, checkOut, onDatesChange,
}: {
    checkIn: Date | null; checkOut: Date | null; onDatesChange: (ci: Date | null, co: Date | null) => void;
}) => {
    const formatDate = (d: Date | null) => {
        if (!d) return '';
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const calendarIcon = (
        <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
    );

    return (
        <div className="flex flex-col space-y-3 py-3">
            <div className="flex items-center justify-between">
                <label htmlFor="checkin" className="text-zinc-200 font-medium">Check-In</label>
                <div className="relative">
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 cursor-pointer hover:border-[#ff8820] transition-colors">
                        {calendarIcon}
                        <span className={`text-sm font-sans ${checkIn ? 'text-white' : 'text-zinc-500'}`}>
                            {checkIn ? formatDate(checkIn) : 'Select date'}
                        </span>
                    </div>
                    <input
                        id="checkin"
                        type="date"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={checkIn ? checkIn.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            onDatesChange(date, checkOut);
                        }}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="checkout" className="text-zinc-200 font-medium">Check-Out</label>
                <div className="relative">
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 cursor-pointer hover:border-[#ff8820] transition-colors">
                        {calendarIcon}
                        <span className={`text-sm font-sans ${checkOut ? 'text-white' : 'text-zinc-500'}`}>
                            {checkOut ? formatDate(checkOut) : 'Select date'}
                        </span>
                    </div>
                    <input
                        id="checkout"
                        type="date"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={checkOut ? checkOut.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            onDatesChange(checkIn, date);
                        }}
                    />
                </div>
            </div>
        </div>
    );
});
DatePicker.displayName = 'DatePicker';

export function BookingWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const {
        checkIn, checkOut, guests, priceEstimate,
        updateDates, updateGuests,
    } = useBookingFilter();

    const handleOpen = useCallback(() => {
        previousFocusRef.current = document.activeElement as HTMLElement;
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        if (previousFocusRef.current) {
            previousFocusRef.current.focus();
        }
    }, []);

    // Trap focus
    useEffect(() => {
        if (!isOpen) return;

        const modalNode = modalRef.current;
        if (!modalNode) return;

        const focusableElements = modalNode.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            }
        };

        modalNode.addEventListener('keydown', handleKeyDown);
        // Auto-focus first element
        firstElement?.focus();

        return () => modalNode.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

    const totalGuests = guests.adults + guests.children + guests.infants;

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Trigger Button */}
            <button
                onClick={handleOpen}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-6 shadow-lg shadow-black/40 flex flex-col items-start cursor-pointer transition-all hover:bg-black/55 hover:border-[#ff8820] focus:outline-none focus:ring-2 focus:ring-[#ff8820]"
            >
                <span className="text-zinc-400 text-sm uppercase tracking-wider font-semibold mb-2">Book your stay</span>
                <div className="flex justify-between w-full text-white text-lg font-medium">
                    <span>{totalGuests} Guest{totalGuests !== 1 && 's'}</span>
                    <span className="text-zinc-300 text-base">
                        {checkIn && checkOut ? `${checkIn.toLocaleDateString()} – ${checkOut.toLocaleDateString()}` : 'Select Dates'}
                    </span>
                </div>
                {priceEstimate > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 w-full flex justify-between items-center">
                        <span className="text-sm text-zinc-400">Estimated Total</span>
                        <span className="text-xl font-bold text-[#ff8820]">${priceEstimate.toLocaleString()}</span>
                    </div>
                )}
            </button>

            {/* Modal Backdrop & Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/70 transition-opacity"
                        aria-hidden="true"
                        onClick={handleClose}
                    />
                    <div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        className="relative bg-zinc-900 border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-black/60 animate-[tab-panel-fade_0.25s_ease-out]"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 id="modal-title" className="text-2xl font-bold text-white tracking-tight">Search Settings</h2>
                            <button
                                onClick={handleClose}
                                aria-label="Close"
                                className="text-zinc-400 hover:text-white cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff8820] rounded p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Date Ranges */}
                            <div>
                                <h3 className="text-sm uppercase tracking-wide text-zinc-500 font-semibold mb-2">Dates</h3>
                                <DatePicker
                                    checkIn={checkIn}
                                    checkOut={checkOut}
                                    onDatesChange={updateDates}
                                />
                            </div>

                            <div className="h-px bg-white/10 w-full" />

                            {/* Guests */}
                            <div>
                                <h3 className="text-sm uppercase tracking-wide text-zinc-500 font-semibold mb-2">Guests</h3>
                                <Counter
                                    label="Adults"
                                    value={guests.adults}
                                    min={GUEST_LIMITS.adults.min}
                                    max={GUEST_LIMITS.adults.max}
                                    onChange={(val) => updateGuests('adults', val)}
                                />
                                <Counter
                                    label="Children"
                                    value={guests.children}
                                    min={GUEST_LIMITS.children.min}
                                    max={GUEST_LIMITS.children.max}
                                    onChange={(val) => updateGuests('children', val)}
                                />
                                <Counter
                                    label="Infants"
                                    value={guests.infants}
                                    min={GUEST_LIMITS.infants.min}
                                    max={GUEST_LIMITS.infants.max}
                                    onChange={(val) => updateGuests('infants', val)}
                                />
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-zinc-400 text-sm">Estimated Total</span>
                                <span className="text-3xl font-bold text-white tabular-nums transition-all duration-300">
                                    ${priceEstimate.toLocaleString()}
                                </span>
                            </div>
                            <button
                                className="bg-[#ff8820] hover:brightness-110 text-black px-6 py-3 rounded-lg font-semibold shadow-lg cursor-pointer transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#ff8820]/40"
                                onClick={handleClose}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
