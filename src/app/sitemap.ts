import { prisma } from "@/lib/prisma";

const BASE_URL = "https://souki.dz";

const staticPages = [
  { url: "", priority: "1.0", changeFreq: "weekly" },
  { url: "/souks", priority: "0.9", changeFreq: "daily" },
  { url: "/souks/map", priority: "0.8", changeFreq: "daily" },
  { url: "/faq", priority: "0.6", changeFreq: "monthly" },
  { url: "/contact", priority: "0.5", changeFreq: "monthly" },
  { url: "/cgu", priority: "0.3", changeFreq: "yearly" },
  { url: "/cookies", priority: "0.3", changeFreq: "yearly" },
  { url: "/changelog", priority: "0.4", changeFreq: "monthly" },
];

export default async function sitemap() {
  const souks = await prisma.souk.findMany({
    select: { id: true, updatedAt: true },
    where: { status: { not: "cancelled" } },
  });

  const vehicles = await prisma.vehicle.findMany({
    select: { id: true, updatedAt: true },
  });

  return [
    ...staticPages.map((p) => ({
      url: `${BASE_URL}${p.url}`,
      priority: p.priority,
      changeFrequency: p.changeFreq,
    })),
    ...souks.map((s) => ({
      url: `${BASE_URL}/souks/${s.id}`,
      priority: "0.7" as const,
      changeFrequency: "daily" as const,
      lastModified: s.updatedAt,
    })),
    ...vehicles.map((v) => ({
      url: `${BASE_URL}/vehicles/${v.id}`,
      priority: "0.6" as const,
      changeFrequency: "daily" as const,
      lastModified: v.updatedAt,
    })),
  ];
}
