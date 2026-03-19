"use client";

import { FeedScreen } from "@/components/screens/feed-screen";
import { useNavigate } from "@/lib/routes";

export default function FeedPage() {
  const navigate = useNavigate();
  return <FeedScreen onNavigate={navigate} />;
}
