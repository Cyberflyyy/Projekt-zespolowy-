import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export default function BookingCancelPage() {
  return (
    <>
      <SiteHeader />
      <main className="container py-20 max-w-content">
        <div className="notion-card p-10 max-w-lg mx-auto text-center">
          <h1 className="font-serif text-heading-1">Płatność anulowana</h1>
          <p className="mt-3 text-ink-muted">
            Nie martw się — rezerwacja nie została utworzona. Możesz spróbować ponownie.
          </p>
          <Link href="/tutors" className="notion-btn-primary mt-6">
            Wróć do korepetytorów
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
