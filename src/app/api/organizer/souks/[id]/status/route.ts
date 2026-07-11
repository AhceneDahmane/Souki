import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "organizer") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["pending", "active", "completed", "cancelled"].includes(status)) {
      return Response.json({ error: "Statut invalide" }, { status: 400 });
    }

    const souk = await prisma.souk.update({
      where: { id },
      data: { status },
    });

    // Notify all registered sellers
    if (status === "active" || status === "cancelled") {
      const registrations = await prisma.soukRegistration.findMany({
        where: { soukId: id, status: { in: ["pending", "accepted", "present"] } },
      });

      const label = status === "active" ? "est maintenant actif" : "a été annulé";
      for (const reg of registrations) {
        await createNotification({
          userId: reg.sellerId,
          type: "souk_status",
          title: `Souk "${souk.title}" ${label}`,
          message: status === "active"
            ? "Le souk est ouvert ! Rendez-vous sur place avec vos véhicules."
            : "Le souk a été annulé. Vous serez remboursé.",
          link: `/souks/${id}`,
        });
      }
    }

    return Response.json(souk);
  } catch (error) {
    return Response.json({ error: "Erreur lors de la mise à jour du statut" }, { status: 500 });
  }
}
