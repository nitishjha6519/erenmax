"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface FeedScreenProps {
  onNavigate: (screen: string) => void;
}

const goalData = {
  rahul: {
    avatar: "RK",
    cls: "av-purple",
    name: "Rahul Krishnan",
    meta: "Hyderabad · 5 YOE · ★ 892 trust",
    title: "Targeting FAANG — DSA full prep",
    desc: "Grinding LeetCode medium/hard. Targeting Google L4 in 8 weeks.",
    done: 34,
    left: 66,
    slots: 3,
    helpers: 12,
    trust: 892,
    location: "Hyderabad",
    posted: "2 hours ago",
  },
  neha: {
    avatar: "NS",
    cls: "av-green",
    name: "Neha Sharma",
    meta: "Bangalore · 3 YOE · ★ 620 trust",
    title: "System design from scratch — 10 weeks",
    desc: "Comfortable with DSA, system design is my gap.",
    done: 12,
    left: 88,
    slots: 5,
    helpers: 4,
    trust: 620,
    location: "Bangalore",
    posted: "5 hours ago",
  },
  aditya: {
    avatar: "AM",
    cls: "av-orange",
    name: "Aditya Mehta",
    meta: "Mumbai · 4 YOE · ★ 760 trust",
    title: "Behavioral mastery — STAR method deep dive",
    desc: "Been rejected at behavioral rounds twice.",
    done: 8,
    left: 92,
    slots: 4,
    helpers: 3,
    trust: 760,
    location: "Mumbai",
    posted: "yesterday",
  },
  priya: {
    avatar: "PV",
    cls: "av-blue",
    name: "Priya Venkat",
    meta: "Chennai · 4 YOE · ★ 834 trust",
    title: "Full loop prep — Meta & Amazon target",
    desc: "Alternating DSA and system design. Serious partners only.",
    done: 21,
    left: 79,
    slots: 0,
    helpers: 8,
    trust: 834,
    location: "Chennai",
    posted: "2 days ago",
  },
};

type GoalKey = keyof typeof goalData;

export function FeedScreen({ onNavigate }: FeedScreenProps) {
  const { isLoggedIn } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState<GoalKey | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("sessions");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySlotInfo, setApplySlotInfo] = useState({
    topic: "",
    session: "",
    time: "",
    stake: "",
  });

  const openApplyModal = (
    topic: string,
    session: string,
    time: string,
    stake: string,
  ) => {
    setApplySlotInfo({ topic, session, time, stake });
    setShowApplyModal(true);
  };

  if (selectedGoal) {
    const goal = goalData[selectedGoal];
    return (
      <div className="animate-fade-up">
        <Button
          variant="outline"
          size="sm"
          className="mb-4 md:mb-5"
          onClick={() => setSelectedGoal(null)}
        >
          ← Back to browse
        </Button>

        {/* Goal Hero */}
        <div className="bg-ink rounded-[20px] px-5 md:px-10 py-6 md:py-9 mb-5 md:mb-6 relative overflow-hidden">
          <div className="absolute right-4 md:right-8 -top-2.5 font-display text-[80px] md:text-[120px] font-extrabold text-white/5 leading-none tracking-tight pointer-events-none">
            100
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 md:w-14 h-12 md:h-14 rounded-full ${goal.cls} flex items-center justify-center font-display font-extrabold text-base md:text-lg`}
              >
                {goal.avatar}
              </div>
              <div>
                <div className="font-display text-[13px] font-bold text-white">
                  {goal.name}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{goal.meta}</div>
              </div>
            </div>
            <span className="badge-green text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full self-start">
              Active goal
            </span>
          </div>
          <div className="font-display font-extrabold text-xl md:text-[28px] text-white tracking-tight mb-1 relative z-10">
            {goal.title}
          </div>
          <div className="text-sm text-white/50 mt-1.5 mb-4 md:mb-5 max-w-[560px] relative z-10">
            {goal.desc}
          </div>
          <div className="grid grid-cols-2 sm:flex gap-4 md:gap-8 relative z-10">
            <div>
              <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">
                {goal.done}
              </div>
              <div className="font-mono text-[10px] md:text-xs text-white/40">
                reps done
              </div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">
                {goal.left}
              </div>
              <div className="font-mono text-[10px] md:text-xs text-white/40">
                remaining
              </div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl md:text-[32px] text-primary tracking-tight">
                {goal.slots}
              </div>
              <div className="font-mono text-[10px] md:text-xs text-white/40">
                open slots
              </div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">
                {goal.helpers}
              </div>
              <div className="font-mono text-[10px] md:text-xs text-white/40">
                helpers so far
              </div>
            </div>
          </div>
        </div>

        {/* Login CTA */}
        {!isLoggedIn && (
          <div className="bg-card border-[1.5px] border-primary rounded-[20px] px-4 md:px-6 py-4 md:py-5 mb-5 md:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="font-display font-bold text-sm md:text-[15px] mb-1">
                Want to help with an open slot?
              </div>
              <div className="text-xs md:text-sm text-text2">
                Log in or sign up to apply. It takes 30 seconds. Your trust
                score goes up every time you show up.
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("login")}
              >
                Log in
              </Button>
              <Button size="sm" onClick={() => onNavigate("signup")}>
                Sign up to apply
              </Button>
            </div>
          </div>
        )}

        {/* Mobile tabs */}
        <div className="flex md:hidden gap-2 mb-4 overflow-x-auto pb-2">
          {["sessions", "partners", "about"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap",
                activeTab === tab
                  ? "bg-ink text-white"
                  : "bg-surface text-text2",
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-5 md:gap-6">
          {/* Sidebar - Desktop only */}
          <div className="hidden md:block">
            <div className="bg-ink rounded-[20px] p-4 sticky top-24">
              {["sessions", "partners", "about"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/55 text-sm font-medium cursor-pointer transition-all hover:text-white hover:bg-white/5 mb-0.5",
                    activeTab === tab && "text-white bg-white/10",
                  )}
                >
                  <span className="text-base w-5 text-center">
                    {tab === "sessions" ? "◫" : tab === "partners" ? "◎" : "◼"}
                  </span>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === "sessions" && (
              <SessionsTab
                goal={goal}
                openApplyModal={openApplyModal}
                onNavigate={onNavigate}
              />
            )}
            {activeTab === "partners" && <PartnersTab />}
            {activeTab === "about" && <AboutTab goal={goal} />}
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setShowApplyModal(false)}
          >
            <div
              className="bg-card rounded-t-[20px] md:rounded-[20px] p-6 md:p-8 w-full md:w-[480px] md:max-w-[90vw] animate-fade-up"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoggedIn ? (
                <>
                  <div className="font-display font-extrabold text-lg md:text-[22px] mb-1">
                    Apply for this slot
                  </div>
                  <div className="text-xs md:text-sm text-text2 mb-5 md:mb-6">
                    {applySlotInfo.topic} · Session {applySlotInfo.session} ·{" "}
                    {applySlotInfo.time}
                  </div>
                  <div className="bg-surface rounded-lg p-3.5 mb-4">
                    <div className="font-mono text-[11px] text-text3 mb-1">
                      Stake
                    </div>
                    <div className="font-display font-extrabold text-xl md:text-[22px] text-primary">
                      {applySlotInfo.stake} pts
                    </div>
                    <div className="font-mono text-[11px] text-text3 mt-1">
                      You lose this if you no-show after being approved.{" "}
                      {goal.name.split(" ")[0]} decides who gets the slot.
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                      Why should {goal.name.split(" ")[0]} pick you?
                    </label>
                    <textarea
                      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none resize-none"
                      rows={3}
                      placeholder="e.g. I've done 20 sessions on tree problems and can explain LCA both recursively and iteratively..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowApplyModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-[2]"
                      onClick={() => setShowApplyModal(false)}
                    >
                      Submit application
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-display font-extrabold text-lg md:text-[22px] mb-1">
                    Create an account to apply
                  </div>
                  <div className="text-xs md:text-sm text-text2 mb-5">
                    You need to be logged in to apply for a session slot. It
                    takes 30 seconds.
                  </div>
                  <div className="bg-surface rounded-lg p-3.5 mb-5">
                    <div className="font-mono text-[11px] text-text3 mb-1">
                      Slot you&apos;re applying for
                    </div>
                    <div className="text-sm font-semibold">
                      {applySlotInfo.topic}
                    </div>
                    <div className="font-mono text-[11px] text-text3 mt-1">
                      {applySlotInfo.time}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowApplyModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-[2]"
                      onClick={() => {
                        setShowApplyModal(false);
                        onNavigate("signup");
                      }}
                    >
                      Sign up to apply
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      {/* Guest Banner */}
      {!isLoggedIn && (
        <div className="bg-ink rounded-xl px-4 md:px-5 py-3 mb-5 md:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs md:text-[13px] text-white/60">
            You&apos;re browsing as a guest. Log in to apply to open slots or
            post your own goal.
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-black border-white/20 hover:bg-white/5 flex-1 sm:flex-none"
              onClick={() => onNavigate("login")}
            >
              Log in
            </Button>
            <Button
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => onNavigate("signup")}
            >
              Sign up free
            </Button>
          </div>
        </div>
      )}

      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">
        Browse
      </div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-5 md:mb-8">
        Open <span className="text-primary">goals</span>
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3 md:gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["All", "DSA", "System Design", "Behavioral"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "font-mono text-xs font-medium px-3 md:px-4 py-1.5 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all hover:border-primary hover:text-primary whitespace-nowrap",
                activeFilter === filter &&
                  "border-primary text-primary bg-[#fff5f2]",
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select className="flex-1 md:w-40 text-[13px] px-3 py-2 border border-border rounded-lg bg-card">
            <option>Trust: Any</option>
            <option>750+ (High)</option>
            <option>500–749</option>
          </select>
          <select className="flex-1 md:w-40 text-[13px] px-3 py-2 border border-border rounded-lg bg-card">
            <option>Open slots: Any</option>
            <option>Has open slots</option>
          </select>
        </div>
      </div>

      {/* Goal List */}
      <div className="flex flex-col gap-3 md:gap-3.5">
        {(Object.keys(goalData) as GoalKey[]).map((key) => {
          const goal = goalData[key];
          const isUrgent = goal.slots > 0;
          const trustLevel =
            goal.trust >= 750 ? "high" : goal.trust >= 500 ? "mid" : "low";
          const badgeType =
            key === "rahul"
              ? "DSA"
              : key === "neha"
                ? "System Design"
                : key === "aditya"
                  ? "Behavioral"
                  : "DSA";

          return (
            <div
              key={key}
              onClick={() => setSelectedGoal(key)}
              className={cn(
                "bg-card border border-border rounded-[20px] px-4 md:px-6 py-4 md:py-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5",
                isUrgent && "border-primary",
              )}
            >
              <div className="flex items-start sm:items-center justify-between mb-3 md:mb-4 gap-2">
                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${goal.cls} flex items-center justify-center font-display font-extrabold text-xs md:text-sm`}
                  >
                    {goal.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">
                      {goal.name}
                    </div>
                    <div className="font-mono text-[10px] md:text-[11px] text-text3">
                      Posted {goal.posted} · {goal.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <div
                    className={`flex items-center gap-1 md:gap-1.5 font-display font-extrabold text-lg md:text-[22px] trust-${trustLevel}`}
                  >
                    <div
                      className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${trustLevel === "high" ? "bg-green" : trustLevel === "mid" ? "bg-[#c17800]" : "bg-red"}`}
                    />
                    {goal.trust}
                  </div>
                  <span
                    className={`hidden sm:inline badge-${badgeType.toLowerCase().replace(" ", "")} text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full ${badgeType === "DSA" ? "badge-dsa" : badgeType === "System Design" ? "badge-design" : "badge-behavioral"}`}
                  >
                    {badgeType}
                  </span>
                </div>
              </div>
              <div className="font-display font-bold text-base md:text-[17px] mb-1.5 md:mb-2">
                {goal.title}
              </div>
              <div className="text-xs md:text-sm text-text2 mb-3 md:mb-4">
                {goal.desc}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <span className="sm:hidden badge-dsa text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">
                    {badgeType}
                  </span>
                  <span className="font-mono text-[10px] md:text-[11px] text-text3 px-2 py-0.5 border border-border/50 rounded">
                    {goal.done} / 100 reps done
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] md:text-[11px] px-2 py-0.5 border rounded",
                      goal.slots > 0
                        ? "text-primary border-primary/30"
                        : "text-text3 border-border/50",
                    )}
                  >
                    {goal.slots} open slots
                  </span>
                </div>
                <span className="font-mono text-xs text-text3">
                  View goal →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SessionsTab({
  goal,
  openApplyModal,
  onNavigate,
}: {
  goal: typeof goalData.rahul;
  openApplyModal: (
    topic: string,
    session: string,
    time: string,
    stake: string,
  ) => void;
  onNavigate: (screen: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">
          Roadmap
        </div>
        <span className="font-mono text-[10px] md:text-[11px] text-text3 hidden sm:inline">
          Click an open slot to apply
        </span>
      </div>

      {/* DSA Section */}
      <div className="flex items-center gap-2.5 py-1.5 mb-2 border-b border-border/50">
        <span className="font-mono text-[11px] font-medium text-blue">DSA</span>
        <div className="flex-1 h-0.5 bg-surface3 rounded overflow-hidden">
          <div className="h-full w-[62%] bg-blue rounded" />
        </div>
        <span className="font-mono text-[10px] md:text-[11px] text-text3">
          21 / 34 done
        </span>
      </div>
      <div className="flex flex-col gap-1.5 mb-4">
        <SessionCard
          done
          topic="Arrays — Two Pointer"
          subtitle="Mar 1 · Filled by Sana K"
          badge="DSA"
        />
        <SessionCard
          done
          topic="Arrays — Sliding Window"
          subtitle="Mar 3 · Filled by Meera K"
          badge="DSA"
        />
        <SessionCard
          live
          topic="Trees — BFS & DFS"
          subtitle="Session #35 · Slot filled"
          badge="DSA"
          onNavigate={onNavigate}
        />
        <SessionCard
          open
          topic="Trees — Lowest Common Ancestor"
          subtitle="Thu Mar 20 · 7:00 PM · 45 min"
          badge="DSA"
          time="Thu"
          onClick={() =>
            openApplyModal(
              "Trees — Lowest Common Ancestor",
              "#36",
              "Thu Mar 20 · 7:00 PM · 45 min",
              "150",
            )
          }
        />
        <SessionCard
          open
          topic="Graphs — BFS Shortest Path"
          subtitle="Fri Mar 21 · 6:00 PM · 60 min"
          badge="DSA"
          time="Fri"
          onClick={() =>
            openApplyModal(
              "Graphs — BFS Shortest Path",
              "#37",
              "Fri Mar 21 · 6:00 PM · 60 min",
              "120",
            )
          }
        />
      </div>

      {/* System Design Section */}
      <div className="flex items-center gap-2.5 py-1.5 mb-2 border-b border-border/50">
        <span className="font-mono text-[11px] font-medium text-[#6b34d6]">
          System Design
        </span>
        <div className="flex-1 h-0.5 bg-surface3 rounded overflow-hidden">
          <div className="h-full w-[30%] bg-[#6b34d6] rounded" />
        </div>
        <span className="font-mono text-[10px] md:text-[11px] text-text3">
          9 / 30 done
        </span>
      </div>
      <div className="flex flex-col gap-1.5 mb-4">
        <SessionCard
          done
          topic="Design a URL Shortener"
          subtitle="Mar 5 · Filled by Aditya M"
          badge="Design"
        />
        <SessionCard
          open
          topic="Design Twitter Feed"
          subtitle="Sat Mar 22 · 5:00 PM · 75 min"
          badge="Design"
          time="Sat"
          onClick={() =>
            openApplyModal(
              "Design Twitter Feed",
              "#11",
              "Sat Mar 22 · 5:00 PM · 75 min",
              "180",
            )
          }
        />
      </div>

      {/* Behavioral Section */}
      <div className="flex items-center gap-2.5 py-1.5 mb-2 border-b border-border/50">
        <span className="font-mono text-[11px] font-medium text-[#c17800]">
          Behavioral
        </span>
        <div className="flex-1 h-0.5 bg-surface3 rounded overflow-hidden">
          <div className="h-full w-[11%] bg-[#c17800] rounded" />
        </div>
        <span className="font-mono text-[10px] md:text-[11px] text-text3">
          4 / 36 done
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <SessionCard
          done
          topic="Leadership & Ownership stories"
          subtitle="Mar 8 · Filled by Sana K"
          badge="Behavioral"
        />
        <SessionCard
          open
          topic="Conflict Resolution — STAR method"
          subtitle="Tue Mar 25 · 7:00 PM · 30 min"
          badge="Behavioral"
          time="Tue"
          onClick={() =>
            openApplyModal(
              "Conflict Resolution — STAR method",
              "#06",
              "Tue Mar 25 · 7:00 PM · 30 min",
              "80",
            )
          }
        />
      </div>
    </div>
  );
}

function SessionCard({
  done,
  live,
  open,
  topic,
  subtitle,
  badge,
  time,
  onClick,
  onNavigate,
}: {
  done?: boolean;
  live?: boolean;
  open?: boolean;
  topic: string;
  subtitle: string;
  badge: string;
  time?: string;
  onClick?: () => void;
  onNavigate?: (screen: string) => void;
}) {
  const badgeClass =
    badge === "DSA"
      ? "badge-dsa"
      : badge === "Design"
        ? "badge-design"
        : "badge-behavioral";

  return (
    <div
      onClick={open ? onClick : undefined}
      className={cn(
        "bg-card border border-border rounded-xl px-3 md:px-5 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 transition-shadow",
        done && "opacity-50 cursor-default",
        live && "border-[1.5px] border-primary cursor-default",
        open &&
          "border-[1.5px] border-dashed border-primary bg-[#fff9f7] cursor-pointer hover:shadow-md",
      )}
    >
      <div
        className={cn(
          "font-mono text-xs sm:min-w-[60px]",
          done && "text-green",
          live && "text-foreground",
          open && "text-primary",
        )}
      >
        {done ? "✓" : live ? "Today" : time}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm">
          {topic}
          {live && (
            <span className="badge-green text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ml-1.5">
              Live
            </span>
          )}
        </div>
        <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
          {open ? (
            <>
              {subtitle} ·{" "}
              <span className="text-primary">
                Open — apply to fill this slot
              </span>
            </>
          ) : (
            subtitle
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        {open ? (
          <Button size="sm" className="w-full sm:w-auto">
            Apply
          </Button>
        ) : live ? (
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onNavigate?.("session")}
          >
            Join
          </Button>
        ) : (
          <span
            className={`${badgeClass} text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function PartnersTab() {
  const partners = [
    {
      initials: "SK",
      name: "Sana Khan",
      sessions: 3,
      topics: "Arrays, Leadership",
      badges: ["Arrays", "Leadership"],
      trust: 780,
      color: "av-green",
    },
    {
      initials: "MK",
      name: "Meera K",
      sessions: 2,
      topics: "Arrays, Strings",
      badges: ["Sliding Window"],
      trust: 612,
      color: "av-blue",
    },
    {
      initials: "AM",
      name: "Aditya Mehta",
      sessions: 3,
      topics: "System Design",
      badges: ["URL Shortener"],
      trust: 761,
      color: "av-orange",
    },
  ];

  return (
    <div>
      <div className="font-display font-bold text-base md:text-[17px] mb-4">
        Helpers so far
      </div>
      <div className="flex flex-col gap-2">
        {partners.map((p) => (
          <div
            key={p.name}
            className="bg-card border border-border rounded-xl p-3 md:p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${p.color} flex items-center justify-center font-display font-extrabold text-xs md:text-sm`}
              >
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                  {p.sessions} sessions · {p.topics}
                </div>
                <div className="flex flex-wrap gap-1 md:gap-1.5 mt-2">
                  {p.badges.map((b) => (
                    <span
                      key={b}
                      className="badge-dsa text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className={`flex items-center gap-1.5 font-display font-extrabold text-sm md:text-base ${p.trust >= 750 ? "trust-high" : "trust-mid"}`}
              >
                <div
                  className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${p.trust >= 750 ? "bg-green" : "bg-[#c17800]"}`}
                />
                {p.trust}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutTab({ goal }: { goal: typeof goalData.rahul }) {
  return (
    <div>
      <div className="font-display font-bold text-base md:text-[17px] mb-4">
        About {goal.name.split(" ")[0]}
      </div>
      <div className="bg-card border border-border rounded-[20px] p-4 md:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-12 md:w-14 h-12 md:h-14 rounded-full ${goal.cls} flex items-center justify-center font-display font-extrabold text-base md:text-lg`}
            >
              {goal.avatar}
            </div>
            <div>
              <div className="font-display font-bold text-base md:text-lg">
                {goal.name}
              </div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                {goal.location} · 5 YOE · Targeting Google L5
              </div>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 font-display font-extrabold text-xl md:text-[22px] trust-high sm:ml-auto`}
          >
            <div className="w-2 h-2 rounded-full bg-green" />
            {goal.trust}
          </div>
        </div>
        <div className="h-px bg-border my-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
          <div>
            <div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">
              {goal.done}
            </div>
            <div className="font-mono text-[10px] md:text-xs text-text3">
              sessions done
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">
              100%
            </div>
            <div className="font-mono text-[10px] md:text-xs text-text3">
              show-up
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">
              4.8
            </div>
            <div className="font-mono text-[10px] md:text-xs text-text3">
              avg rating
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">
              {goal.helpers}
            </div>
            <div className="font-mono text-[10px] md:text-xs text-text3">
              helpers
            </div>
          </div>
        </div>
      </div>
      <div className="bg-surface rounded-[20px] p-4 md:p-5">
        <div className="font-mono text-[11px] text-text3 mb-2">
          Why this goal
        </div>
        <div className="text-xs md:text-sm text-text2">
          &quot;{goal.desc}&quot;
        </div>
      </div>
    </div>
  );
}
