import { prisma } from "@/lib/prisma";
import { geocodeLocation } from "@/lib/geocode";

export async function GET() {
  const souks = await prisma.souk.findMany({
    where: { status: { not: "cancelled" } },
    orderBy: { date: "desc" },
    include: {
      organizer: { select: { name: true } },
      _count: { select: { vehicles: true, registrations: true } },
    },
  });

  const markers = [];
  for (const souk of souks) {
    let lat = souk.lat;
    let lng = souk.lng;

    if (lat === null || lng === null) {
      const coords = await geocodeLocation(souk.location);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
        await prisma.souk.update({
          where: { id: souk.id },
          data: { lat, lng },
        });
      }
    }

    markers.push({
      id: souk.id,
      title: souk.title,
      location: souk.location,
      date: souk.date.toISOString(),
      status: souk.status,
      organizer: souk.organizer.name,
      vehiclesCount: souk._count.vehicles,
      registrationsCount: souk._count.registrations,
      spots: souk.spots,
      lat: lat ?? 36.7538,
      lng: lng ?? 3.0588,
    });
  }

  return Response.json(markers);
}
