"use client";

import { useState } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { Navigation } from "@/components/navigation";
import { LandingScreen } from "@/components/screens/landing-screen";
import { FeedScreen } from "@/components/screens/feed-screen";
import { PostGoalScreen } from "@/components/screens/post-goal-screen";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";
import { SessionScreen } from "@/components/screens/session-screen";
import { LoginScreen, SignupScreen } from "@/components/screens/auth-screens";
import { MyApplicationsScreen } from "@/components/screens/my-applications-screen";
import { NotificationsScreen } from "@/components/screens/notifications-screen";

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState("landing");
  const [sessionId, setSessionId] = useState<string | undefined>();

  const handleNavigate = (screen: string) => {
    if (screen.startsWith("session:")) {
      setSessionId(screen.split(":")[1]);
      setCurrentScreen("session");
    } else {
      setCurrentScreen(screen);
    }
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "landing":
        return <LandingScreen onNavigate={handleNavigate} />;
      case "login":
        return <LoginScreen onNavigate={handleNavigate} />;
      case "signup":
        return <SignupScreen onNavigate={handleNavigate} />;
      case "feed":
        return <FeedScreen onNavigate={handleNavigate} />;
      case "post":
        return <PostGoalScreen onNavigate={handleNavigate} />;
      case "dashboard":
        return <DashboardScreen onNavigate={handleNavigate} />;
      case "profile":
        return <ProfileScreen />;
      case "session":
        return (
          <SessionScreen onNavigate={handleNavigate} sessionId={sessionId} />
        );
      case "myapplications":
        return <MyApplicationsScreen onNavigate={handleNavigate} />;
      case "notifications":
        return <NotificationsScreen onNavigate={handleNavigate} />;
      default:
        return <LandingScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto">
        {renderScreen()}
      </main>
    </div>
  );
}

export function AppWrapper() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
