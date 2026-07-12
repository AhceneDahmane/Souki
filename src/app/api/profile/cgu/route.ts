import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ error: "Non connecté" }, { status: 401 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { cguAccepted: true, cguAcceptedAt: new Date() },
    select: { id: true, email: true, name: true, role: true, phone: true, balance: true, cguAccepted: true },
  });

  return Response.json({ user: updated });
}
