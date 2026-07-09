import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ error: "Non connecté" }, { status: 401 });
  }
  return Response.json({ user });
}
