import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCode } from "@/lib/qrcode";
import { getAuthUser } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const sellerId = user.id;
    const body = await request.json();
    const { vehicleIds } = body;

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return Response.json({ error: "Sélectionnez au moins un véhicule" }, { status: 400 });
    }

    const souk = await prisma.souk.findUnique({ where: { id } });
    if (!souk) {
      return Response.json({ error: "Souk introuvable" }, { status: 404 });
    }

    // Verify vehicles belong to seller and are not already assigned to another souk
    const vehicles = await prisma.vehicle.findMany({
      where: { id: { in: vehicleIds }, sellerId, soukId: null },
    });
    if (vehicles.length !== vehicleIds.length) {
      return Response.json({ error: "Certains véhicules sont déjà inscrits à un autre souk" }, { status: 400 });
    }

    const existing = await prisma.soukRegistration.findUnique({
      where: { soukId_sellerId: { soukId: id, sellerId } },
    });

    let registration;
    if (!existing) {
      const regCount = await prisma.soukRegistration.count({ where: { soukId: id } });
      if (regCount >= souk.spots) {
        return Response.json({ error: "Plus de places disponibles" }, { status: 400 });
      }

      if ((user.balance ?? 0) < souk.spotPrice) {
        return Response.json({ error: "Solde insuffisant. Rechargez votre portefeuille." }, { status: 400 });
      }

      const qrData = JSON.stringify({ type: "souk-access", soukId: id, sellerId });
      const qrCode = await generateQRCode(qrData);

      registration = await prisma.$transaction(async (tx) => {
        const reg = await tx.soukRegistration.create({
          data: { soukId: id, sellerId, qrCode, paid: true },
        });

        await tx.user.update({
          where: { id: sellerId },
          data: { balance: { decrement: souk.spotPrice } },
        });

        await tx.payment.create({
          data: {
            userId: sellerId,
            type: "registration",
            amount: -souk.spotPrice,
            description: `Inscription au souk "${souk.title}"`,
            referenceId: id,
            status: "completed",
          },
        });

        return reg;
      });
    }

    // Link vehicles to souk and generate vehicle QR codes
    await prisma.vehicle.updateMany({
      where: { id: { in: vehicleIds } },
      data: { soukId: id },
    });

    for (const vehicle of vehicles) {
      const vehicleQrData = `/vehicles/${vehicle.id}`;
      const vehicleQrCode = await generateQRCode(vehicleQrData);
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { qrCode: vehicleQrCode, status: "assigned" },
      });
    }

    return Response.json({ registration, vehiclesLinked: vehicleIds.length }, { status: existing ? 200 : 201 });
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

    // Notify seller of status change
    if (action === "accepted") {
      await createNotification({
        userId: registration.sellerId,
        type: "registration_accepted",
        title: "Inscription acceptée",
        message: "Votre inscription au souk a été acceptée par l'organisateur.",
        link: `/seller/dashboard`,
      });
    } else if (action === "rejected") {
      await createNotification({
        userId: registration.sellerId,
        type: "registration_rejected",
        title: "Inscription refusée",
        message: "Votre inscription au souk a été refusée par l'organisateur.",
        link: `/seller/dashboard`,
      });
    }

    // If present, generate vehicle QR codes for any vehicles missing them
    if (action === "present") {
      const vehicles = await prisma.vehicle.findMany({
        where: { soukId: id, sellerId: registration.sellerId, qrCode: null },
      });

      for (const vehicle of vehicles) {
        const qrData = `/vehicles/${vehicle.id}`;
        const qrCode = await generateQRCode(qrData);
        await prisma.vehicle.update({
          where: { id: vehicle.id },
          data: { qrCode, status: "assigned" },
        });
      }
    }

    return Response.json(registration);
  } catch (error) {
    return Response.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
