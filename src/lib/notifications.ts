import { prisma } from "@/lib/prisma";

type NotificationInput = {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
};

export async function createNotification(data: NotificationInput) {
  return prisma.notification.create({ data });
}
