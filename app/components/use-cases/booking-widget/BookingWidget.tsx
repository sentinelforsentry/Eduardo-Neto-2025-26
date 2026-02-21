'use client';

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useBookingFilter, GUEST_LIMITS } from './useBookingFilter';

// Memoized counter component to prevent re-renders
const Counter = memo(({ label, value, min, max, onChange }: {
    label: string, value: number, min: number, max: number, onChange: (val: number) => void
}) => {
    return (
        <div className="flex items-center justify-between py-3">
            <span className="text-gray-200 font-medium">{label}</span>
            <div className="flex items-center space-x-4">
                <button
                    className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:border-gray-300 hover:text-white disabled:opacity-30 disabled:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                    onClick={() => onChange(value - 1)}
                    disabled={value <= min}
                    aria-label={`Decrease ${label}`}
                >
                    -
                </button>
                <span className="w-4 text-center text-white" aria-live="polite">
                    {value}
                </span>
                <button
                    className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:border-gray-300 hover:text-white disabled:opacity-30 disabled:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
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
    checkIn, checkOut, onDatesChange
}: {
    checkIn: Date | null, checkOut: Date | null, onDatesChange: (ci: Date | null, co: Date | null) => void
}) => {
    // Simple custom date picker wrapper
    return (
        <div className="flex flex-col space-y-4 py-3">
            <div className="flex items-center justify-between">
                <label htmlFor="checkin" className="text-gray-200 font-medium">Check-In</label>
                <input
                    id="checkin"
                    type="date"
                    className="bg-gray-800 text-white border border-gray-600 rounded drop-shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all font-sans"
                    value={checkIn ? checkIn.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        onDatesChange(date, checkOut);
                    }}
                />
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="checkout" className="text-gray-200 font-medium">Check-Out</label>
                <input
                    id="checkout"
                    type="date"
                    className="bg-gray-800 text-white border border-gray-600 rounded drop-shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all font-sans"
                    value={checkOut ? checkOut.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        onDatesChange(checkIn, date);
                    }}
                />
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
        updateDates, updateGuests
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
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
        <div className="relative w-full max-w-md mx-auto my-12" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Trigger Button */}
            <button
                onClick={handleOpen}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col items-start transition-all hover:bg-white/20 hover:scale-[1.02] transform focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
                <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-2">Book your stay</span>
                <div className="flex justify-between w-full text-white text-lg font-medium">
                    <span>{totalGuests} Guest{totalGuests !== 1 && 's'}</span>
                    <span>
                        {checkIn && checkOut ? `${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}` : 'Select Dates'}
                    </span>
                </div>
            </button>

            {/* Modal Backdrop & Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        aria-hidden="true"
                        onClick={handleClose}
                    />
                    <div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        className="relative bg-gray-900 border border-gray-700 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slide-up"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                            <h2 id="modal-title" className="text-2xl font-bold text-white tracking-tight">Search Settings</h2>
                            <button
                                onClick={handleClose}
                                aria-label="Close"
                                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Date Ranges */}
                            <div>
                                <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-2">Dates</h3>
                                <DatePicker
                                    checkIn={checkIn}
                                    checkOut={checkOut}
                                    onDatesChange={updateDates}
                                />
                            </div>

                            <div className="h-px bg-gray-700 w-full" />

                            {/* Guests */}
                            <div>
                                <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-2">Guests</h3>
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
                        <div className="mt-8 pt-4 border-t border-gray-700 flex justify-between items-center bg-gray-900">
                            <div className="flex flex-col">
                                <span className="text-gray-400 text-sm">Estimated Total</span>
                                <span className="text-3xl font-bold text-white transition-all duration-300">
                                    ${priceEstimate.toLocaleString()}
                                </span>
                            </div>
                            <button
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-transform transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400"
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
