"use client";

import { NotificationsScreen } from "@/components/screens/notifications-screen";
import { useNavigate } from "@/lib/routes";

export default function NotificationsPage() {
  const navigate = useNavigate();
  return <NotificationsScreen onNavigate={navigate} />;
}
