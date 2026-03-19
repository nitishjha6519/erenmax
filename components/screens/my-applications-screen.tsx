"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { ApplicationWithDetails } from "@/lib/api";

interface MyApplicationsScreenProps {
  onNavigate: (screen: string) => void;
}

function avatarColors(id?: string) {
  return (["av-purple", "av-green", "av-orange", "av-blue"] as const)[
    ((id ?? "").charCodeAt(0) || 0) % 4
  ];
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
function timeAgo(d: string) {
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}
function formatDate(d: string) {
  return (
    new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }) +
    " · " +
    new Date(d).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  );
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

export function MyApplicationsScreen({
  onNavigate,
}: MyApplicationsScreenProps) {
  const { user } = useAuth();
  const [pending, setPending] = useState<ApplicationWithDetails[]>([]);
  const [upcoming, setUpcoming] = useState<ApplicationWithDetails[]>([]);
  const [past, setPast] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.applications
      .myApplications({ status: "all" })
      .then((d) => {
        const all = d.applications ?? [];
        // Trust API's pre-split arrays; fall back to filtering only if arrays are absent (undefined)
        setPending(d.pending ?? all.filter((a) => a.status === "pending"));
        setUpcoming(
          d.upcoming ??
            all.filter(
              (a) =>
                a.status === "approved" &&
                a.session?.status !== "completed" &&
                a.session?.status !== "in_progress",
            ),
        );
        setPast(
          d.past ??
            all.filter(
              (a) => a.status === "completed" || a.status === "rejected",
            ),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleWithdraw = async (id: string) => {
    setWithdrawing(id);
    try {
      await api.applications.withdraw(id);
      setPending((prev) => prev.filter((a) => a.id !== id));
      setUpcoming((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setWithdrawing(null);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">
        Logged in as {user?.name ?? "—"}
      </div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-5 md:mb-8">
        My <span className="text-primary">applications</span>
      </h1>

      {loading ? (
        <div className="flex flex-col gap-3 max-w-[960px]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-[20px] p-5 animate-pulse"
            >
              <div className="h-4 w-2/3 bg-surface3 rounded mb-3" />
              <div className="h-3 w-full bg-surface3 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 max-w-[960px]">
          {/* Left Column */}
          <div>
            {/* Awaiting Approval */}
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-bold text-base md:text-[17px]">
                Awaiting approval
              </div>
              {pending.length > 0 && (
                <span className="badge-gray text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full">
                  {pending.length} pending
                </span>
              )}
            </div>
            {pending.length === 0 ? (
              <p className="text-sm text-text3 mb-6">
                No pending applications.
              </p>
            ) : (
              <div className="flex flex-col gap-3 mb-5 md:mb-6">
                {pending.map((app) => {
                  const owner = app.goal?.user ?? app.goal?.owner;
                  const color = owner ? avatarColors(owner.id) : "av-blue";
                  return (
                    <div
                      key={app.id}
                      className="bg-card border border-border rounded-[20px] p-4 md:p-5 border-l-[3px] border-l-[#c17800]"
                    >
                      <div className="flex items-start sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div
                            className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${color} flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0`}
                          >
                            {owner ? getInitials(owner.name) : "?"}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">
                              {app.goal?.title ?? "Goal"}
                            </div>
                            <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-0.5">
                              Applied {timeAgo(app.createdAt)}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] md:text-[11px] font-mono font-medium px-2 md:px-2.5 py-0.5 rounded-full bg-[#fff3e0] text-[#c17800] whitespace-nowrap">
                          Pending
                        </span>
                      </div>
                      {app.session && (
                        <div className="bg-surface rounded-lg p-3 mb-3">
                          <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-1">
                            Applied slot
                          </div>
                          <div className="text-xs md:text-sm font-semibold">
                            {app.session.topic}
                          </div>
                          <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                            {app.session.sessionNumber
                              ? `Session #${app.session.sessionNumber} · `
                              : ""}
                            {formatDate(
                              app.session.scheduledAt ??
                                app.session.scheduledDate ??
                                "",
                            )}{" "}
                            · {app.session.duration ?? 60} min
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text2 mb-3">
                        <span>Stake at risk if approved &amp; no-show</span>
                        <span className="text-primary font-semibold">
                          {app.stakedPoints} pts
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => onNavigate("feed")}
                        >
                          View goal
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-bg text-red border border-red/20 hover:bg-red-bg/80 text-xs"
                          disabled={withdrawing === app.id}
                          onClick={() => handleWithdraw(app.id)}
                        >
                          {withdrawing === app.id ? "Withdrawing…" : "Withdraw"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Approved — upcoming */}
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-bold text-base md:text-[17px]">
                Upcoming/Live
              </div>
              {upcoming.length > 0 && (
                <span className="badge-green text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full">
                  {upcoming.length} confirmed
                </span>
              )}
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-text3">
                No approved applications yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcoming.map((app) => {
                  const scheduled =
                    app.session?.scheduledAt ??
                    app.session?.scheduledDate ??
                    "";
                  const goal = app.goal;
                  const category = app.session?.category ?? goal?.category;
                  return (
                    <div
                      key={app.id}
                      className="bg-card border border-border rounded-xl px-4 md:px-5 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                    >
                      <div className="font-mono text-xs text-text2 sm:min-w-[60px]">
                        {scheduled ? formatScheduled(scheduled) : "—"}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {app.session?.topic ?? goal?.title ?? "Session"}
                        </div>
                        <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                          {app.session?.sessionNumber
                            ? `Session #${app.session.sessionNumber}`
                            : (goal?.title ?? "Upcoming")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        {category && (
                          <span
                            className={`${catBadgeClass(category)} text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full`}
                          >
                            {catLabel(category)}
                          </span>
                        )}
                        <Button
                          size="sm"
                          onClick={() =>
                            onNavigate(
                              app.session?.id
                                ? `session:${app.session.id}`
                                : "session",
                            )
                          }
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Past Applications */}
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-bold text-base md:text-[17px]">
                Past applications
              </div>
            </div>
            {past.length === 0 ? (
              <p className="text-sm text-text3 mb-4">No past applications.</p>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                {past.map((app) => {
                  const displayStatus = app.status;
                  const isNegative = app.status === "rejected";
                  return (
                    <div
                      key={app.id}
                      className={`bg-card border border-border rounded-xl p-3 md:p-4 ${isNegative ? "opacity-55" : "opacity-80"}`}
                    >
                      <div className="flex items-start sm:items-center justify-between gap-2 mb-2">
                        <div className="text-xs md:text-[13px] font-semibold">
                          {app.session?.topic ?? app.goal?.title ?? "Session"}
                        </div>
                        <span
                          className={`${isNegative ? "badge-red" : "badge-green"} text-[10px] font-mono font-medium px-2 py-0.5 rounded-full capitalize`}
                        >
                          {displayStatus.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] md:text-[11px] text-text3">
                        {(app.session?.scheduledAt ??
                        app.session?.scheduledDate)
                          ? formatDate(
                              app.session?.scheduledAt ??
                                app.session?.scheduledDate ??
                                "",
                            )
                          : `Applied ${timeAgo(app.createdAt)}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Trust score side card */}
            <div className="bg-ink rounded-[20px] p-5 md:p-6">
              <div className="font-mono text-[10px] text-white/40 tracking-wider uppercase mb-2 md:mb-3">
                Trust score
              </div>
              <div className="text-xs text-white/40 mt-1 mb-3 md:mb-4">
                Builds with every session you complete on time.
              </div>
              <Button
                variant="outline"
                className="w-full text-black/60 border-white/15 hover:bg-white/5"
                size="sm"
                onClick={() => onNavigate("feed")}
              >
                Browse more open slots
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
