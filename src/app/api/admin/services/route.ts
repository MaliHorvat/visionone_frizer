import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/api";

const createSchema = z.object({
  name: z.string().min(2, "Ime mora imeti vsaj 2 znaka"),
  description: z.string().optional(),
  durationMin: z.number().int().min(5).max(480),
  priceCents: z.number().int().min(0),
  active: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { appointments: true, stylists: true } },
    },
  });

  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Neveljavni podatki");
  }

  const service = await prisma.service.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      durationMin: parsed.data.durationMin,
      priceCents: parsed.data.priceCents,
      active: parsed.data.active ?? true,
    },
  });

  return NextResponse.json({ service }, { status: 201 });
}
