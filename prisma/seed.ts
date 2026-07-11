import { PrismaClient } from "../src/lib/generated/client";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  const organizer = await prisma.user.upsert({
    where: { email: "organizer@souki.dz" },
    update: {},
    create: {
      email: "organizer@souki.dz",
      name: "Organisateur Test",
      password,
      role: "organizer",
      phone: "+213 555 123 456",
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@souki.dz" },
    update: {},
    create: {
      email: "seller@souki.dz",
      name: "Vendeur Test",
      password,
      role: "seller",
      phone: "+213 555 789 012",
    },
  });

  await prisma.user.upsert({
    where: { email: "visitor@souki.dz" },
    update: {},
    create: {
      email: "visitor@souki.dz",
      name: "Visiteur Test",
      password,
      role: "visitor",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@souki.dz" },
    update: {},
    create: {
      email: "admin@souki.dz",
      name: "Admin Souki",
      password,
      role: "admin",
    },
  });

  const souk = await prisma.souk.upsert({
    where: { id: "souk-alger-2026" },
    update: {},
    create: {
      id: "souk-alger-2026",
      title: "Souk Auto Alger Mai 2026",
      description: "Le plus grand souk automobile d'Alger.",
      location: "Alger Centre, Place des Martyrs",
      date: new Date("2026-05-15"),
      startTime: "09:00",
      endTime: "18:00",
      spots: 50,
      spotPrice: 150,
      services: "Café offert, Station de lavage gratuite, Photographie professionnelle",
      organizerId: organizer.id,
      status: "pending",
    },
  });

  await prisma.souk.upsert({
    where: { id: "souk-oran-2026" },
    update: {},
    create: {
      id: "souk-oran-2026",
      title: "Souk Auto Oran Juin 2026",
      description: "Souk automobile à Oran.",
      location: "Oran, Boulevard de l'Indépendance",
      date: new Date("2026-06-20"),
      startTime: "10:00",
      endTime: "17:00",
      spots: 30,
      spotPrice: 100,
      organizerId: organizer.id,
      status: "pending",
    },
  });

  // Seed vehicles — delete old ones first, re-create with images
  await prisma.vehicleAccess.deleteMany({});
  await prisma.bid.deleteMany({});
  await prisma.vehicle.deleteMany({});

  const vehicles = [
    {
      id: "veh-clio-4",
      title: "Renault Clio 4 1.5 dCi 90ch",
      brand: "Renault",
      model: "Clio 4",
      year: 2019,
      mileage: 45000,
      fuelType: "diesel",
      description: "Très bon état, entretien régulier, clim, régulateur, vitres électriques.",
      price: 85000,
      priceType: "negotiable",
      images: JSON.stringify(["/uploads/car1.jpeg"]),
      soukId: souk.id,
      sellerId: seller.id,
      status: "assigned",
    },
    {
      id: "veh-corolla",
      title: "Toyota Corolla 12 1.8 Hybrid",
      brand: "Toyota",
      model: "Corolla 12",
      year: 2021,
      mileage: 25000,
      fuelType: "hybride",
      description: "Berline hybride, faible consommation, garantie constructeur jusqu'en 2027.",
      price: 185000,
      priceType: "fixed",
      images: JSON.stringify(["/uploads/car2.jpeg"]),
      soukId: souk.id,
      sellerId: seller.id,
      status: "assigned",
    },
    {
      id: "veh-golf",
      title: "Volkswagen Golf 7 TSI 125ch",
      brand: "Volkswagen",
      model: "Golf 7",
      year: 2018,
      mileage: 62000,
      fuelType: "essence",
      description: "Toit ouvrant, sièges cuir, GPS, caméra de recul.",
      price: 120000,
      priceType: "negotiable",
      images: JSON.stringify(["/uploads/car3.jpeg"]),
      soukId: null,
      sellerId: seller.id,
      status: "pending",
    },
    {
      id: "veh-peugeot",
      title: "Peugeot 208 1.2 PureTech 82ch",
      brand: "Peugeot",
      model: "208",
      year: 2020,
      mileage: 34000,
      fuelType: "essence",
      description: "Première main, clim auto, écran tactile, Apple CarPlay.",
      price: 72000,
      priceType: "negotiable",
      images: JSON.stringify(["/uploads/car4.jpeg"]),
      soukId: null,
      sellerId: seller.id,
      status: "pending",
    },
    {
      id: "veh-mercedes",
      title: "Mercedes Classe C 220d AMG",
      brand: "Mercedes",
      model: "Classe C",
      year: 2022,
      mileage: 15000,
      fuelType: "diesel",
      description: "AMG Line, intérieur cuir noir, toit panoramique, assistance autoroute.",
      price: 350000,
      priceType: "fixed",
      images: JSON.stringify(["/uploads/car5.jpeg"]),
      soukId: null,
      sellerId: seller.id,
      status: "pending",
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.create({ data: v });
  }

  // Create registration for the seller in the Alger souk
  await prisma.soukRegistration.upsert({
    where: { soukId_sellerId: { soukId: souk.id, sellerId: seller.id } },
    update: {},
    create: {
      soukId: souk.id,
      sellerId: seller.id,
      status: "accepted",
      qrCode: await QRCode.toDataURL(
        JSON.stringify({ type: "souk-access", soukId: souk.id, sellerId: seller.id }),
        { width: 300, margin: 2 },
      ),
    },
  });

  // Generate vehicle QR codes for souk-assigned vehicles
  const assignedVehicles = vehicles.filter((v) => v.soukId === souk.id);
  for (const v of assignedVehicles) {
    await prisma.vehicle.update({
      where: { id: v.id },
      data: { qrCode: await QRCode.toDataURL(`/vehicles/${v.id}`, { width: 300, margin: 2 }) },
    });
  }

  console.log("Base de données initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
