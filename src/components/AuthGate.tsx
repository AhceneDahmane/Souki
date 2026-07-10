"use client";

import { useAuth } from "@/lib/auth-context";
import SoukiLoader from "./SoukiLoader";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) return <SoukiLoader />;
  return <>{children}</>;
}
