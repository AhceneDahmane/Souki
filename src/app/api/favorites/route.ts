import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: {
        include: {
          souk: { select: { id: true, title: true, status: true, date: true } },
        },
      },
    },
  });

  return Response.json(favorites);
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

  const { vehicleId } = await request.json();
  if (!vehicleId) return Response.json({ error: "Véhicule requis" }, { status: 400 });

  const existing = await prisma.favorite.findUnique({
    where: { userId_vehicleId: { userId: user.id, vehicleId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return Response.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { userId: user.id, vehicleId },
  });

  return Response.json({ favorited: true });
}
