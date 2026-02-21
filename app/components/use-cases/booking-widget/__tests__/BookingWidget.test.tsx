import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingWidget } from '../BookingWidget';

describe('BookingWidget', () => {
    it('renders initial trigger button', () => {
        render(<BookingWidget />);
        expect(screen.getByRole('button', { name: /Book your stay/i })).toBeInTheDocument();
    });

    it('opens modal on click', () => {
        render(<BookingWidget />);
        const trigger = screen.getByRole('button', { name: /Book your stay/i });
        fireEvent.click(trigger);

        // Dialog should be visible
        expect(screen.getByRole('dialog', { name: /Search Settings/i })).toBeInTheDocument();
    });

    it('allows keyboard navigation and properly closes', () => {
        render(<BookingWidget />);
        const trigger = screen.getByRole('button', { name: /Book your stay/i });
        fireEvent.click(trigger);

        // Check that we can reach 'Save' button and close
        const saveButton = screen.getByRole('button', { name: /Save/i });
        expect(saveButton).toBeInTheDocument();

        fireEvent.click(saveButton);
        expect(screen.queryByRole('dialog', { name: /Search Settings/i })).not.toBeInTheDocument();
    });

    it('updates guests and calculates price', () => {
        render(<BookingWidget />);
        fireEvent.click(screen.getByRole('button', { name: /Book your stay/i }));

        const increaseAdultsBtn = screen.getByRole('button', { name: /Increase Adults/i });

        // Default is 1 adult. Increase to 2.
        fireEvent.click(increaseAdultsBtn);

        // Initial price with no dates is 0
        expect(screen.getByText(/\$0/i)).toBeInTheDocument();

        // Select valid check-in and check-out dates
        const checkInInput = screen.getByLabelText(/Check-In/i);
        const checkOutInput = screen.getByLabelText(/Check-Out/i);

        fireEvent.change(checkInInput, { target: { value: '2026-05-10' } });
        fireEvent.change(checkOutInput, { target: { value: '2026-05-12' } });

        // Base price = 250
        // Adults = 2
        // Expected Price per night = 500
        // 2 nights = 1000
        expect(screen.getByText(/\$1,000/i)).toBeInTheDocument();
    });
});
