"use client";

import { LandingScreen } from "@/components/screens/landing-screen";
import { useNavigate } from "@/lib/routes";

export default function Home() {
  const navigate = useNavigate();
  return <LandingScreen onNavigate={navigate} />;
}
