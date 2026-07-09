import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { seller: { select: { name: true, phone: true } } },
    });

    if (!vehicle) {
      return Response.json({ error: "Véhicule introuvable" }, { status: 404 });
    }

    return Response.json(vehicle);
  } catch (error) {
    return Response.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: body,
    });

    return Response.json(vehicle);
  } catch (error) {
    return Response.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
