import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

    const { amount } = await request.json();
    if (!amount || amount <= 0) {
      return Response.json({ error: "Montant invalide" }, { status: 400 });
    }

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: amount } },
      }),
      prisma.payment.create({
        data: {
          userId: user.id,
          type: "recharge",
          amount,
          description: `Recharge de ${amount.toLocaleString("fr-FR")} DZD`,
          status: "completed",
        },
      }),
    ]);

    return Response.json({ balance: updatedUser.balance });
  } catch {
    return Response.json({ error: "Erreur" }, { status: 500 });
  }
}
