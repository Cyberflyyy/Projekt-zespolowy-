import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { BookingStatusBadge } from "@/components/dashboard/BookingStatusBadge";
import { PaymentStatusBadge } from "@/components/dashboard/PaymentStatusBadge";
import { Separator } from "@/components/ui/Separator";
import { requireRole } from "@/lib/auth/guards";
import { getBooking } from "@/lib/db/bookings";
import { formatDateLong, formatMoney } from "@/lib/utils/format";

export default async function StudentBookingDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { profile } = await requireRole("student");
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) notFound();
  if (booking.student_id !== profile.id) redirect("/student/bookings");

  return (
    <div>
      <PageHeader
        eyebrow="Rezerwacja"
        title={booking.listing?.title ?? "Lekcja"}
        description={`Korepetytor: ${booking.tutor?.full_name ?? "—"}`}
        action={<BookingStatusBadge status={booking.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="notion-card p-6 space-y-4">
          <Row label="Termin" value={booking.slot ? formatDateLong(booking.slot.starts_at) : "—"} />
          <Row label="Czas trwania" value={`${booking.listing?.duration_minutes ?? 60} min`} />
          <Row label="Kwota" value={formatMoney(booking.amount_total, booking.currency)} />
          <Row label="Prowizja platformy" value={formatMoney(booking.platform_fee, booking.currency)} />
          <Row label="Dla korepetytora" value={formatMoney(booking.tutor_share, booking.currency)} />
          <Separator />
          {booking.notes && (
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-subtle">Notatka</p>
              <p className="mt-1 text-sm text-ink whitespace-pre-line">{booking.notes}</p>
            </div>
          )}
        </div>

        <aside className="notion-card p-6">
          <h3 className="font-serif text-heading-3">Płatność</h3>
          {booking.payment ? (
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Status</span>
                <PaymentStatusBadge status={booking.payment.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Kwota</span>
                <span>{formatMoney(booking.payment.amount, booking.payment.currency)}</span>
              </div>
              {booking.payment.stripe_charge_id && (
                <p className="text-xs text-ink-subtle break-all">
                  Stripe: {booking.payment.stripe_charge_id}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">Oczekuje na zaksięgowanie.</p>
          )}

          <div className="mt-5">
            <Link href="/student/bookings" className="notion-btn-ghost w-full justify-center">
              ← Wróć do listy
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
