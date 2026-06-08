import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export default function BookingSuccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="container py-20 max-w-content">
        <div className="kp-card p-10 max-w-lg mx-auto text-center" style={{ boxShadow: "var(--shadow-md)" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(22,163,74,0.08)",
              border: "1px solid rgba(22,163,74,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: 22,
              color: "var(--success)",
            }}
          >
            ✓
          </div>
          <h1 style={{ marginTop: 24, fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)" }}>
            Płatność przyjęta
          </h1>
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--fg-3)", lineHeight: 1.6 }}>
            Dziękujemy! Potwierdzenie rezerwacji pojawi się w Twoim panelu za chwilę.
          </p>
          <Link href="/student/bookings" className="kp-btn kp-btn-primary kp-btn-lg" style={{ marginTop: 24 }}>
            Przejdź do rezerwacji
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
