const TIMEZONE = process.env.SALON_TIMEZONE ?? "Europe/Ljubljana";

export function getSalonTimezone() {
  return TIMEZONE;
}

/** Pretvori slovensko telefonsko številko v E.164 format (+386...) */
export function normalizePhoneToE164(phone: string): string | null {
  let cleaned = phone.replace(/[\s\-()./]/g, "");

  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  } else if (cleaned.startsWith("0")) {
    cleaned = "+386" + cleaned.slice(1);
  } else if (cleaned.startsWith("386")) {
    cleaned = "+" + cleaned;
  } else if (!cleaned.startsWith("+")) {
    return null;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

export function isSmsConfigured() {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
}
