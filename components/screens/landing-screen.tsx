"use client";

import {
  Search,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle,
  Flame,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LandingScreenProps {
  onNavigate: (screen: string) => void;
}

const sampleGoals = [
  {
    id: 1,
    user: "Rahul K",
    avatar: "R",
    title: "Trees — Lowest Common Ancestor",
    category: "DSA",
    level: "Intermediate",
    points: 50,
    time: "45 min",
    date: "Thu Mar 20 · 7:00 PM",
    applicants: 1,
  },
  {
    id: 2,
    user: "Neha S",
    avatar: "N",
    title: "Design Twitter Feed",
    category: "System Design",
    level: "Advanced",
    points: 75,
    time: "75 min",
    date: "Sat Mar 22 · 5:00 PM",
    applicants: 0,
  },
  {
    id: 3,
    user: "Aditya M",
    avatar: "A",
    title: "Conflict Resolution — STAR method",
    category: "Behavioral",
    level: "Beginner",
    points: 30,
    time: "30 min",
    date: "Tue Mar 25 · 7:00 PM",
    applicants: 0,
  },
];

const categories = ["All", "DSA", "System Design", "Behavioral"];

const trustPointRules = [
  {
    label: "Show up, give good feedback",
    value: "+10 to +25 pts",
    color: "text-emerald-500",
    icon: CheckCircle,
  },
  {
    label: "Streak bonus (7, 14, 30 days)",
    value: "+25 pts bonus",
    color: "text-emerald-500",
    icon: Flame,
  },
  {
    label: "No-show after approval",
    value: "-staked pts",
    color: "text-red-500",
    icon: XCircle,
  },
  {
    label: "Cancel < 2h before session",
    value: "-15 pts",
    color: "text-red-500",
    icon: AlertCircle,
  },
];

export function LandingScreen({ onNavigate }: LandingScreenProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-50 text-emerald-700";
      case "Intermediate":
        return "bg-blue-50 text-blue-700";
      case "Advanced":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "DSA":
        return "bg-blue-100 text-blue-700";
      case "System Design":
        return "bg-purple-100 text-purple-700";
      case "Behavioral":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-12">
      {/* Hero Section */}
      <section className="pt-12 md:pt-20 pb-14 md:pb-20 px-4 md:px-2 text-center max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-[32px] md:text-[48px] lg:text-[56px] text-foreground tracking-tight leading-[1.1] mb-2">
          When you want it badly enough,
        </h1>
        <h2 className="font-display font-bold text-[28px] md:text-[40px] lg:text-[52px] text-primary tracking-tight leading-[1.1] mb-8">
          the world shows up.
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Post your interview goal. Build a roadmap of 100 sessions. The
          community volunteers — one slot at a time. You approve who helps you.
        </p>
      </section>

      {/* How Trust Points Work */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto mb-12">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-6">
            How Trust Points Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Pledged Points
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Goal-setters stake points when posting a goal — skin in the
                  game.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Earned by Assistants
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Complete the trial and the pledged pts transfer to you as
                  reward.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Builds Your Reputation
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A high trust score unlocks better goals and higher-value
                  partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 4 Steps */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: "01",
              title: "Post your goal",
              desc: "Name your target. Build a roadmap of up to 100 topics.",
            },
            {
              num: "02",
              title: "Community applies",
              desc: "Anyone strong in that topic can apply to run that session.",
            },
            {
              num: "03",
              title: "You approve",
              desc: "See trust scores and pick the best person for each slot.",
            },
            {
              num: "04",
              title: "Hit 100 reps",
              desc: "Run the session. Rate each other. Trust scores update.",
            },
          ].map((step) => (
            <div
              key={step.num}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="font-display font-bold text-3xl text-muted-foreground/20 mb-2">
                {step.num}
              </div>
              <div className="font-semibold text-foreground mb-1.5">
                {step.title}
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse Goals Section - Two Column Layout on Large Screens */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto mb-12">
        <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-8">
          {/* Left Column - Search & Filters */}
          <div className="mb-6 lg:mb-0">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Try 'Fitness' or 'Coding'..."
                className="pl-11 h-12 bg-muted border-0 rounded-xl text-sm"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6 lg:mb-8">
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    i === 0
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Post Goal Card - Desktop Only */}
            <div className="hidden lg:block">
              <button
                onClick={() => onNavigate("post-goal")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-4 px-5 flex items-center justify-between transition-colors"
              >
                <div className="text-left">
                  <div className="text-xs text-primary-foreground/70">
                    The wall won't break itself
                  </div>
                  <div className="font-semibold text-lg">Post Goal</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Column - Recent Requests */}
          <div>
            {/* Recent Requests Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                Recent Requests
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </h3>
              <button
                onClick={() => onNavigate("feed")}
                className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
              >
                See more <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Goal Cards */}
            <div className="flex flex-col gap-3">
              {sampleGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors cursor-pointer"
                  onClick={() => onNavigate("feed")}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      {goal.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className="font-medium text-foreground">
                          {goal.user}
                        </span>
                        <span className="text-sm font-semibold text-primary flex-shrink-0">
                          {goal.points} pts
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2.5">
                        {goal.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(goal.category)}`}
                        >
                          {goal.category}
                        </span>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getLevelColor(goal.level)}`}
                        >
                          {goal.level}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {goal.time}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
                          {goal.applicants === 0
                            ? "Be first to apply"
                            : `${goal.applicants} applicant`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Trust System - Point Rules */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto mb-12">
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8">
          <h3 className="font-mono text-xs tracking-widest uppercase text-primary mb-4">
            The Trust System
          </h3>
          <h4 className="font-display font-bold text-xl md:text-2xl text-white mb-3">
            Skin in the game — for everyone
          </h4>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
            Every user has a trust score. When you apply for a slot, you stake
            points. If you get approved and don't show up — you lose them. The
            poster sees your score before deciding. No flakes. No wasted
            sessions.
          </p>

          <div className="space-y-3">
            {trustPointRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-slate-800/50 rounded-xl px-5 py-4"
              >
                <span className="text-slate-200 text-sm md:text-base">
                  {rule.label}
                </span>
                <span className={`font-mono text-sm font-medium ${rule.color}`}>
                  {rule.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto mb-12">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-display font-bold text-2xl md:text-3xl text-foreground">
                2,400+
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                sessions run
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl md:text-3xl text-foreground">
                840
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                goals posted
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl md:text-3xl text-foreground">
                94%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                show-up rate
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl md:text-3xl text-foreground">
                3,200
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                helpers joined
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop CTA */}
      <section className="hidden lg:block px-4 md:px-6 max-w-6xl mx-auto">
        <div className="bg-primary rounded-2xl p-8 flex items-center justify-between">
          <div>
            <div className="text-primary-foreground/70 text-sm mb-1">
              The wall won't break itself
            </div>
            <h3 className="font-display font-bold text-2xl text-primary-foreground">
              Ready to post your goal?
            </h3>
          </div>
          <Button
            onClick={() => onNavigate("post-goal")}
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 font-semibold rounded-xl text-base"
          >
            Post Goal <Plus className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Floating Post Goal Button - mobile/tablet only */}
      <div className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
        <button
          onClick={() => onNavigate("post-goal")}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-4 px-6 flex items-center justify-between shadow-xl shadow-primary/20"
        >
          <div className="text-left">
            <div className="text-xs text-primary-foreground/70">
              The wall won't break itself
            </div>
            <div className="font-semibold text-lg">Post Goal</div>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
        </button>
      </div>
    </div>
  );
}
