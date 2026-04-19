// Legacy shim — checkout sessions are created inline by /api/bookings/create.
// This endpoint exists for future direct-checkout flows (e.g. packages).
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Use POST /api/bookings/create to start a checkout session." },
    { status: 400 },
  );
}
