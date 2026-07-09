import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const bid = await prisma.bid.update({
      where: { id },
      data: { status: body.status },
    });

    return Response.json(bid);
  } catch (error) {
    return Response.json({ error: "Erreur" }, { status: 500 });
  }
}
