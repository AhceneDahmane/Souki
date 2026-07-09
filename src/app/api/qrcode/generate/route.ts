import { NextRequest } from "next/server";
import { generateQRCode } from "@/lib/qrcode";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data) {
      return Response.json({ error: "Données requises" }, { status: 400 });
    }

    const qrCode = await generateQRCode(data);
    return Response.json({ qrCode });
  } catch (error) {
    return Response.json({ error: "Erreur lors de la génération du QR code" }, { status: 500 });
  }
}
