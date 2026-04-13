"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type {
  Goal,
  GoalDetail,
  GoalSession,
  Session,
  Partner,
  UserStats,
  Application,
  TrustHistoryEntry,
} from "@/lib/api";

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
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
function avatarColors(id?: string) {
  return (["av-purple", "av-green", "av-orange", "av-blue"] as const)[
    ((id ?? "").charCodeAt(0) || 0) % 4
  ];
}
function formatRelDate(d: string) {
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}
function formatScheduled(d: string) {
  const dt = new Date(d);
  const now = new Date();
  const isToday = dt.toDateString() === now.toDateString();
  if (isToday)
    return `Today · ${dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  return (
    dt.toLocaleDateString("en-US", { weekday: "short" }) +
    " · " +
    dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}
function catBadgeClass(c?: string) {
  const k = (c ?? "").toLowerCase().replace(/\s/g, "");
  return k === "dsa"
    ? "badge-dsa"
    : k === "systemdesign"
      ? "badge-design"
      : "badge-behavioral";
}
function catLabel(c?: string) {
  return (
    (
      {
        dsa: "DSA",
        systemdesign: "System Design",
        behavioral: "Behavioral",
      } as Record<string, string>
    )[(c ?? "").toLowerCase().replace(/\s/g, "")] ??
    (c || "")
  );
}
function expiresIn(deadline?: string): string {
  if (!deadline) return "";
  const h = Math.ceil((new Date(deadline).getTime() - Date.now()) / 3600000);
  if (h <= 0) return "expired";
  if (h < 24) return `${h}h`;
  return `${Math.ceil(h / 24)}d`;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [addTopicCategory, setAddTopicCategory] = useState("DSA");
  const [addTopicTopic, setAddTopicTopic] = useState("");
  const [addTopicDate, setAddTopicDate] = useState("");
  const [addTopicDuration, setAddTopicDuration] = useState("60");
  const [addTopicMeetingLink, setAddTopicMeetingLink] = useState("");
  const [addTopicStakedPoints, setAddTopicStakedPoints] = useState("100");
  const [addTopicLoading, setAddTopicLoading] = useState(false);
  const [addTopicError, setAddTopicError] = useState("");
  const [cancelGoalId, setCancelGoalId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [stats, setStats] = useState<UserStats | null>(null);
  const [myGoals, setMyGoals] = useState<Goal[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    api.users
      .getMyStats()
      .then((s) =>
        setStats({
          ...s.stats,
          scoreBreakdown: s.scoreBreakdown ?? s.stats.scoreBreakdown,
        }),
      )
      .catch(console.error);
    api.goals
      .myGoals({ status: "all" })
      .then((g) => setMyGoals(g.goals))
      .catch(console.error)
      .finally(() => setDataLoading(false));
    api.sessions
      .getUpcoming({ limit: 5 })
      .then((s) => setUpcomingSessions(s.sessions))
      .catch(console.error);
  }, []);

  const myActiveGoals = myGoals.filter(
    (g) => !["completed", "cancelled"].includes(g.status),
  );
  const activeGoal = myActiveGoals[0] ?? null;
  const selectedGoal =
    myActiveGoals.find((g) => g.id === selectedGoalId) ?? activeGoal;
  const trustScore = stats?.trustScore ?? user?.trustScore ?? 500;
  const repsDone =
    stats?.sessionsCompleted ?? stats?.repsDone ?? activeGoal?.repsDone ?? 0;
  const repsLeft = (activeGoal?.repsTotal ?? 100) - repsDone;
  const streak = stats?.currentStreak ?? 0;

  const handleAddTopic = async () => {
    if (!selectedGoal?.id || !addTopicTopic.trim() || !addTopicDate) return;
    if (!addTopicMeetingLink.trim()) {
      setAddTopicError("Meeting link is required.");
      return;
    }
    const pts = parseInt(addTopicStakedPoints, 10);
    if (!pts || pts < 1) {
      setAddTopicError("Staked points must be at least 1.");
      return;
    }
    // Validate session date is within goal's start/end date range
    const sessionMs = new Date(addTopicDate).getTime();
    if (selectedGoal.startDate) {
      const goalStart = new Date(selectedGoal.startDate);
      goalStart.setHours(0, 0, 0, 0);
      if (sessionMs < goalStart.getTime()) {
        setAddTopicError(
          `Session date cannot be before the goal's start date (${goalStart.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}).`,
        );
        return;
      }
    }
    if (selectedGoal.endDate) {
      const goalEnd = new Date(selectedGoal.endDate);
      goalEnd.setHours(23, 59, 59, 999);
      if (sessionMs > goalEnd.getTime()) {
        setAddTopicError(
          `Session date cannot be after the goal's end date (${new Date(selectedGoal.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}).`,
        );
        return;
      }
    }
    setAddTopicLoading(true);
    setAddTopicError("");
    try {
      await api.goals.addSession(selectedGoal.id, {
        topic: addTopicTopic.trim(),
        category: addTopicCategory,
        scheduledDate: new Date(addTopicDate).toISOString(),
        durationMins: parseInt(addTopicDuration),
        meetingLink: addTopicMeetingLink.trim(),
        stakedPoints: pts,
      });
      setShowAddTopicModal(false);
      setAddTopicTopic("");
      setAddTopicDate("");
      setAddTopicMeetingLink("");
      setAddTopicStakedPoints("100");
    } catch (e) {
      setAddTopicError(
        e instanceof Error ? e.message : "Failed to post topic. Try again.",
      );
    } finally {
      setAddTopicLoading(false);
    }
  };

  const handleCancelGoal = async () => {
    if (!cancelGoalId) return;
    setCancelLoading(true);
    setCancelError("");
    try {
      await api.goals.cancel(cancelGoalId);
      setMyGoals((prev) =>
        prev.map((g) =>
          g.id === cancelGoalId ? { ...g, status: "cancelled" } : g,
        ),
      );
      setCancelGoalId(null);
    } catch (e) {
      setCancelError(
        e instanceof Error ? e.message : "Failed to cancel goal. Try again.",
      );
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <div className="bg-ink rounded-[20px] px-5 md:px-10 py-6 md:py-9 mb-5 md:mb-6 relative overflow-hidden">
        <div className="absolute right-4 md:right-8 -top-2.5 font-display text-[80px] md:text-[120px] font-extrabold text-white/5 leading-none tracking-tight pointer-events-none">
          100
        </div>
        <div className="font-display font-extrabold text-xl md:text-[28px] text-white tracking-tight mb-1 relative z-10">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"}
        </div>
        <div className="text-xs md:text-sm text-white/50 mb-4 md:mb-6 relative z-10">
          {activeGoal
            ? `You're ${repsDone} reps into your goal. Keep the streak alive.`
            : "Start by posting your first goal."}
        </div>
        <div className="grid grid-cols-2 sm:flex gap-4 md:gap-8 relative z-10">
          {[
            { v: repsDone, l: "reps done" },
            { v: repsLeft, l: "reps to go" },
            { v: trustScore, l: "trust score" },
            { v: streak, l: "day streak" },
          ].map(({ v, l }) => (
            <div key={l}>
              <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">
                {v}
              </div>
              <div className="font-mono text-[10px] md:text-xs text-white/40">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="flex md:hidden gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { key: "overview", label: "Overview" },
          { key: "sessions", label: "Sessions" },
          { key: "partners", label: "Partners" },
          { key: "score", label: "Trust" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap",
              activeTab === tab.key
                ? "bg-ink text-white"
                : "bg-surface text-text2",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-5 md:gap-6">
        {/* Sidebar */}
        <div className="hidden md:block">
          <div className="bg-ink rounded-[20px] p-4 sticky top-24">
            {[
              { key: "overview", icon: "◼", label: "Overview" },
              { key: "sessions", icon: "◷", label: "Sessions" },
              { key: "partners", icon: "◎", label: "My Partners" },
              { key: "score", icon: "▲", label: "Trust Score" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/55 text-sm font-medium cursor-pointer transition-all hover:text-white hover:bg-white/5 mb-0.5",
                  activeTab === tab.key && "text-white bg-white/10",
                )}
              >
                <span className="text-base w-5 text-center">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <div className="h-px bg-white/10 my-3" />
            <Button
              className="w-full"
              size="sm"
              onClick={() => onNavigate("post")}
            >
              + Post new goal
            </Button>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === "overview" && (
            <OverviewTab
              onNavigate={onNavigate}
              onViewRoadmap={(id) => {
                setSelectedGoalId(id);
                setActiveTab("sessions");
              }}
              onCancelGoal={(id) => setCancelGoalId(id)}
              myActiveGoals={myActiveGoals}
              upcomingSessions={upcomingSessions}
              stats={stats}
              loading={dataLoading}
            />
          )}
          {activeTab === "sessions" && (
            <SessionsTab
              onNavigate={onNavigate}
              setShowAddTopicModal={(open) => {
                if (open) setSelectedGoalId(selectedGoal?.id ?? null);
                setShowAddTopicModal(open);
              }}
              setActiveTab={setActiveTab}
              activeGoal={selectedGoal}
              loading={dataLoading}
            />
          )}
          {activeTab === "partners" && <PartnersTab />}
          {activeTab === "score" && (
            <TrustScoreTab stats={stats} activeGoalId={activeGoal?.id} />
          )}
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setShowAddTopicModal(false)}
        >
          <div
            className="bg-card rounded-t-[20px] md:rounded-[20px] p-6 md:p-8 w-full md:w-[480px] md:max-w-[90vw] animate-fade-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-display font-extrabold text-lg md:text-[22px] mb-1">
              Add a topic
            </div>
            <div className="text-xs md:text-sm text-text2 mb-5 md:mb-6">
              Creates an open slot. The community sees it and applies to help
              you.
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {["DSA", "System Design", "Behavioral"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAddTopicCategory(type)}
                    className={cn(
                      "font-mono text-xs font-medium px-4 py-1.5 rounded-full border-[1.5px] cursor-pointer transition-colors",
                      addTopicCategory === type
                        ? "border-primary text-primary bg-[#fff5f2]"
                        : "border-border text-text2",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                Topic
              </label>
              <input
                value={addTopicTopic}
                onChange={(e) => setAddTopicTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none"
                placeholder="e.g. Dynamic Programming — Knapsack"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                  Date & time
                </label>
                <input
                  type="datetime-local"
                  value={addTopicDate}
                  min={
                    selectedGoal?.startDate
                      ? selectedGoal.startDate.slice(0, 16)
                      : undefined
                  }
                  max={
                    selectedGoal?.endDate
                      ? selectedGoal.endDate.slice(0, 16)
                      : undefined
                  }
                  onChange={(e) => {
                    setAddTopicDate(e.target.value);
                    setAddTopicError("");
                  }}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none"
                />
                {(selectedGoal?.startDate || selectedGoal?.endDate) && (
                  <p className="font-mono text-[10px] text-text3 mt-1">
                    Must be within goal range
                    {selectedGoal.startDate &&
                      ` from ${new Date(selectedGoal.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                    {selectedGoal.endDate &&
                      ` to ${new Date(selectedGoal.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                    .
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                  Duration
                </label>
                <select
                  value={addTopicDuration}
                  onChange={(e) => setAddTopicDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none cursor-pointer"
                >
                  <option value="30">30 mins</option>
                  <option value="45">45 mins</option>
                  <option value="60">60 mins</option>
                  <option value="90">90 mins</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                Meeting link <span className="text-red">*</span>
              </label>
              <input
                value={addTopicMeetingLink}
                onChange={(e) => {
                  setAddTopicMeetingLink(e.target.value);
                  setAddTopicError("");
                }}
                className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none"
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                Staked points
              </label>
              <div className="font-mono text-[10px] text-text3 mb-1.5">
                Points the helper must stake. Deducted automatically on no-show.
              </div>
              <div className="flex gap-2 flex-wrap">
                {["50", "100", "200", "500"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setAddTopicStakedPoints(p)}
                    className={cn(
                      "font-mono text-xs font-medium px-4 py-1.5 rounded-full border-[1.5px] cursor-pointer transition-colors",
                      addTopicStakedPoints === p
                        ? "border-primary text-primary bg-[#fff5f2]"
                        : "border-border text-text2",
                    )}
                  >
                    {p} pts
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  value={addTopicStakedPoints}
                  onChange={(e) => setAddTopicStakedPoints(e.target.value)}
                  className="w-24 px-3 py-1.5 border-[1.5px] border-border rounded-full text-xs font-mono bg-card focus:border-primary outline-none"
                  placeholder="Custom"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddTopicModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-[2]"
                disabled={
                  addTopicLoading ||
                  !addTopicTopic.trim() ||
                  !addTopicDate ||
                  !addTopicMeetingLink.trim() ||
                  !selectedGoal?.id
                }
                onClick={handleAddTopic}
              >
                {addTopicLoading ? "Posting…" : "Post to community"}
              </Button>
            </div>
            {!selectedGoal?.id && (
              <p className="font-mono text-[11px] text-red mt-2">
                No active goal found. Create a goal first, then add topics to
                it.
              </p>
            )}
            {addTopicError && (
              <p className="font-mono text-[11px] text-red mt-2">
                {addTopicError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Cancel Goal Confirmation Modal */}
      {cancelGoalId && (
        <div
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            if (!cancelLoading) {
              setCancelGoalId(null);
              setCancelError("");
            }
          }}
        >
          <div
            className="bg-card rounded-[20px] p-6 md:p-8 w-full md:w-[440px] md:max-w-[90vw] animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-display font-extrabold text-lg md:text-[22px] mb-2">
              Cancel goal?
            </div>
            <div className="font-mono text-sm text-text2 mb-6">
              This will permanently cancel your active goal. You&apos;ll be able
              to post a new goal once it&apos;s cancelled. This action cannot be
              undone.
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={cancelLoading}
                onClick={() => {
                  setCancelGoalId(null);
                  setCancelError("");
                }}
              >
                Keep goal
              </Button>
              <Button
                className="flex-[2] bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-white"
                disabled={cancelLoading}
                onClick={handleCancelGoal}
              >
                {cancelLoading ? "Cancelling…" : "Yes, cancel goal"}
              </Button>
            </div>
            {cancelError && (
              <p className="font-mono text-[11px] text-red mt-2">
                {cancelError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({
  onNavigate,
  onViewRoadmap,
  onCancelGoal,
  myActiveGoals,
  upcomingSessions,
  stats,
  loading,
}: {
  onNavigate: (s: string) => void;
  onViewRoadmap: (id: string) => void;
  onCancelGoal: (id: string) => void;
  myActiveGoals: Goal[];
  upcomingSessions: Session[];
  stats: UserStats | null;
  loading: boolean;
}) {
  if (loading)
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-[20px] p-6 animate-pulse"
          >
            <div className="h-4 w-3/4 bg-surface3 rounded mb-3" />
            <div className="h-3 w-full bg-surface3 rounded" />
          </div>
        ))}
      </div>
    );

  const firstGoal = myActiveGoals[0] ?? null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">
          {myActiveGoals.length > 1 ? "Active goals" : "Active goal"}
        </div>
      </div>
      {myActiveGoals.length > 0 ? (
        <div className="flex flex-col gap-4 mb-4">
          {myActiveGoals.map((goal) => {
            const gRepsDone = goal.repsDone ?? 0;
            const gRepsTotal = goal.repsTotal ?? 100;
            const gPct = Math.round((gRepsDone / gRepsTotal) * 100);
            return (
              <div
                key={goal.id}
                className="bg-card border border-border rounded-[20px] p-4 md:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="font-display font-bold text-base md:text-[17px]">
                      {goal.title}
                    </div>
                    <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                      {catLabel(goal.category)}
                    </div>
                  </div>
                  <span className="badge-green text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full self-start">
                    Active
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5 mb-4">
                  <div
                    className="w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center relative flex-shrink-0 mx-auto sm:mx-0"
                    style={{
                      background: `conic-gradient(var(--accent) ${gPct}%, var(--surface3) 0)`,
                    }}
                  >
                    <div className="absolute w-12 md:w-16 h-12 md:h-16 rounded-full bg-card" />
                    <span className="font-display font-extrabold text-sm md:text-base z-10">
                      {gRepsDone}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-[10px] md:text-[11px] text-text3">
                        Progress to {gRepsTotal} reps
                      </span>
                      <span className="font-mono text-[10px] md:text-[11px] text-text3">
                        {gPct}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${gPct}%` }}
                      />
                    </div>
                    <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-2">
                      {gRepsTotal - gRepsDone} reps remaining
                    </div>
                  </div>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      onNavigate(
                        upcomingSessions[0]?.id
                          ? `session:${upcomingSessions[0].id}`
                          : "session",
                      )
                    }
                  >
                    Start today&apos;s session
                  </Button> */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => onViewRoadmap(goal.id)}
                  >
                    View roadmap
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                    onClick={() => onCancelGoal(goal.id)}
                  >
                    Cancel goal
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-[20px] p-6 mb-4 text-center">
          <div className="text-2xl mb-2">◌</div>
          <div className="font-mono text-sm text-text3 mb-4">
            No active goal yet. Post your first goal to get started.
          </div>
          <Button size="sm" onClick={() => onNavigate("post")}>
            + Post a goal
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">
          Upcoming sessions
        </div>
        {firstGoal && (
          <button
            className="font-mono text-xs text-primary cursor-pointer"
            onClick={() => onViewRoadmap(firstGoal.id)}
          >
            View all
          </button>
        )}
      </div>
      {upcomingSessions.length === 0 ? (
        <p className="text-sm text-text3 mb-6">No upcoming sessions.</p>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {upcomingSessions.slice(0, 3).map((s) => (
            <div
              key={s.id}
              className="bg-card border border-border rounded-xl px-4 md:px-5 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            >
              <div className="font-mono text-xs text-text2 sm:min-w-[60px]">
                {formatScheduled(s.scheduledAt ?? s.scheduledDate ?? "")}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{s.topic}</div>
                <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                  {s.partner
                    ? `With ${(s.approvedHelper ?? s.partner)!.name}`
                    : s.sessionNumber
                      ? `Session #${s.sessionNumber}`
                      : "Session upcoming"}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span
                  className={`${catBadgeClass(s.category)} text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full`}
                >
                  {catLabel(s.category)}
                </span>
                <Button
                  size="sm"
                  onClick={() =>
                    onNavigate(s.id ? `session:${s.id}` : "session")
                  }
                >
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">
          Trust score
        </div>
      </div>
      <div className="bg-card border border-border rounded-[20px] p-4 md:p-5">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-display font-extrabold text-4xl md:text-5xl text-green tracking-tight">
              {stats?.trustScore ?? 500}
            </div>
            <div className="font-mono text-[10px] md:text-xs text-text3 mt-1">
              your score
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text3 mb-1.5">
              <span>{stats?.sessionsCompleted ?? 0} sessions completed</span>
            </div>
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text3 mb-1.5">
              <span>
                {stats?.showUpRate != null
                  ? `${Math.round(stats.showUpRate * 100)}% show-up rate`
                  : ""}
              </span>
            </div>
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text3">
              <span>{stats?.currentStreak ?? 0}-day streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionsTab({
  onNavigate,
  setShowAddTopicModal,
  setActiveTab,
  activeGoal,
  loading,
}: {
  onNavigate: (s: string) => void;
  setShowAddTopicModal: (b: boolean) => void;
  setActiveTab: (t: string) => void;
  activeGoal: Goal | null;
  loading: boolean;
}) {
  const [goalDetail, setGoalDetail] = useState<GoalDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [allSessions, setAllSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!activeGoal?.id) return;
    setDetailLoading(true);
    Promise.all([
      api.goals.get(activeGoal.id),
      api.sessions.getMySessions({ role: "owner", limit: 500 }),
    ])
      .then(([gd, sd]) => {
        setGoalDetail(gd.goal);
        setAllSessions(sd.sessions);
      })
      .catch(console.error)
      .finally(() => setDetailLoading(false));
  }, [activeGoal?.id]);

  if (loading || detailLoading)
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-4 animate-pulse"
          >
            <div className="h-3.5 w-3/4 bg-surface3 rounded" />
          </div>
        ))}
      </div>
    );
  if (!activeGoal)
    return (
      <div className="text-sm text-text3">
        No active goal.{" "}
        <span
          className="text-primary cursor-pointer"
          onClick={() => onNavigate("post")}
        >
          Post one →
        </span>
      </div>
    );

  const sessions: GoalSession[] = (() => {
    // Prefer the richer per-goal list from getMySessions; fill in anything
    // the goal-detail endpoint returned that getMySessions may have missed.
    const owned = allSessions.filter(
      (s) => (s.goalId ?? s.goal?.id) === activeGoal?.id,
    ) as unknown as GoalSession[];
    const fromDetail = goalDetail?.sessions ?? [];
    const seenIds = new Set(owned.map((s) => s.id));
    const extra = fromDetail.filter((s) => !seenIds.has(s.id));
    return [...owned, ...extra];
  })();
  const repsDone = goalDetail?.repsDone ?? 0,
    repsTotal = goalDetail?.repsTotal ?? 100;

  // Group sessions by category
  const grouped: Record<string, (typeof sessions)[0][]> = {};
  for (const s of sessions) {
    const c = (s.category || activeGoal.category)
      .toLowerCase()
      .replace(/\s/g, "");
    if (!grouped[c]) grouped[c] = [];
    grouped[c].push(s);
  }
  const accents: Record<string, { text: string; bar: string; label: string }> =
    {
      dsa: { text: "text-blue", bar: "bg-blue", label: "DSA" },
      systemdesign: {
        text: "text-[#6b34d6]",
        bar: "bg-[#6b34d6]",
        label: "System Design",
      },
      behavioral: {
        text: "text-[#c17800]",
        bar: "bg-[#c17800]",
        label: "Behavioral",
      },
    };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">
          Your {repsTotal}-rep roadmap
        </div>
        <Button size="sm" onClick={() => setShowAddTopicModal(true)}>
          + Add topic
        </Button>
      </div>
      <div className="text-xs md:text-sm text-text2 mb-4">
        Each topic is one session slot. The community applies to help you — you
        approve who shows up.
      </div>
      {sessions.length === 0 ? (
        <div className="text-sm text-text3">
          No sessions yet. Add topics above to get started.
        </div>
      ) : (
        Object.entries(grouped).map(([cat, catSessions]) => {
          const done = catSessions.filter(
            (s) => s.status === "completed",
          ).length;
          const a = accents[cat] ?? {
            text: "text-text2",
            bar: "bg-primary",
            label: catLabel(cat),
          };
          const pct =
            catSessions.length > 0
              ? Math.round((done / catSessions.length) * 100)
              : 0;
          return (
            <div key={cat} className="mb-4">
              <div className="flex items-center gap-2.5 py-1.5 mb-2 border-b border-border/50">
                <span className={`font-mono text-[11px] font-medium ${a.text}`}>
                  {a.label}
                </span>
                <div className="flex-1 h-0.5 bg-surface3 rounded overflow-hidden">
                  <div
                    className={`h-full ${a.bar} rounded`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] md:text-[11px] text-text3">
                  {done} / {catSessions.length} done
                </span>
              </div>
              <div className="flex flex-col gap-1.5 mb-2">
                {catSessions.map((s) => {
                  const isDone = s.status === "completed";
                  const isLive = s.status === "live";
                  const hasPending =
                    (s.appCount ?? s.applicationsCount ?? 0) > 0 &&
                    !isLive &&
                    !isDone;
                  const badge = catLabel(s.category || cat),
                    bc = catBadgeClass(s.category || cat);
                  const scheduled = s.scheduledAt ?? s.scheduledDate;
                  const shortDate = scheduled
                    ? new Date(scheduled).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : "";
                  const shortTime = scheduled
                    ? new Date(scheduled).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "";
                  if (isDone)
                    return (
                      <div
                        key={s.id}
                        className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4 opacity-60"
                      >
                        <div className="flex-shrink-0 w-10 text-center">
                          <div className="w-7 h-7 rounded-full bg-green/10 flex items-center justify-center mx-auto">
                            <span className="text-green font-bold text-sm">
                              ✓
                            </span>
                          </div>
                          <div className="font-mono text-[10px] text-text3 mt-1 leading-tight">
                            {shortDate}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{s.topic}</div>
                          <div className="font-mono text-[10px] text-text3 mt-0.5">
                            {[
                              s.sessionNumber
                                ? `Session #${s.sessionNumber}`
                                : null,
                              (s.approvedHelper ?? s.partner)?.name,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        </div>
                        {s.earnedPoints != null && (
                          <span className="font-mono text-xs font-semibold text-green bg-green/10 px-2.5 py-0.5 rounded-full flex-shrink-0">
                            +{s.earnedPoints} pts
                          </span>
                        )}
                      </div>
                    );
                  if (isLive)
                    return (
                      <div
                        key={s.id}
                        className="bg-card border-[1.5px] border-primary rounded-xl px-4 py-3 flex items-center gap-4"
                      >
                        <div className="flex-shrink-0 sm:min-w-[80px]">
                          <div className="font-mono text-xs font-medium text-primary">
                            Live now
                          </div>
                          <div className="font-mono text-[10px] text-text3">
                            {shortDate}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm flex items-center gap-1.5">
                            {s.topic}
                            <span className="badge-green text-[10px] font-mono px-2 py-0.5 rounded-full">
                              Live
                            </span>
                          </div>
                          <div className="font-mono text-[10px] text-text3 mt-0.5">
                            {[
                              s.sessionNumber
                                ? `Session #${s.sessionNumber}`
                                : null,
                              (s.approvedHelper ?? s.partner)?.name,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onNavigate(`session:${s.id}`)}
                        >
                          Join →
                        </Button>
                      </div>
                    );
                  if (hasPending) {
                    const expiry = expiresIn(s.approvalDeadline);
                    return (
                      <div
                        key={s.id}
                        className="bg-[#fffbf2] border border-[#c17800] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                      >
                        <div className="flex-shrink-0 sm:min-w-[80px]">
                          <div className="font-mono text-xs font-medium text-[#c17800]">
                            {shortDate}
                          </div>
                          <div className="font-mono text-[10px] text-[#c17800]/70">
                            {shortTime}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{s.topic}</div>
                          <div className="font-mono text-[10px] text-[#c17800] mt-0.5">
                            {s.sessionNumber
                              ? `Session #${s.sessionNumber} · `
                              : ""}
                            {s.firstApplicant
                              ? `${s.firstApplicant.name} applied`
                              : `${s.appCount ?? s.applicationsCount} applied`}
                            {expiry ? ` — expires in ${expiry}` : ""}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#fff3e0] text-[#c17800] border border-[#c17800] hover:bg-[#fff0d4]"
                          onClick={() => setActiveTab("score")}
                        >
                          Review
                        </Button>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={s.id}
                      className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4"
                    >
                      <div className="flex-shrink-0 sm:min-w-[80px]">
                        <div className="font-mono text-[11px] text-text3">
                          {shortDate}
                        </div>
                        <div className="font-mono text-[10px] text-text3">
                          {shortTime}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{s.topic}</div>
                        <div className="font-mono text-[10px] text-text3 mt-0.5">
                          {[
                            s.sessionNumber
                              ? `Session #${s.sessionNumber}`
                              : null,
                            shortDate || null,
                            "No applicants yet",
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                      </div>
                      <span
                        className={`${bc} text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full flex-shrink-0`}
                      >
                        {badge}
                      </span>
                    </div>
                  );
                })}
                <div
                  onClick={() => setShowAddTopicModal(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 border-[1.5px] border-dashed border-border rounded-xl cursor-pointer transition-colors hover:border-primary"
                >
                  <span className="text-base text-text3">+</span>
                  <span className="font-mono text-[10px] md:text-xs text-text3">
                    Add {a.label} topic…
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.partners
      .getMyPartners({ limit: 20 })
      .then((d) => setPartners(d.partners))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-4 animate-pulse"
          >
            <div className="h-3.5 w-3/4 bg-surface3 rounded" />
          </div>
        ))}
      </div>
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">
          My Partners
        </div>
        <span className="font-mono text-[10px] md:text-[11px] text-text3">
          {partners.length} partner{partners.length !== 1 ? "s" : ""}
        </span>
      </div>
      {partners.length === 0 ? (
        <p className="text-sm text-text3">
          No partners yet. Complete sessions to build your partner list.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {partners.map((p) => {
            const uId = p.user?.id ?? p.id ?? "";
            const uName = p.user?.name ?? p.name ?? "?";
            const uTrustScore = p.user?.trustScore ?? p.trustScore ?? 0;
            const uTopics = p.topics ?? [];
            const color = avatarColors(uId),
              tl = uTrustScore >= 750 ? "trust-high" : "trust-mid",
              dot = uTrustScore >= 750 ? "bg-green" : "bg-[#c17800]";
            return (
              <div
                key={uId}
                className="bg-card border border-border rounded-xl p-3 md:p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${color} flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0`}
                  >
                    {getInitials(uName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{uName}</div>
                    <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                      {p.sessionsCount} session
                      {p.sessionsCount !== 1 ? "s" : ""}
                    </div>
                    {uTopics.length > 0 && (
                      <div className="flex gap-1 md:gap-1.5 mt-2 flex-wrap">
                        {uTopics.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="badge-dsa text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-1 md:gap-1.5 font-display font-extrabold text-base md:text-lg ${tl}`}
                  >
                    <div
                      className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${dot}`}
                    />
                    {uTrustScore}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrustScoreTab({
  stats,
  activeGoalId,
}: {
  stats: UserStats | null;
  activeGoalId: string | undefined;
}) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [appLoading, setAppLoading] = useState(false);

  useEffect(() => {
    if (!activeGoalId) return;
    setAppLoading(true);
    api.applications
      .getForGoal(activeGoalId)
      .then((d) =>
        setApplications(d.applications.filter((a) => a.status === "pending")),
      )
      .catch(console.error)
      .finally(() => setAppLoading(false));
  }, [activeGoalId]);

  const handleApprove = async (id: string) => {
    try {
      await api.applications.approve(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };
  const handleReject = async (id: string) => {
    try {
      await api.applications.reject(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // Group by session slot
  const slotMap = new Map<
    string,
    { session: Application["session"]; apps: Application[] }
  >();
  const ungrouped: Application[] = [];
  for (const app of applications) {
    const rawSid = app.session?.id ?? app.sessionId;
    const sid = rawSid ? String(rawSid) : null;
    if (sid) {
      if (!slotMap.has(sid))
        slotMap.set(sid, { session: app.session, apps: [] });
      slotMap.get(sid)!.apps.push(app);
    } else {
      ungrouped.push(app);
    }
  }

  const breakdown = stats?.scoreBreakdown;
  const scoreRows = breakdown
    ? [
        {
          l: "Sessions completed",
          v: `+${breakdown.sessionsPoints}`,
          up: true,
        },
        {
          l: "Quality feedback given",
          v: `+${breakdown.feedbackPoints}`,
          up: true,
        },
        { l: "Streak bonuses", v: `+${breakdown.streakPoints}`, up: true },
        {
          l: `Missed sessions (${breakdown.missedCount}×)`,
          v: `${breakdown.missedPenalty}`,
          up: false,
        },
      ]
    : [
        {
          l: "Sessions completed",
          v: `${stats?.sessionsCompleted ?? 0}`,
          up: true,
        },
        {
          l: "Show-up rate",
          v:
            stats?.showUpRate != null
              ? `${Math.round(stats.showUpRate * 100)}%`
              : "—",
          up: true,
        },
        {
          l: `${stats?.currentStreak ?? 0}-day streak`,
          v: `+${stats?.currentStreak ?? 0}`,
          up: true,
        },
        {
          l: "Avg rating",
          v: stats?.avgRating != null ? `${stats.avgRating.toFixed(1)}/5` : "—",
          up: true,
        },
      ];

  const renderApplicantCard = (app: Application, slotAppsCount: number) => {
    const applicant = app.applicant;
    const color = applicant ? avatarColors(applicant.id) : "av-blue";
    const tl = (applicant?.trustScore ?? 0) >= 750 ? "trust-high" : "trust-mid";
    const dot =
      (applicant?.trustScore ?? 0) >= 750 ? "bg-green" : "bg-[#c17800]";
    const expiry = expiresIn(app.session?.approvalDeadline);
    return (
      <div key={app.id} className="bg-card p-4">
        <div className="flex items-start gap-3 mb-2">
          <div
            className={`w-9 h-9 rounded-full ${color} flex items-center justify-center font-display font-extrabold text-xs flex-shrink-0`}
          >
            {applicant ? getInitials(applicant.name) : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">
              {applicant?.name ?? "Applicant"}
            </div>
            <div className="font-mono text-[10px] text-text3 mt-0.5">
              Applied {formatRelDate(app.createdAt)} ·{" "}
              {applicant?.trustScore ?? 0} trust
              {applicant?.showUpRate != null &&
                ` · ${Math.round(applicant.showUpRate * 100)}% show-up`}
              {applicant?.sessionsCount != null &&
                ` · ${applicant.sessionsCount} sessions`}
            </div>
          </div>
          {applicant && (
            <div
              className={`flex items-center gap-1 font-display font-extrabold text-base ${tl}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {applicant.trustScore}
            </div>
          )}
        </div>
        {app.message && (
          <div className="bg-surface rounded-lg px-3 py-2 mb-3">
            <div className="font-mono text-[10px] text-text3 mb-0.5">
              Message
            </div>
            <div className="text-xs italic">&quot;{app.message}&quot;</div>
          </div>
        )}
        {slotAppsCount > 1 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 text-xs text-[#c17800]">
            <span>⚠</span>
            <span>
              Approving this will auto-reject the other
              {slotAppsCount > 2
                ? ` ${slotAppsCount - 1} applicants`
                : " applicant"}
            </span>
          </div>
        )}
        {expiry && expiry !== "expired" && (
          <div className="font-mono text-[10px] text-[#c17800] mb-3">
            ⚠ You must respond within {expiry} or slot re-opens
          </div>
        )}
        <div className="flex gap-2">
          <Button
            className="flex-[2] text-sm"
            onClick={() => handleApprove(app.id)}
          >
            ✓ Approve {applicant?.name?.split(" ")[0] ?? "applicant"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-sm"
            onClick={() => handleReject(app.id)}
          >
            ✗ Reject
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">
          Trust score
        </div>
      </div>
      <div className="bg-card border border-border rounded-[20px] p-4 md:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="text-center sm:text-left flex-shrink-0">
            <div className="font-display font-extrabold text-5xl text-green tracking-tight">
              {stats?.trustScore ?? 500}
            </div>
            <div className="font-mono text-[10px] text-text3 mt-1">
              your score
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-text2 mb-2 font-medium">
              Score breakdown
            </div>
            {scoreRows.map(({ l, v, up }) => (
              <div
                key={l}
                className="flex justify-between items-center font-mono text-[11px] text-text3 mb-1.5"
              >
                <span>{l}</span>
                <span
                  className={
                    up ? "text-green font-semibold" : "text-red font-semibold"
                  }
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-surface rounded-[20px] p-4 mb-6">
        <div className="font-mono text-[11px] text-text3 mb-3">Score tiers</div>
        {[
          {
            c: "bg-green",
            range: "750+",
            desc: "Highly reliable, shown first in open slots",
          },
          {
            c: "bg-[#c17800]",
            range: "500–749",
            desc: "Reliable. Occasionally missed sessions.",
          },
          {
            c: "bg-red",
            range: "Below 500",
            desc: "Risky. Shown last in feed.",
          },
        ].map(({ c, range, desc }) => (
          <div key={range} className="flex items-center gap-3 mb-1.5">
            <div className={`w-2 h-2 rounded-full ${c}`} />
            <span className="text-xs">
              <strong>{range}</strong> — {desc}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="font-display font-bold text-base md:text-[17px]">
          Pending applicants
        </div>
        {applications.length > 0 && (
          <span className="badge-red text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full">
            {applications.length} waiting
          </span>
        )}
      </div>
      <div className="text-xs text-text2 mb-4">
        Approve one per session slot. Unanswered slots re-open to the community
        after the deadline.
      </div>
      {appLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 animate-pulse"
            >
              <div className="h-3.5 w-3/4 bg-surface3 rounded" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <p className="text-sm text-text3">No pending applicants right now.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {Array.from(slotMap.entries()).map(([sid, { session, apps }]) => {
            const expiry = expiresIn(session?.approvalDeadline);
            const scheduledStr = session?.scheduledAt ?? session?.scheduledDate;
            const sessionTime = scheduledStr
              ? new Date(scheduledStr).toLocaleString("en-US", {
                  weekday: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "";
            return (
              <div
                key={sid}
                className="rounded-xl overflow-hidden border border-amber-200"
              >
                <div className="flex items-center justify-between bg-amber-50 px-4 py-2.5">
                  <div className="font-mono text-[11px] font-semibold text-[#c17800]">
                    {session?.sessionNumber
                      ? `Session #${session.sessionNumber} · `
                      : ""}
                    {session?.topic ?? "Session"}
                    {sessionTime ? ` · ${sessionTime}` : ""}
                  </div>
                  {expiry && (
                    <span className="font-mono text-[10px] text-[#c17800] bg-amber-100 px-2 py-0.5 rounded-full">
                      expires in {expiry}
                    </span>
                  )}
                </div>
                <div className="divide-y divide-border">
                  {apps.map((app) => renderApplicantCard(app, apps.length))}
                </div>
              </div>
            );
          })}
          {ungrouped.map((app) => {
            const applicant = app.applicant;
            const color = applicant ? avatarColors(applicant.id) : "av-blue";
            const tl =
              (applicant?.trustScore ?? 0) >= 750 ? "trust-high" : "trust-mid";
            const dot =
              (applicant?.trustScore ?? 0) >= 750 ? "bg-green" : "bg-[#c17800]";
            return (
              <div
                key={app.id}
                className="bg-card border border-[#c17800] rounded-[20px] p-4 md:p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${color} flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0`}
                  >
                    {applicant ? getInitials(applicant.name) : "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">
                      {applicant?.name ?? "Applicant"}
                    </div>
                    <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                      Applied {formatRelDate(app.createdAt)} ·{" "}
                      {applicant?.trustScore ?? 0} trust
                      {applicant?.showUpRate != null &&
                        ` · ${Math.round(applicant.showUpRate * 100)}% show-up`}
                      {applicant?.sessionsCount != null &&
                        ` · ${applicant.sessionsCount} sessions`}
                    </div>
                  </div>
                  {applicant && (
                    <div
                      className={`flex items-center gap-1 md:gap-1.5 font-display font-extrabold text-base md:text-lg ${tl}`}
                    >
                      <div
                        className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${dot}`}
                      />
                      {applicant.trustScore}
                    </div>
                  )}
                </div>
                {app.message && (
                  <div className="bg-surface rounded-lg p-3 mb-3">
                    <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-1">
                      Message
                    </div>
                    <div className="text-xs md:text-sm italic">
                      &quot;{app.message}&quot;
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    className="flex-[2] text-sm"
                    onClick={() => handleApprove(app.id)}
                  >
                    ✓ Approve {applicant?.name?.split(" ")[0] ?? "applicant"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-sm"
                    onClick={() => handleReject(app.id)}
                  >
                    ✗ Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
