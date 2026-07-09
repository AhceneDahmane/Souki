import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrData } = body;

    if (!qrData) {
      return Response.json({ error: "QR data requis" }, { status: 400 });
    }

    let parsed;
    try {
      parsed = JSON.parse(
        typeof qrData === "string" && qrData.startsWith("{")
          ? qrData
          : Buffer.from(qrData, "base64").toString()
      );
    } catch {
      parsed = { type: "raw", value: qrData };
    }

    if (parsed.type === "souk-access") {
      const registration = await prisma.soukRegistration.findUnique({
        where: { soukId_sellerId: { soukId: parsed.soukId, sellerId: parsed.sellerId } },
        include: { seller: { select: { name: true } }, souk: { select: { title: true } } },
      });

      if (!registration) {
        return Response.json({ error: "Inscription introuvable" }, { status: 404 });
      }

      return Response.json({
        type: "souk-access",
        registration: {
          id: registration.id,
          sellerName: registration.seller.name,
          soukTitle: registration.souk.title,
          status: registration.status,
        },
      });
    }

    if (parsed.type === "vehicle-info") {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: parsed.vehicleId },
        include: { seller: { select: { name: true, phone: true } } },
      });

      if (!vehicle) {
        return Response.json({ error: "Véhicule introuvable" }, { status: 404 });
      }

      // Log the access
      await prisma.vehicleAccess.create({
        data: { vehicleId: vehicle.id },
      });

      return Response.json({
        type: "vehicle-info",
        vehicle: {
          id: vehicle.id,
          title: vehicle.title,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
          fuelType: vehicle.fuelType,
          description: vehicle.description,
          price: vehicle.price,
          priceType: vehicle.priceType,
          seller: vehicle.seller,
        },
      });
    }

    return Response.json({ type: "unknown", data: parsed });
  } catch (error) {
    return Response.json({ error: "Erreur lors du scan" }, { status: 500 });
  }
}
