import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export default function BookingSuccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="container py-20 max-w-content">
        <div className="notion-card p-10 max-w-lg mx-auto text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-accent-green-soft flex items-center justify-center text-accent-green font-serif text-2xl">
            ✓
          </div>
          <h1 className="mt-6 font-serif text-heading-1">Płatność przyjęta</h1>
          <p className="mt-3 text-ink-muted">
            Dziękujemy! Potwierdzenie rezerwacji pojawi się w Twoim panelu za chwilę.
          </p>
          <Link href="/student/bookings" className="notion-btn-primary mt-6">
            Przejdź do rezerwacji
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
