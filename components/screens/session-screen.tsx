"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Session, LiveSession } from "@/lib/api";

interface SessionScreenProps {
  onNavigate: (screen: string) => void;
  sessionId?: string;
}

function avatarColors(id: string) {
  return (["av-purple", "av-green", "av-orange", "av-blue"] as const)[
    id.charCodeAt(0) % 4
  ];
}
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function SessionScreen({ onNavigate, sessionId }: SessionScreenProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [liveData, setLiveData] = useState<{
    isLive: boolean;
    session: LiveSession;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const [notes, setNotes] = useState("");
  const [showUp, setShowUp] = useState("ontime");
  const [quality, setQuality] = useState("5");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (sessionId) {
          try {
            const d = await api.sessions.getLive(sessionId);
            setLiveData(d);
            setTime(
              d.isLive && d.session.endsAt
                ? Math.max(
                    0,
                    Math.floor(
                      (new Date(d.session.endsAt).getTime() - Date.now()) /
                        1000,
                    ),
                  )
                : d.session.duration * 60,
            );
          } catch {
            // /live endpoint unavailable — fall back to plain session data
            const d = await api.sessions.get(sessionId);
            setSession(d.session);
            setTime(((d.session as { duration?: number }).duration ?? 60) * 60);
          }
        } else {
          const d = await api.sessions.getUpcoming({ limit: 1 });
          const s = d.sessions[0] ?? null;
          setSession(s);
          if (s) setTime((s.duration ?? 60) * 60);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  // Only tick the countdown when the session is actually live
  const isLive = sessionId ? (liveData?.isLive ?? false) : !!session;

  useEffect(() => {
    if (!isLive) return;
    timerRef.current = setInterval(
      () => setTime((t) => (t > 0 ? t - 1 : 0)),
      1000,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLive]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSubmit = async () => {
    const sid = liveData?.session.id ?? session?.id;
    if (!sid) return;
    setSubmitting(true);
    try {
      await api.sessions.complete(sid, {
        rating: Number(quality),
        feedback,
        partnerShowedUp: showUp !== "noshow",
      });
      setSubmitted(true);
      setTimeout(() => onNavigate("dashboard"), 1200);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="animate-fade-up max-w-[1000px]">
        <div className="bg-card border border-border rounded-[20px] p-6 animate-pulse">
          <div className="h-5 w-1/3 bg-surface3 rounded mb-3" />
          <div className="h-3 w-2/3 bg-surface3 rounded" />
        </div>
      </div>
    );

  if (!liveData && !session)
    return (
      <div className="animate-fade-up">
        <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">
          Sessions
        </div>
        <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-5">
          No upcoming session
        </h1>
        <p className="text-sm text-text2 mb-4">
          You have no upcoming sessions right now. Check your dashboard for your
          roadmap.
        </p>
        <Button onClick={() => onNavigate("dashboard")}>
          Back to dashboard
        </Button>
      </div>
    );

  // Unified display values — prefer LiveSession data when available
  const live = liveData?.session;
  const partner =
    live?.approvedHelper ?? session?.approvedHelper ?? session?.partner;
  const partnerColor = partner ? avatarColors(partner.id) : "av-purple";
  const topic = live?.topic ?? session?.topic ?? "";
  const sessionNum = session?.sessionNumber;
  const repsLeft = session?.repsLeft ?? 0;
  const meetingLink = live?.meetingLink;
  const scheduledAt = live?.scheduledAt;

  return (
    <div className="animate-fade-up">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">
        Live session
      </div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-5 md:mb-8">
        {sessionNum ? (
          <>
            Session <span className="text-primary">#{sessionNum}</span>
          </>
        ) : live?.goal ? (
          <span className="text-primary">{live.goal.title}</span>
        ) : (
          "Live Session"
        )}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 max-w-[1000px]">
        {/* Left Column */}
        <div>
          {/* Hero Timer */}
          <div
            className={cn(
              "bg-ink rounded-[20px] px-5 md:px-8 py-5 md:py-7 mb-4 relative overflow-hidden",
              !isLive && "opacity-50",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              {partner ? (
                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${partnerColor} flex items-center justify-center font-display font-extrabold text-xs md:text-sm`}
                  >
                    {getInitials(partner.name)}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {partner.name}
                    </div>
                    <div className="text-white/40 text-[10px] md:text-xs font-mono">
                      Partner today · ★ {partner.trustScore}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-white/40 text-sm font-mono">
                  No partner assigned yet
                </div>
              )}
              {isLive ? (
                <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-green/30 text-[#6ee09a]">
                  ● Live
                </span>
              ) : (
                <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-white/40">
                  ◷ Waiting
                </span>
              )}
            </div>
            {!isLive && scheduledAt && (
              <div className="text-white/50 text-xs font-mono mb-3">
                Starts at{" "}
                {new Date(scheduledAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div>
                <div
                  className={cn(
                    "font-display font-extrabold text-2xl md:text-[32px] tracking-tight",
                    isLive ? "text-white" : "text-white/30",
                  )}
                >
                  {formatTime(time)}
                </div>
                <div className="font-mono text-[10px] md:text-xs text-white/40">
                  remaining
                </div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">
                  {sessionNum ?? "—"}
                </div>
                <div className="font-mono text-[10px] md:text-xs text-white/40">
                  session #
                </div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl md:text-[32px] text-primary tracking-tight">
                  {repsLeft}
                </div>
                <div className="font-mono text-[10px] md:text-xs text-white/40">
                  reps left
                </div>
              </div>
            </div>
          </div>

          {/* Meeting link — only shown when session is live */}
          {isLive && meetingLink && (
            <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-4">
              <div className="font-display font-bold text-base md:text-[17px] mb-2">
                Meeting link
              </div>
              <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">Join meeting →</Button>
              </a>
            </div>
          )}

          {/* Session Topic */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="font-display font-bold text-base md:text-[17px]">
                Today&apos;s topic
              </div>
              {sessionNum && (
                <span className="badge-dsa text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full self-start">
                  Session #{sessionNum}
                </span>
              )}
            </div>
            <div className="font-display font-bold text-base md:text-lg mb-1.5">
              {topic}
            </div>
            <div className="text-xs md:text-sm text-text2 mb-3">
              {partner
                ? `${partner.name} is the interviewer today. They will run the mock interview format.`
                : "Your session partner will be assigned shortly."}
            </div>
          </div>

          {/* Session Checklist */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-4">
            <div className="font-display font-bold text-base md:text-[17px] mb-1">
              Session checklist
            </div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-3">
              Mock session — follow this structure
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                "Clarify constraints, input/output, edge cases",
                "State brute force approach first, get buy-in",
                "Explain optimised approach before coding",
                "Narrate while coding — don't go silent",
                "State time & space complexity",
                "Test with provided examples + edge cases",
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex items-start gap-2.5 cursor-pointer text-xs md:text-sm"
                >
                  <input type="checkbox" className="w-4 h-4 mt-0.5" />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5">
            <div className="font-display font-bold text-base md:text-[17px] mb-3">
              Session notes
            </div>
            <textarea
              className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none resize-none"
              rows={5}
              placeholder="Jot down observations as the session runs..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Post-session Feedback */}
          <div
            className={cn(
              "bg-card border-[1.5px] border-primary rounded-[20px] p-4 md:p-5",
              !isLive && "opacity-40 pointer-events-none",
            )}
          >
            <div className="font-display font-bold text-base md:text-[17px] mb-1">
              Rate this session
            </div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-4">
              {partner
                ? `Your rating updates ${partner.name}'s trust score publicly.`
                : "Rate your session after it ends."}
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                Did {partner?.name?.split(" ")[0] ?? "your partner"} show up?
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "ontime", label: "On time" },
                  { value: "late", label: "Late (<10 min)" },
                  { value: "noshow", label: "No-show" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setShowUp(opt.value)}
                    className={cn(
                      "font-mono text-[10px] md:text-xs font-medium px-3 md:px-4 py-1.5 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all",
                      showUp === opt.value &&
                        "border-primary text-primary bg-[#fff5f2]",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                Feedback quality
              </label>
              <div className="flex gap-2">
                {["1", "2", "3", "4", "5"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={cn(
                      "font-mono text-xs font-medium w-9 md:w-10 h-8 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all",
                      quality === q &&
                        "border-primary text-primary bg-[#fff5f2]",
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                Written feedback (optional)
              </label>
              <textarea
                className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none resize-none"
                rows={2}
                placeholder="e.g. Great probing questions. Pushed me when I went silent."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            {partner && (
              <div className="bg-surface rounded-lg px-3.5 py-2.5 mb-4 text-xs text-text2">
                {partner.name} staked{" "}
                <strong className="text-foreground">
                  {(live ? 0 : session?.stakedPoints) ?? 0} pts
                </strong>
                . Marking no-show will deduct them automatically.
              </div>
            )}

            {submitted ? (
              <div className="bg-green-bg rounded-lg px-4 py-3 text-center text-sm text-green font-medium">
                Session completed! Redirecting…
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit & complete session"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
