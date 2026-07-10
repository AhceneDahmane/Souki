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

    const vehicle = await prisma.vehicle.create({
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

    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Vehicle creation error:", error);
    return Response.json({ error: "Erreur lors de l'ajout du véhicule", detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
