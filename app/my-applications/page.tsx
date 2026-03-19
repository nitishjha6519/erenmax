"use client";

import { MyApplicationsScreen } from "@/components/screens/my-applications-screen";
import { useNavigate } from "@/lib/routes";

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  return <MyApplicationsScreen onNavigate={navigate} />;
}
