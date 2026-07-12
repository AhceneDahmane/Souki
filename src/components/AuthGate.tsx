"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import SoukiLoader from "./SoukiLoader";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    if (!user.cguAccepted && !pathname.startsWith("/cgu/accept") && !pathname.startsWith("/register")) {
      router.replace("/cgu/accept");
    }
  }, [user, loading, pathname, router]);

  if (loading) return <SoukiLoader />;
  return <>{children}</>;
}
