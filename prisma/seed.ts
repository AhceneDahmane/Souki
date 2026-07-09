import { PrismaClient } from "../src/lib/generated/client";
import bcrypt from "bcryptjs";

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

  const souk = await prisma.souk.create({
    data: {
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

  await prisma.souk.create({
    data: {
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

  await prisma.vehicle.create({
    data: {
      title: "Renault Clio 4 1.5 dCi 90ch",
      brand: "Renault",
      model: "Clio 4",
      year: 2019,
      mileage: 45000,
      fuelType: "diesel",
      description: "Très bon état, entretien régulier, clim, régulateur.",
      price: 85000,
      priceType: "negotiable",
      soukId: souk.id,
      sellerId: seller.id,
    },
  });

  await prisma.vehicle.create({
    data: {
      title: "Toyota Corolla 12 1.8 Hybrid",
      brand: "Toyota",
      model: "Corolla 12",
      year: 2021,
      mileage: 25000,
      fuelType: "hybride",
      description: "Berline hybride, faible consommation, garantie constructeur.",
      price: 185000,
      priceType: "fixed",
      soukId: souk.id,
      sellerId: seller.id,
    },
  });

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
