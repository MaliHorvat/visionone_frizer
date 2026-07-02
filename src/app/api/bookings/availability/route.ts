import { NextRequest, NextResponse } from "next/server";
import { getMonthAvailability } from "@/lib/booking";
import { jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const stylistId = request.nextUrl.searchParams.get("stylistId");
  const serviceId = request.nextUrl.searchParams.get("serviceId");
  const year = request.nextUrl.searchParams.get("year");
  const month = request.nextUrl.searchParams.get("month");

  if (!stylistId || !serviceId || !year || !month) {
    return jsonError("Manjkajoči parametri");
  }

  const availability = await getMonthAvailability(
    stylistId,
    serviceId,
    parseInt(year, 10),
    parseInt(month, 10)
  );

  return NextResponse.json({ availability });
}
