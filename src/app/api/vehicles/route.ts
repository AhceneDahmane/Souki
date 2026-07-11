import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: "desc" },
      include: { souk: { select: { title: true } } },
    });

    return Response.json(vehicles);
  } catch (error) {
    return Response.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { title, brand, model, year, mileage, fuelType, description, price, priceType, images } = body;

    if (!title || !brand || !model) {
      return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const vehicleCount = await prisma.vehicle.count({ where: { sellerId: user.id } });
    const isFirst = vehicleCount === 0;
    const fee = isFirst ? 0 : 199;

    if (fee > 0 && (user.balance ?? 0) < fee) {
      return Response.json({ error: "Solde insuffisant. Rechargez votre portefeuille." }, { status: 400 });
    }

    const vehicle = await prisma.$transaction(async (tx) => {
      const v = await tx.vehicle.create({
        data: {
          title,
          brand,
          model,
          year: year || null,
          mileage: mileage || null,
          fuelType: fuelType || null,
          description: description || null,
          price: price || null,
          priceType: priceType || "negotiable",
          images: images || null,
          sellerId: user.id,
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
            type: "vehicle_listing",
            amount: -fee,
            description: `Ajout du véhicule "${title}"`,
            referenceId: v.id,
            status: "completed",
          },
        });
      }

      return v;
    });

    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Vehicle creation error:", error);
    return Response.json({ error: "Erreur lors de l'ajout du véhicule", detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
