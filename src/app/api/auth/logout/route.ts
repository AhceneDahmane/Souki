import { clearCookie } from "@/lib/auth";

export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Set-Cookie": clearCookie() },
  });
}
