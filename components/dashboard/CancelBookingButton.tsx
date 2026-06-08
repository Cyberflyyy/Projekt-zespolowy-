"use client";

import { useTransition } from "react";

interface Props {
  action: (formData: FormData) => Promise<void>;
  bookingId: string;
}

export function CancelBookingButton({ action, bookingId }: Props) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm("Czy na pewno chcesz anulować tę rezerwację?")) {
      e.preventDefault();
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.append("booking_id", bookingId);
      await action(fd);
    });
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-accent-red hover:underline disabled:opacity-50"
      >
        {pending ? "Anulowanie…" : "Anuluj"}
      </button>
    </form>
  );
}
