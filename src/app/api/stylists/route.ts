import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stylists = await prisma.stylist.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      bio: true,
      imageUrl: true,
      services: {
        where: { active: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ stylists });
}
