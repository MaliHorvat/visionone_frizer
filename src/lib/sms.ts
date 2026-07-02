import { normalizePhoneToE164, isSmsConfigured } from "./phone";

export type SendSmsResult =
  | { ok: true; sid: string }
  | { ok: false; error: string };

export async function sendSms(to: string, body: string): Promise<SendSmsResult> {
  if (!isSmsConfigured()) {
    return { ok: false, error: "SMS ni konfiguriran (manjkajo Twilio podatki)" };
  }

  const normalized = normalizePhoneToE164(to);
  if (!normalized) {
    return { ok: false, error: `Neveljavna telefonska številka: ${to}` };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_PHONE_NUMBER!;

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: normalized,
          From: from,
          Body: body,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: data.message ?? `Twilio napaka (${response.status})`,
      };
    }

    return { ok: true, sid: data.sid };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Neznana napaka pri pošiljanju SMS",
    };
  }
}

export function buildReminderMessage(params: {
  customerName: string;
  date: string;
  time: string;
  stylistName: string;
  serviceName: string;
  salonName: string;
  salonPhone?: string;
}) {
  const { customerName, date, time, stylistName, serviceName, salonName, salonPhone } = params;
  const firstName = customerName.split(" ")[0];

  let message =
    `Pozdravljeni ${firstName}, opominjamo vas na termin jutri (${date}) ob ${time}. ` +
    `Frizer: ${stylistName}, storitev: ${serviceName}. ${salonName}.`;

  if (salonPhone) {
    message += ` Za vprašanja ali preklic: ${salonPhone}.`;
  }

  return message;
}
