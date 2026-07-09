import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ManageSoukClient from "./ManageSoukClient";

export const dynamic = "force-dynamic";

export default async function ManageSoukPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  return <ManageSoukClient souk={souk} />;
}
