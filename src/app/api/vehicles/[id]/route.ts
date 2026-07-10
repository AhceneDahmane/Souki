import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

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
    const user = await getAuthUser();
    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Véhicule introuvable" }, { status: 404 });
    }
    if (existing.sellerId !== user.id) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: body,
    });

    return Response.json(vehicle);
  } catch (error) {
    return Response.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Véhicule introuvable" }, { status: 404 });
    }
    if (existing.sellerId !== user.id) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    await prisma.vehicleAccess.deleteMany({ where: { vehicleId: id } });
    await prisma.bid.deleteMany({ where: { vehicleId: id } });
    await prisma.vehicle.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
