import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, hashPassword, verifyPassword } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ error: "Non connecté" }, { status: 401 });
  }
  return Response.json({ user });
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json({ error: "Non connecté" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: name ?? undefined, phone: phone ?? undefined },
      select: { id: true, email: true, name: true, role: true, phone: true },
    });

    return Response.json({ user: updated });
  } catch {
    return Response.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
