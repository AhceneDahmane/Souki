import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { geocodeLocation } from "@/lib/geocode";

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
    const user = await getAuthUser();
    if (!user || user.role !== "organizer") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, location, date, startTime, endTime, spots, spotPrice, services } = body;

    if (!title || !location || !date || !startTime || !spots || !spotPrice) {
      return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const soukCount = await prisma.souk.count({ where: { organizerId: user.id } });
    const isFirst = soukCount === 0;
    const fee = isFirst ? 0 : 499;

    if (fee > 0 && (user.balance ?? 0) < fee) {
      return Response.json({ error: "Solde insuffisant. Rechargez votre portefeuille." }, { status: 400 });
    }

    const coords = await geocodeLocation(location);

    const souk = await prisma.$transaction(async (tx) => {
      const s = await tx.souk.create({
        data: {
          title,
          description,
          location,
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
          date: new Date(date),
          startTime,
          endTime: endTime || null,
          spots: parseInt(spots),
          spotPrice: parseFloat(spotPrice),
          services: services || null,
          organizerId: user.id,
          paid: true,
        },
      });

      if (fee > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: { balance: { decrement: fee } },
        });

        await tx.payment.create({
          data: {
            userId: user.id,
            type: "souk_creation",
            amount: -fee,
            description: `Création du souk "${title}"`,
            referenceId: s.id,
            status: "completed",
          },
        });
      }

      return s;
    });

    return Response.json(souk, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Erreur lors de la création du souk" }, { status: 500 });
  }
}
