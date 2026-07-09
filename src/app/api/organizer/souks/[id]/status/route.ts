import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
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

    return Response.json(souk);
  } catch (error) {
    return Response.json({ error: "Erreur lors de la mise à jour du statut" }, { status: 500 });
  }
}
