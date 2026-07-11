import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

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
    const user = await getAuthUser();
    if (!user) {
      return Response.json({ error: "Connectez-vous d'abord" }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleId, amount } = body;

    if (!vehicleId || !amount) {
      return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const bid = await prisma.bid.create({
      data: { vehicleId, amount: parseFloat(amount), visitorId: user.id },
    });

    // Notify seller
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { seller: true },
    });

    if (vehicle && vehicle.sellerId !== user.id) {
      await createNotification({
        userId: vehicle.sellerId,
        type: "new_bid",
        title: "Nouvelle enchère",
        message: `${user.name} a enchéri ${parseFloat(amount).toLocaleString("fr-FR")} DZD sur ${vehicle.title}`,
        link: `/vehicles/${vehicleId}`,
      });
    }

    // Notify outbid previous highest bidder
    const previousBids = await prisma.bid.findMany({
      where: { vehicleId, visitorId: { not: user.id }, status: "active" },
      orderBy: { amount: "desc" },
      include: { visitor: true },
    });

    const previousHighest = previousBids[0];
    if (previousHighest && previousHighest.visitorId !== user.id) {
      await prisma.bid.updateMany({
        where: { vehicleId, visitorId: { not: user.id } },
        data: { status: "outbid" },
      });

      await createNotification({
        userId: previousHighest.visitorId,
        type: "bid_outbid",
        title: "Enchère dépassée",
        message: `Vous avez été dépassé sur ${vehicle?.title ?? "un véhicule"}. Nouvelle enchère : ${parseFloat(amount).toLocaleString("fr-FR")} DZD`,
        link: `/vehicles/${vehicleId}`,
      });
    }

    return Response.json(bid, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Erreur lors de l'enchère" }, { status: 500 });
  }
}
