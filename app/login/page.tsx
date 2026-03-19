"use client";

import { LoginScreen } from "@/components/screens/auth-screens";
import { useNavigate } from "@/lib/routes";

export default function LoginPage() {
  const navigate = useNavigate();
  return <LoginScreen onNavigate={navigate} />;
}
