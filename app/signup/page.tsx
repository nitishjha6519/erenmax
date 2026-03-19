"use client";

import { SignupScreen } from "@/components/screens/auth-screens";
import { useNavigate } from "@/lib/routes";

export default function SignupPage() {
  const navigate = useNavigate();
  return <SignupScreen onNavigate={navigate} />;
}
