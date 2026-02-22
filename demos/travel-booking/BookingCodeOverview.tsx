import CodePane from "@/app/components/demos/CodePane";

const useBookingFilterCode = [
    "export function useBookingFilter() {",
    "  const [checkIn, setCheckIn] = useState<Date | null>(null);",
    "  const [checkOut, setCheckOut] = useState<Date | null>(null);",
    "  const [guests, setGuests] = useState<GuestCounts>({ adults: 1, children: 0, infants: 0 });",
    "",
    "  const updateDates = useCallback((newCheckIn: Date | null, newCheckOut: Date | null) => {",
    "    if (newCheckIn && newCheckOut && newCheckOut <= newCheckIn) {",
    "      return; // Reject invalid range",
    "    }",
    "    setCheckIn(newCheckIn);",
    "    setCheckOut(newCheckOut);",
    "  }, []);",
    "",
    "  const updateGuests = useCallback((type: keyof GuestCounts, count: number) => {",
    "    setGuests(prev => {",
    "      const limit = GUEST_LIMITS[type];",
    "      if (count < limit.min || count > limit.max) return prev;",
    "      return { ...prev, [type]: count };",
    "    });",
    "  }, []);",
    "",
    "  const priceEstimate = useMemo(() => {",
    "    if (!checkIn || !checkOut) return 0;",
    "    const timeDiff = checkOut.getTime() - checkIn.getTime();",
    "    if (timeDiff <= 0) return 0;",
    "",
    "    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));",
    "    const guestMultiplier = guests.adults + (guests.children * CHILD_MULTIPLIER);",
    "    return nights * BASE_PRICE * guestMultiplier;",
    "  }, [checkIn, checkOut, guests.adults, guests.children]);",
    "",
    "  return { checkIn, checkOut, guests, priceEstimate, updateDates, updateGuests };",
    "}",
].join("\n");

const memoCounterCode = [
    "const Counter = memo(({ label, value, min, max, onChange }: CounterProps) => {",
    "  return (",
    "    <div className=\"flex items-center justify-between py-3\">",
    "      <span>{label}</span>",
    "      <div className=\"flex items-center space-x-4\">",
    "        <button",
    "          onClick={() => onChange(value - 1)}",
    "          disabled={value <= min}",
    "          aria-label={`Decrease ${label}`}",
    "        >−</button>",
    "        <span aria-live=\"polite\">{value}</span>",
    "        <button",
    "          onClick={() => onChange(value + 1)}",
    "          disabled={value >= max}",
    "          aria-label={`Increase ${label}`}",
    "        >+</button>",
    "      </div>",
    "    </div>",
    "  );",
    "});",
    "Counter.displayName = 'Counter';",
].join("\n");

const accessibleModalCode = [
    "// Focus trap + keyboard navigation",
    "useEffect(() => {",
    "  if (!isOpen) return;",
    "  const modalNode = modalRef.current;",
    "  if (!modalNode) return;",
    "",
    "  const focusable = modalNode.querySelectorAll(",
    "    'button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])'",
    "  );",
    "  const first = focusable[0] as HTMLElement;",
    "  const last = focusable[focusable.length - 1] as HTMLElement;",
    "",
    "  const handleKeyDown = (e: KeyboardEvent) => {",
    "    if (e.key === 'Escape') handleClose();",
    "    if (e.key === 'Tab') {",
    "      if (e.shiftKey && document.activeElement === first) {",
    "        e.preventDefault();",
    "        last?.focus();",
    "      } else if (!e.shiftKey && document.activeElement === last) {",
    "        e.preventDefault();",
    "        first?.focus();",
    "      }",
    "    }",
    "  };",
    "",
    "  first?.focus();",
    "  modalNode.addEventListener('keydown', handleKeyDown);",
    "  return () => modalNode.removeEventListener('keydown', handleKeyDown);",
    "}, [isOpen, handleClose]);",
].join("\n");

const items = [
    {
        title: "useBookingFilter — Custom Hook",
        description:
            "Co-locates date and guest state with useCallback setters and a useMemo-driven price estimate. Invalid date ranges are silently rejected.",
        language: "tsx" as const,
        code: useBookingFilterCode,
    },
    {
        title: "Memoized Counter (React.memo)",
        description:
            "Each guest-type counter is wrapped in React.memo so rapid clicks on one counter never re-render the others or the date picker.",
        language: "tsx" as const,
        code: memoCounterCode,
    },
    {
        title: "Accessible Modal — Focus Trap",
        description:
            "The modal traps Tab focus between the first and last focusable elements and closes on Escape. On open, focus moves into the dialog; on close it restores to the trigger button.",
        language: "tsx" as const,
        code: accessibleModalCode,
    },
];

export default function BookingCodeOverview() {
    return (
        <div className="space-y-6">
            <p className="text-sm text-zinc-300">
                Key code powering the booking widget. Highlights show the custom hook,
                memoization strategy, and accessible modal implementation.
            </p>

            <CodePane items={items} />

            <p className="text-xs text-zinc-400">
                Full source lives in the{" "}
                <code className="rounded bg-white/10 px-1">
                    app/components/use-cases/booking-widget/
                </code>{" "}
                directory.
            </p>
        </div>
    );
}
