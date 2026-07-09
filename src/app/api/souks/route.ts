import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const statusFilter = searchParams.get("status");

  const where = statusFilter
    ? { status: { in: statusFilter.split(",") } }
    : {};

  const souks = await prisma.souk.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      organizer: { select: { name: true } },
      _count: { select: { vehicles: true, registrations: true } },
    },
  });

  return Response.json(souks);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, location, date, startTime, endTime, spots, spotPrice, services } = body;

    if (!title || !location || !date || !startTime || !spots || !spotPrice) {
      return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // Default organizer ID (temp until auth is implemented)
    const organizerId = "default-organizer";

    const souk = await prisma.souk.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        startTime,
        endTime: endTime || null,
        spots: parseInt(spots),
        spotPrice: parseFloat(spotPrice),
        services: services || null,
        organizerId,
      },
    });

    return Response.json(souk, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Erreur lors de la création du souk" }, { status: 500 });
  }
}
