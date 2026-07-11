import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { souk: { select: { title: true } } },
  });

  return Response.json({ payments, balance: user.balance });
}
