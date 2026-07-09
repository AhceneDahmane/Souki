import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCode } from "@/lib/qrcode";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { title, brand, model, year, mileage, fuelType, description, price, priceType, soukId, images } = body;

    if (!title || !brand || !model || !soukId) {
      return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const sellerId = user.id;

    const existingReg = await prisma.soukRegistration.findUnique({
      where: { soukId_sellerId: { soukId, sellerId } },
    });

    if (!existingReg) {
      const qrData = JSON.stringify({ type: "souk-access", soukId, sellerId });
      const qrCode = await generateQRCode(qrData);

      await prisma.soukRegistration.create({
        data: { soukId, sellerId, qrCode },
      });
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
        soukId,
        sellerId,
      },
    });

    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Vehicle creation error:", error);
    return Response.json({ error: "Erreur lors de l'ajout du véhicule", detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
