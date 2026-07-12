import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, createCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, role, phone, cguAccepted } = await request.json();

    if (!email || !name || !password) {
      return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    if (!cguAccepted) {
      return Response.json({ error: "Vous devez accepter les conditions générales d'utilisation" }, { status: 400 });
    }

    const validRoles = ["visitor", "organizer", "seller"];
    const userRole = role && validRoles.includes(role) ? role : "visitor";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword, role: userRole, phone: phone || null, cguAccepted: true, cguAcceptedAt: new Date() },
    });

    const token = signToken({ userId: user.id, role: user.role });

    return new Response(
      JSON.stringify({
        user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone, balance: user.balance, cguAccepted: user.cguAccepted },
      }),
      { status: 201, headers: { "Set-Cookie": createCookie(token) } },
    );
  } catch (error) {
    return Response.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
