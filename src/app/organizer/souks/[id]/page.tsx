import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import ManageSoukClient from "./ManageSoukClient";

export const dynamic = "force-dynamic";

export default async function ManageSoukPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();
  if (!user || user.role !== "organizer") redirect("/login");

  const { id } = await params;
  const souk = await prisma.souk.findUnique({
    where: { id },
    include: {
      registrations: {
        include: { seller: { select: { name: true, email: true, phone: true } } },
        orderBy: { createdAt: "desc" },
      },
      vehicles: {
        include: { seller: { select: { name: true } } },
      },
    },
  });

  if (!souk) notFound();
  if (souk.organizerId !== user.id) redirect("/organizer/dashboard");

  return <ManageSoukClient souk={souk} />;
}
