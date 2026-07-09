import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vehicles = await prisma.vehicle.findMany({
      where: { soukId: id },
      include: { seller: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Return vehicles without prices for visitors (hide prices)
    const safeVehicles = vehicles.map((v) => ({
      id: v.id,
      title: v.title,
      brand: v.brand,
      model: v.model,
      year: v.year,
      mileage: v.mileage,
      fuelType: v.fuelType,
      description: v.description,
      priceType: v.priceType,
      seller: v.seller,
      hasPrice: v.price !== null,
    }));

    return Response.json(safeVehicles);
  } catch (error) {
    return Response.json({ error: "Erreur" }, { status: 500 });
  }
}
