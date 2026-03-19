"use client";

import { useRouter } from "next/navigation";

export const SCREEN_TO_PATH: Record<string, string> = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  feed: "/feed",
  post: "/post-goal",
  "post-goal": "/post-goal",
  dashboard: "/dashboard",
  profile: "/profile",
  session: "/session",
  myapplications: "/my-applications",
  notifications: "/notifications",
};

export const PATH_TO_SCREEN: Record<string, string> = {
  "/": "landing",
  "/login": "login",
  "/signup": "signup",
  "/feed": "feed",
  "/post-goal": "post",
  "/dashboard": "dashboard",
  "/profile": "profile",
  "/session": "session",
  "/my-applications": "myapplications",
  "/notifications": "notifications",
};

export function useNavigate() {
  const router = useRouter();
  return (screen: string) => {
    if (screen.startsWith("session:")) {
      router.push(`/session?id=${screen.split(":")[1]}`);
    } else {
      router.push(SCREEN_TO_PATH[screen] ?? "/");
    }
  };
}
