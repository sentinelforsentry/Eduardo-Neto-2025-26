import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookingFilter, GUEST_LIMITS } from '../useBookingFilter';

describe('useBookingFilter', () => {
    it('initializes with default values', () => {
        const { result } = renderHook(() => useBookingFilter());
        expect(result.current.checkIn).toBeNull();
        expect(result.current.checkOut).toBeNull();
        expect(result.current.guests).toEqual({ adults: 1, children: 0, infants: 0 });
        expect(result.current.priceEstimate).toBe(0);
    });

    it('updates valid dates successfully', () => {
        const { result } = renderHook(() => useBookingFilter());
        const checkIn = new Date('2026-05-10');
        const checkOut = new Date('2026-05-15');

        act(() => {
            result.current.updateDates(checkIn, checkOut);
        });

        expect(result.current.checkIn).toEqual(checkIn);
        expect(result.current.checkOut).toEqual(checkOut);
    });

    it('rejects invalid date ranges', () => {
        const { result } = renderHook(() => useBookingFilter());
        const validCheckIn = new Date('2026-05-10');
        // A check-out date before the check-in date
        const checkOut = new Date('2026-05-09');

        act(() => {
            result.current.updateDates(validCheckIn, checkOut);
        });

        // Should not update
        expect(result.current.checkIn).toBeNull();
        expect(result.current.checkOut).toBeNull();
    });

    it('enforces min guest limits', () => {
        const { result } = renderHook(() => useBookingFilter());

        act(() => {
            // Try to set value below min limit
            result.current.updateGuests('adults', GUEST_LIMITS.adults.min - 1);
        });

        expect(result.current.guests.adults).toBe(GUEST_LIMITS.adults.min); // Remains at default/min
    });

    it('enforces max guest limits', () => {
        const { result } = renderHook(() => useBookingFilter());

        act(() => {
            // Try to set value above max limit
            result.current.updateGuests('children', GUEST_LIMITS.children.max + 1);
        });

        expect(result.current.guests.children).toBe(0); // Remains at default
    });

    it('calculates price estimate correctly', () => {
        const { result } = renderHook(() => useBookingFilter());
        const checkIn = new Date('2026-05-10');
        const checkOut = new Date('2026-05-12'); // 2 nights

        act(() => {
            result.current.updateDates(checkIn, checkOut);
            // Let's have 2 adults and 1 child.
            // Base per night is 250. 
            // Multiplier: 2 + (1 * 0.5) = 2.5
            // 250 * 2.5 = 625 per night. 2 nights = 1250.
            result.current.updateGuests('adults', 2);
            result.current.updateGuests('children', 1);
        });

        expect(result.current.guests.adults).toBe(2);
        expect(result.current.guests.children).toBe(1);
        expect(result.current.priceEstimate).toBe(1250);
    });
});
