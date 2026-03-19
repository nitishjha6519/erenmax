"use client";

import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { useNavigate } from "@/lib/routes";

export default function DashboardPage() {
  const navigate = useNavigate();
  return <DashboardScreen onNavigate={navigate} />;
}
