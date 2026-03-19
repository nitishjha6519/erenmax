"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Goal, GoalDetail, GoalSession } from "@/lib/api";

interface FeedScreenProps {
  onNavigate: (screen: string) => void;
}

const AVATAR_COLORS = [
  "av-purple",
  "av-green",
  "av-orange",
  "av-blue",
] as const;
function avatarColor(id?: string) {
  return AVATAR_COLORS[((id ?? "").charCodeAt(0) || 0) % AVATAR_COLORS.length];
}
function getInitials(name?: string) {
  return (
    (name || "?")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}
function timeAgo(d: string): string {
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
function formatDateTime(d: string) {
  const dt = new Date(d);
  return (
    dt.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }) +
    " · " +
    dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}
const CAT_LABEL: Record<string, string> = {
  dsa: "DSA",
  systemdesign: "System Design",
  behavioral: "Behavioral",
};
function catLabel(c?: string) {
  const k = (c ?? "").toLowerCase().replace(/\s/g, "");
  return CAT_LABEL[k] ?? (c || "");
}
function catBadgeClass(c?: string) {
  const k = (c ?? "").toLowerCase().replace(/\s/g, "");
  return k === "dsa"
    ? "badge-dsa"
    : k === "systemdesign"
      ? "badge-design"
      : "badge-behavioral";
}
function filterToCategory(f: string) {
  return (
    {
      DSA: "dsa",
      "System Design": "systemdesign",
      Behavioral: "behavioral",
    } as Record<string, string>
  )[f];
}

export function FeedScreen({ onNavigate }: FeedScreenProps) {
  const { isLoggedIn } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalDetail | null>(null);
  const [goalLoading, setGoalLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("sessions");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySlotInfo, setApplySlotInfo] = useState({
    sessionId: "",
    topic: "",
    time: "",
    stake: "",
  });
  const [applyMessage, setApplyMessage] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    setGoalsLoading(true);
    api.goals
      .browse({
        status: "open",
        category: filterToCategory(activeFilter),
        limit: 20,
      })
      .then((d) => setGoals(d.goals))
      .catch(console.error)
      .finally(() => setGoalsLoading(false));
  }, [activeFilter]);

  useEffect(() => {
    if (!selectedGoalId) {
      setSelectedGoal(null);
      return;
    }
    setGoalLoading(true);
    api.goals
      .get(selectedGoalId)
      .then((d) => setSelectedGoal(d.goal))
      .catch(console.error)
      .finally(() => setGoalLoading(false));
  }, [selectedGoalId]);

  const openApplyModal = (
    sessionId: string,
    topic: string,
    time: string,
    stake: string,
  ) => {
    setApplySlotInfo({ sessionId, topic, time, stake });
    setApplyMessage("");
    setApplyError("");
    setShowApplyModal(true);
  };
  const handleApply = async () => {
    if (!applySlotInfo.sessionId) return;
    setApplyLoading(true);
    setApplyError("");
    try {
      await api.applications.apply(applySlotInfo.sessionId, {
        message: applyMessage,
        stakedPoints: Number(applySlotInfo.stake) || 0,
      });
      setShowApplyModal(false);
    } catch (e) {
      setApplyError(e instanceof Error ? e.message : "Failed to apply");
    } finally {
      setApplyLoading(false);
    }
  };

  if (selectedGoalId) {
    if (goalLoading || !selectedGoal)
      return (
        <div className="animate-fade-up">
          <Button
            variant="outline"
            size="sm"
            className="mb-4 md:mb-5"
            onClick={() => setSelectedGoalId(null)}
          >
            ← Back to browse
          </Button>
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-[20px] p-6 animate-pulse"
              >
                <div className="h-4 w-3/4 bg-surface3 rounded mb-3" />
                <div className="h-3 w-full bg-surface3 rounded" />
              </div>
            ))}
          </div>
        </div>
      );

    const goal = selectedGoal,
      goalOwner = goal.user ?? goal.owner,
      oInit = getInitials(goalOwner?.name),
      oColor = avatarColor(goalOwner?.id);
    const trustLvl =
      (goalOwner?.trustScore ?? 0) >= 750
        ? "high"
        : (goalOwner?.trustScore ?? 0) >= 500
          ? "mid"
          : "low";
    return (
      <div className="animate-fade-up">
        <Button
          variant="outline"
          size="sm"
          className="mb-4 md:mb-5"
          onClick={() => setSelectedGoalId(null)}
        >
          ← Back to browse
        </Button>
        <div className="bg-ink rounded-[20px] px-5 md:px-10 py-6 md:py-9 mb-5 md:mb-6 relative overflow-hidden">
          <div className="absolute right-4 md:right-8 -top-2.5 font-display text-[80px] md:text-[120px] font-extrabold text-white/5 leading-none tracking-tight pointer-events-none">
            100
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 md:w-14 h-12 md:h-14 rounded-full ${oColor} flex items-center justify-center font-display font-extrabold text-base md:text-lg`}
              >
                {oInit}
              </div>
              <div>
                <div className="font-display text-[13px] font-bold text-white">
                  {goalOwner?.name ?? "Unknown"}
                </div>
                <div className="text-xs text-white/40 mt-0.5">
                  {[
                    goalOwner?.location,
                    goalOwner?.yoe ? `${goalOwner.yoe} YOE` : null,
                    `★ ${goalOwner?.trustScore ?? 0} trust`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
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
            {goal.description}
          </div>
          <div className="grid grid-cols-2 sm:flex gap-4 md:gap-8 relative z-10">
            {[
              { v: goal.repsDone ?? 0, l: "reps done" },
              {
                v: (goal.repsTotal ?? 100) - (goal.repsDone ?? 0),
                l: "remaining",
              },
              {
                v: goal.openSlotCount ?? goal.openSlotsCount ?? 0,
                l: "open slots",
                a: true,
              },
              { v: goal.helpersCount ?? 0, l: "helpers so far" },
            ].map(({ v, l, a }) => (
              <div key={l}>
                <div
                  className={`font-display font-extrabold text-2xl md:text-[32px] tracking-tight ${a ? "text-primary" : "text-white"}`}
                >
                  {v}
                </div>
                <div className="font-mono text-[10px] md:text-xs text-white/40">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
        {!isLoggedIn && (
          <div className="bg-card border-[1.5px] border-primary rounded-[20px] px-4 md:px-6 py-4 md:py-5 mb-5 md:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="font-display font-bold text-sm md:text-[15px] mb-1">
                Want to help with an open slot?
              </div>
              <div className="text-xs md:text-sm text-text2">
                Log in or sign up to apply. It takes 30 seconds.
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
          <div>
            {activeTab === "sessions" && (
              <SessionsTab
                goal={goal}
                openApplyModal={openApplyModal}
                onNavigate={onNavigate}
              />
            )}
            {activeTab === "partners" && <PartnersTab goal={goal} />}
            {activeTab === "about" && <AboutTab goal={goal} />}
          </div>
        </div>
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
                    {applySlotInfo.topic} · {applySlotInfo.time}
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
                      {(goalOwner?.name ?? "the owner").split(" ")[0]} decides
                      who gets the slot.
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                      Why should{" "}
                      {(goalOwner?.name ?? "the owner").split(" ")[0]} pick you?
                    </label>
                    <textarea
                      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none resize-none"
                      rows={3}
                      placeholder="e.g. I've done 20 sessions on tree problems..."
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                    />
                  </div>
                  {applyError && (
                    <p className="text-[13px] text-red mb-3">{applyError}</p>
                  )}
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
                      onClick={handleApply}
                      disabled={applyLoading}
                    >
                      {applyLoading ? "Submitting…" : "Submit application"}
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3 md:gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["All", "DSA", "System Design", "Behavioral"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "font-mono text-xs font-medium px-3 md:px-4 py-1.5 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all hover:border-primary hover:text-primary whitespace-nowrap",
                activeFilter === f &&
                  "border-primary text-primary bg-[#fff5f2]",
              )}
            >
              {f}
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
      {goalsLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-[20px] px-4 md:px-6 py-4 md:py-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-surface3" />
                <div className="flex-1">
                  <div className="h-3.5 w-32 bg-surface3 rounded mb-1.5" />
                  <div className="h-2.5 w-48 bg-surface3 rounded" />
                </div>
              </div>
              <div className="h-4 w-3/4 bg-surface3 rounded mb-2" />
              <div className="h-3 w-full bg-surface3 rounded" />
            </div>
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 text-text3">
          <div className="text-3xl mb-3">◌</div>
          <div className="font-mono text-sm">
            No open goals right now. Check back soon.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:gap-3.5">
          {goals.map((goal) => {
            const gOwner = goal.user ?? goal.owner;
            const oInit = getInitials(gOwner?.name),
              oColor = avatarColor(gOwner?.id),
              hasSlots = (goal.openSlotCount ?? goal.openSlotsCount ?? 0) > 0;
            const tl =
              (gOwner?.trustScore ?? 0) >= 750
                ? "high"
                : (gOwner?.trustScore ?? 0) >= 500
                  ? "mid"
                  : "low";
            const cl = catLabel(goal.category),
              bc = catBadgeClass(goal.category);
            return (
              <div
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={cn(
                  "bg-card border border-border rounded-[20px] px-4 md:px-6 py-4 md:py-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5",
                  hasSlots && "border-primary",
                )}
              >
                <div className="flex items-start sm:items-center justify-between mb-3 md:mb-4 gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div
                      className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${oColor} flex items-center justify-center font-display font-extrabold text-xs md:text-sm`}
                    >
                      {oInit}
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base">
                        {gOwner?.name ?? "Unknown"}
                      </div>
                      <div className="font-mono text-[10px] md:text-[11px] text-text3">
                        Posted {timeAgo(goal.createdAt)}
                        {gOwner?.location ? ` · ${gOwner.location}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <div
                      className={`flex items-center gap-1 md:gap-1.5 font-display font-extrabold text-lg md:text-[22px] trust-${tl}`}
                    >
                      <div
                        className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${tl === "high" ? "bg-green" : tl === "mid" ? "bg-[#c17800]" : "bg-red"}`}
                      />
                      {gOwner?.trustScore ?? 0}
                    </div>
                    <span
                      className={`hidden sm:inline ${bc} text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full`}
                    >
                      {cl}
                    </span>
                  </div>
                </div>
                <div className="font-display font-bold text-base md:text-[17px] mb-1.5 md:mb-2">
                  {goal.title}
                </div>
                <div className="text-xs md:text-sm text-text2 mb-3 md:mb-4">
                  {goal.description}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    <span
                      className={`sm:hidden ${bc} text-[10px] font-mono font-medium px-2 py-0.5 rounded-full`}
                    >
                      {cl}
                    </span>
                    <span className="font-mono text-[10px] md:text-[11px] text-text3 px-2 py-0.5 border border-border/50 rounded">
                      {goal.repsDone ?? 0} / 100 reps done
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[10px] md:text-[11px] px-2 py-0.5 border rounded",
                        hasSlots
                          ? "text-primary border-primary/30"
                          : "text-text3 border-border/50",
                      )}
                    >
                      {goal.openSlotCount ?? goal.openSlotsCount ?? 0} open
                      slots
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
      )}
    </div>
  );
}

function SessionsTab({
  goal,
  openApplyModal,
  onNavigate,
}: {
  goal: GoalDetail;
  openApplyModal: (
    sessionId: string,
    t: string,
    time: string,
    stake: string,
  ) => void;
  onNavigate: (s: string) => void;
}) {
  const sessions = goal.sessions ?? [];
  const grouped: Record<string, GoalSession[]> = {};
  for (const s of sessions) {
    const c = (s.category || goal.category).toLowerCase().replace(/\s/g, "");
    if (!grouped[c]) grouped[c] = [];
    grouped[c].push(s);
  }
  if (sessions.length === 0)
    return (
      <div>
        <div className="font-display font-bold text-base md:text-[17px] mb-4">
          Roadmap
        </div>
        <p className="text-sm text-text3">No sessions have been added yet.</p>
      </div>
    );
  const accents: Record<string, { text: string; bar: string }> = {
    dsa: { text: "text-blue", bar: "bg-blue" },
    systemdesign: { text: "text-[#6b34d6]", bar: "bg-[#6b34d6]" },
    behavioral: { text: "text-[#c17800]", bar: "bg-[#c17800]" },
  };
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
      {Object.entries(grouped).map(([cat, catSessions]) => {
        const label = catLabel(cat),
          done = catSessions.filter((s) => s.status === "completed").length,
          pct =
            catSessions.length > 0
              ? Math.round((done / catSessions.length) * 100)
              : 0;
        const style = accents[cat] ?? { text: "text-text2", bar: "bg-primary" };
        return (
          <div key={cat} className="mb-4">
            <div className="flex items-center gap-2.5 py-1.5 mb-2 border-b border-border/50">
              <span
                className={`font-mono text-[11px] font-medium ${style.text}`}
              >
                {label}
              </span>
              <div className="flex-1 h-0.5 bg-surface3 rounded overflow-hidden">
                <div
                  className={`h-full ${style.bar} rounded`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-mono text-[10px] md:text-[11px] text-text3">
                {done} / {catSessions.length} done
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {catSessions.map((s) => {
                const isComp = s.status === "completed",
                  isLive = s.status === "live",
                  isOpen = s.status === "open";
                const scheduled = s.scheduledAt ?? s.scheduledDate;
                const dt = scheduled ? formatDateTime(scheduled) : "";
                const dayLbl = scheduled
                  ? new Date(scheduled).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  : "";
                const helper = s.approvedHelper ?? s.partner;
                return (
                  <FeedSessionCard
                    key={s.id}
                    done={isComp}
                    live={isLive}
                    open={isOpen}
                    topic={s.topic}
                    subtitle={
                      isComp && helper
                        ? `${formatDate(scheduled ?? "")} · Filled by ${helper.name}`
                        : isLive && helper
                          ? `Slot filled · ${helper.name}`
                          : dt
                    }
                    badge={catLabel(s.category || cat)}
                    time={dayLbl}
                    sessionId={s.id}
                    onClick={
                      isOpen
                        ? () =>
                            openApplyModal(
                              s.id,
                              s.topic,
                              dt,
                              String(goal.pledgedPoints ?? 100),
                            )
                        : undefined
                    }
                    onNavigate={isLive ? onNavigate : undefined}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FeedSessionCard({
  done,
  live,
  open,
  topic,
  subtitle,
  badge,
  time,
  sessionId,
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
  sessionId?: string;
  onClick?: () => void;
  onNavigate?: (s: string) => void;
}) {
  const bc = catBadgeClass(badge);
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
            onClick={() =>
              onNavigate?.(sessionId ? `session:${sessionId}` : "session")
            }
          >
            Join
          </Button>
        ) : (
          <span
            className={`${bc} text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function PartnersTab({ goal }: { goal: GoalDetail }) {
  const helpers = (goal.sessions ?? [])
    .filter((s) => s.status === "completed" && (s.approvedHelper ?? s.partner))
    .map((s) => s.approvedHelper ?? s.partner!);
  const unique = helpers.filter(
    (p, i, a) => a.findIndex((x) => x.id === p.id) === i,
  );
  return (
    <div>
      <div className="font-display font-bold text-base md:text-[17px] mb-4">
        Helpers so far
      </div>
      {unique.length === 0 ? (
        <p className="text-sm text-text3">
          No helpers yet — be the first to apply!
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {unique.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-xl p-3 md:p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${avatarColor(p.id)} flex items-center justify-center font-display font-extrabold text-xs md:text-sm`}
                >
                  {getInitials(p.name)}
                </div>
                <div className="text-sm font-semibold">{p.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AboutTab({ goal }: { goal: GoalDetail }) {
  const owner = goal.user ?? goal.owner;
  const oInit = getInitials(owner?.name),
    oColor = avatarColor(owner?.id);
  return (
    <div>
      <div className="font-display font-bold text-base md:text-[17px] mb-4">
        About {(owner?.name ?? "the owner").split(" ")[0]}
      </div>
      <div className="bg-card border border-border rounded-[20px] p-4 md:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-12 md:w-14 h-12 md:h-14 rounded-full ${oColor} flex items-center justify-center font-display font-extrabold text-base md:text-lg`}
            >
              {oInit}
            </div>
            <div>
              <div className="font-display font-bold text-base md:text-lg">
                {owner?.name ?? "Unknown"}
              </div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                {[owner?.location, owner?.yoe ? `${owner.yoe} YOE` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-display font-extrabold text-xl md:text-[22px] trust-high sm:ml-auto">
            <div className="w-2 h-2 rounded-full bg-green" />
            {owner?.trustScore ?? 0}
          </div>
        </div>
        {owner?.bio && (
          <>
            <div className="h-px bg-border my-4" />
            <p className="text-sm text-text2">{owner.bio}</p>
          </>
        )}
        <div className="h-px bg-border my-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
          {[
            { v: goal.repsDone ?? 0, l: "sessions done" },
            { v: goal.helpersCount ?? 0, l: "helpers" },
            {
              v: goal.openSlotCount ?? goal.openSlotsCount ?? 0,
              l: "open slots",
              a: true,
            },
            { v: goal.repsTotal ?? 100, l: "total reps" },
          ].map(({ v, l, a }) => (
            <div key={l}>
              <div
                className={`font-display font-extrabold text-xl md:text-[28px] tracking-tight ${a ? "text-primary" : "text-ink"}`}
              >
                {v}
              </div>
              <div className="font-mono text-[10px] md:text-xs text-text3">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
