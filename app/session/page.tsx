"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SessionScreen } from "@/components/screens/session-screen";
import { useNavigate } from "@/lib/routes";

function SessionPageInner() {
  const params = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("id") ?? undefined;
  return <SessionScreen onNavigate={navigate} sessionId={sessionId} />;
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionPageInner />
    </Suspense>
  );
}
