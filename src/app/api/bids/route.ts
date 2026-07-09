import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const vehicleId = searchParams.get("vehicleId");

    const where = vehicleId ? { vehicleId } : {};

    const bids = await prisma.bid.findMany({
      where,
      include: { visitor: { select: { name: true } } },
      orderBy: { amount: "desc" },
    });

    return Response.json(bids);
  } catch (error) {
    return Response.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, amount } = body;

    if (!vehicleId || !amount) {
      return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const visitorId = "default-visitor"; // temp until auth

    const bid = await prisma.bid.create({
      data: { vehicleId, amount: parseFloat(amount), visitorId },
    });

    return Response.json(bid, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Erreur lors de l'enchère" }, { status: 500 });
  }
}
