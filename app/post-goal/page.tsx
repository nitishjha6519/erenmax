"use client";

import { PostGoalScreen } from "@/components/screens/post-goal-screen";
import { useNavigate } from "@/lib/routes";

export default function PostGoalPage() {
  const navigate = useNavigate();
  return <PostGoalScreen onNavigate={navigate} />;
}
