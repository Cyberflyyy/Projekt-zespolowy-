import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export default function BookingCancelPage() {
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
              background: "rgba(220,38,38,0.06)",
              border: "1px solid rgba(220,38,38,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: 22,
              color: "var(--danger)",
            }}
          >
            ✕
          </div>
          <h1 style={{ marginTop: 24, fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)" }}>
            Płatność anulowana
          </h1>
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--fg-3)", lineHeight: 1.6 }}>
            Nie martw się — rezerwacja nie została utworzona. Możesz spróbować ponownie.
          </p>
          <Link href="/tutors" className="kp-btn kp-btn-primary kp-btn-lg" style={{ marginTop: 24 }}>
            Wróć do korepetytorów
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
