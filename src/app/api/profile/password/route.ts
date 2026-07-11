import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, hashPassword, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json({ error: "Non connecté" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json({ error: "Champs obligatoires" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return Response.json({ error: "Minimum 6 caractères" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, dbUser.password);
    if (!valid) {
      return Response.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Erreur" }, { status: 500 });
  }
}
