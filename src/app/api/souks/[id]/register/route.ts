import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCode } from "@/lib/qrcode";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const sellerId = user.id;

    const existing = await prisma.soukRegistration.findUnique({
      where: { soukId_sellerId: { soukId: id, sellerId } },
    });

    if (existing) {
      return Response.json({ error: "Vous êtes déjà inscrit à ce souk" }, { status: 400 });
    }

    const souk = await prisma.souk.findUnique({ where: { id } });
    if (!souk) {
      return Response.json({ error: "Souk introuvable" }, { status: 404 });
    }

    const regCount = await prisma.soukRegistration.count({ where: { soukId: id } });
    if (regCount >= souk.spots) {
      return Response.json({ error: "Plus de places disponibles" }, { status: 400 });
    }

    const qrData = JSON.stringify({ type: "souk-access", soukId: id, sellerId });
    const qrCode = await generateQRCode(qrData);

    const registration = await prisma.soukRegistration.create({
      data: { soukId: id, sellerId, qrCode },
    });

    return Response.json(registration, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "organizer") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { registrationId, action, spotNumber } = body;

    const updateData: Record<string, unknown> = { status: action };
    if (action === "present" && spotNumber) {
      updateData.spotNumber = parseInt(spotNumber);
    }

    const registration = await prisma.soukRegistration.update({
      where: { id: registrationId },
      data: updateData,
    });

    // If present, generate vehicle QR codes
    if (action === "present") {
      const vehicles = await prisma.vehicle.findMany({
        where: { soukId: id, sellerId: registration.sellerId },
      });

      for (const vehicle of vehicles) {
        if (!vehicle.qrCode) {
          const qrData = JSON.stringify({ type: "vehicle-info", vehicleId: vehicle.id, soukId: id });
          const qrCode = await generateQRCode(qrData);
          await prisma.vehicle.update({
            where: { id: vehicle.id },
            data: { qrCode, status: "assigned" },
          });
        }
      }
    }

    return Response.json(registration);
  } catch (error) {
    return Response.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
