import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "organizer") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const souk = await prisma.souk.findUnique({ where: { id } });

    if (!souk || souk.organizerId !== user.id) {
      return Response.json({ error: "Souk introuvable" }, { status: 404 });
    }

    return Response.json(souk);
  } catch {
    return Response.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "organizer") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.souk.findUnique({ where: { id } });
    if (!existing || existing.organizerId !== user.id) {
      return Response.json({ error: "Souk introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, location, date, startTime, endTime, spots, spotPrice, services } = body;

    const souk = await prisma.souk.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(spots !== undefined && { spots: parseInt(spots) }),
        ...(spotPrice !== undefined && { spotPrice: parseFloat(spotPrice) }),
        ...(services !== undefined && { services }),
      },
    });

    return Response.json(souk);
  } catch {
    return Response.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "organizer") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.souk.findUnique({ where: { id } });
    if (!existing || existing.organizerId !== user.id) {
      return Response.json({ error: "Souk introuvable" }, { status: 404 });
    }

    await prisma.souk.delete({ where: { id } });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
