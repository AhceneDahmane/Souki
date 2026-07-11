import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  return Response.json({ success: true });
}
