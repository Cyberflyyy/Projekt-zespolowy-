import "server-only";
import type Stripe from "stripe";
import { stripe } from "./client";

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function createCheckoutSession(params: {
  bookingId: string;
  studentEmail: string;
  tutorStripeAccountId: string;
  listingTitle: string;
  amount: number;          // minor units, charged to student
  platformFee: number;     // minor units, platform cut
  currency: string;
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "blik", "p24"],
    customer_email: params.studentEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: params.currency,
          product_data: { name: params.listingTitle },
          unit_amount: params.amount,
        },
      },
    ],
    payment_intent_data: {
      application_fee_amount: params.platformFee,
      transfer_data: { destination: params.tutorStripeAccountId },
      metadata: { booking_id: params.bookingId },
    },
    metadata: { booking_id: params.bookingId },
    success_url: `${appUrl()}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl()}/booking/cancel?booking_id=${params.bookingId}`,
  });
}
