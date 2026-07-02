import { NextRequest, NextResponse } from "next/server";
import { sendAppointmentReminders } from "@/lib/reminders";
import { isSmsConfigured } from "@/lib/phone";

function verifyCronAuth(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Ni avtorizacije" }, { status: 401 });
  }

  if (!isSmsConfigured()) {
    return NextResponse.json({
      skipped: true,
      message: "SMS ni konfiguriran. Nastavite Twilio podatke v okoljskih spremenljivkah.",
    });
  }

  try {
    const summary = await sendAppointmentReminders();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("Cron send-reminders error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Napaka pri pošiljanju opomnikov" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
