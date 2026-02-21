import { useState, useCallback, useMemo } from 'react';

export type GuestCounts = {
    adults: number;
    children: number;
    infants: number;
};

export const GUEST_LIMITS = {
    adults: { min: 1, max: 10 },
    children: { min: 0, max: 10 },
    infants: { min: 0, max: 5 },
};

const BASE_PRICE = 250;
const CHILD_MULTIPLIER = 0.5;

export function useBookingFilter() {
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [guests, setGuests] = useState<GuestCounts>({ adults: 1, children: 0, infants: 0 });

    const updateDates = useCallback((newCheckIn: Date | null, newCheckOut: Date | null) => {
        if (newCheckIn && newCheckOut && newCheckOut <= newCheckIn) {
            // Reject invalid check-out date
            return;
        }
        setCheckIn(newCheckIn);
        setCheckOut(newCheckOut);
    }, []);

    const updateGuests = useCallback((type: keyof GuestCounts, count: number) => {
        setGuests(prev => {
            const limit = GUEST_LIMITS[type];
            if (count < limit.min || count > limit.max) return prev;
            return { ...prev, [type]: count };
        });
    }, []);

    const priceEstimate = useMemo(() => {
        if (!checkIn || !checkOut) return 0;

        // Calculate nights difference, ensuring non-negative
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        if (timeDiff <= 0) return 0;

        const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        const guestMultiplier = guests.adults + (guests.children * CHILD_MULTIPLIER);
        return nights * BASE_PRICE * guestMultiplier;
    }, [checkIn, checkOut, guests.adults, guests.children]);

    return {
        checkIn,
        checkOut,
        guests,
        priceEstimate,
        updateDates,
        updateGuests,
    };
}
