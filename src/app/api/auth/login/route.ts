import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, createCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const token = signToken({ userId: user.id, role: user.role });

    return new Response(
      JSON.stringify({
        user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone, balance: user.balance, cguAccepted: user.cguAccepted },
      }),
      { status: 200, headers: { "Set-Cookie": createCookie(token) } },
    );
  } catch (error) {
    return Response.json({ error: "Erreur lors de la connexion" }, { status: 500 });
  }
}
