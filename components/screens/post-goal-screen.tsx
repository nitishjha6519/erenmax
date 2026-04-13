"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface PostGoalScreenProps {
  onNavigate: (screen: string) => void;
}

export function PostGoalScreen({ onNavigate }: PostGoalScreenProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [goalTitle, setGoalTitle] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(["DSA"]);
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [targetCompany, setTargetCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateErrors, setDateErrors] = useState<{ start?: string; end?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Returns today as YYYY-MM-DD in local time
  const todayLocal = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Validate dates and return whether they pass
  const validateDates = () => {
    const today = todayLocal();
    const errs: { start?: string; end?: string } = {};
    if (startDate && startDate < today)
      errs.start = "Start date must be today or a future date.";
    if (endDate && endDate < today)
      errs.end = "End date must be today or a future date.";
    if (startDate && endDate && !errs.start && !errs.end && endDate <= startDate)
      errs.end = "End date must be after start date.";
    setDateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handlePost = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const category =
        selectedTypes[0]?.toLowerCase().replace(" ", "") === "systemdesign"
          ? "systemdesign"
          : (selectedTypes[0]?.toLowerCase() ?? "dsa");
      await api.goals.create({
        title: goalTitle || "Untitled goal",
        description,
        category,
        difficulty,
        pledgedPoints: 100,
        ...(startDate && { startDate: new Date(startDate).toISOString() }),
        ...(endDate && { endDate: new Date(endDate).toISOString() }),
      });
      onNavigate("dashboard");
    } catch (e: unknown) {
      setSubmitError(
        e instanceof Error
          ? e.message
          : "Failed to post goal. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">
        New Goal
      </div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-5 md:mb-8">
        Define your <span className="text-primary">goal</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-[860px]">
        {/* Left: Form */}
        <div>
          {/* Step Indicator */}
          <div className="flex gap-1.5 mb-5 md:mb-7">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-1 flex-1 rounded-sm transition-colors",
                  step <= currentStep ? "bg-primary" : "bg-surface3",
                )}
              />
            ))}
          </div>

          {/* Step 1: Goal basics */}
          {currentStep === 1 && (
            <div>
              <div className="font-mono text-[11px] text-text3 mb-4">
                Step 1 of 3 — Your goal
              </div>
              <div className="mb-4 md:mb-5">
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                  Goal title
                </label>
                <input
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
                  placeholder="e.g. Crack FAANG in 10 weeks"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                />
              </div>
              <div className="mb-4 md:mb-5">
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                  What types of sessions will you need?
                </label>
                <div className="flex gap-2 flex-wrap">
                  {["DSA", "System Design", "Behavioral"].map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={cn(
                        "font-mono text-[10px] md:text-xs font-medium px-3 md:px-4 py-1.5 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all",
                        selectedTypes.includes(type) &&
                          "border-primary text-primary bg-[#fff5f2]",
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-2">
                  You&apos;ll add specific topics from your dashboard after
                  posting.
                </div>
              </div>
              <div className="mb-4 md:mb-5">
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                  Target company / role
                </label>
                <input
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
                  placeholder="e.g. Google L4, Meta E4, any senior SWE role"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                />
              </div>
              <div className="mb-4 md:mb-5">
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                  Difficulty level
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "advanced", label: "Advanced" },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={cn(
                        "font-mono text-[10px] md:text-xs font-medium px-3 md:px-4 py-1.5 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all",
                        difficulty === d.value &&
                          "border-primary text-primary bg-[#fff5f2]",
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                  Why does this matter to you?
                </label>
                <textarea
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none resize-none"
                  rows={3}
                  placeholder="This is shown publicly on your goal. Be honest — it attracts helpers who take it as seriously as you do."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={() => setCurrentStep(2)}>
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Goal settings */}
          {currentStep === 2 && (
            <div>
              <div className="font-mono text-[11px] text-text3 mb-4">
                Step 2 of 3 — Settings
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 md:mb-5">
                <div>
                  <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                    Target start date
                  </label>
                  <input
                    type="date"
                    min={todayLocal()}
                    className={cn(
                      "w-full px-3.5 py-2.5 border-[1.5px] rounded-lg text-sm md:text-[15px] bg-card outline-none",
                      dateErrors.start ? "border-red" : "border-border focus:border-primary",
                    )}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDateErrors((prev) => ({ ...prev, start: undefined }));
                    }}
                  />
                  {dateErrors.start && (
                    <p className="font-mono text-[11px] text-red mt-1">{dateErrors.start}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
                    Target end date
                  </label>
                  <input
                    type="date"
                    min={startDate || todayLocal()}
                    className={cn(
                      "w-full px-3.5 py-2.5 border-[1.5px] rounded-lg text-sm md:text-[15px] bg-card outline-none",
                      dateErrors.end ? "border-red" : "border-border focus:border-primary",
                    )}
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDateErrors((prev) => ({ ...prev, end: undefined }));
                    }}
                  />
                  {dateErrors.end && (
                    <p className="font-mono text-[11px] text-red mt-1">{dateErrors.end}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (validateDates()) setCurrentStep(3);
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & post */}
          {currentStep === 3 && (
            <div>
              <div className="font-mono text-[11px] text-text3 mb-4">
                Step 3 of 3 — Review & post
              </div>
              <div className="bg-card border border-border rounded-[20px] p-4 md:p-6 mb-4">
                <div className="font-display font-bold text-sm md:text-base mb-2.5">
                  {goalTitle || "Crack FAANG in 10 weeks"}
                </div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {selectedTypes.map((type) => (
                    <span
                      key={type}
                      className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full ${type === "DSA" ? "badge-dsa" : type === "System Design" ? "badge-design" : "badge-behavioral"}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <div className="h-px bg-border my-4" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
                  <div>
                    <div className="font-mono text-[10px] md:text-[11px] text-text3">Difficulty</div>
                    <div className="font-semibold text-xs md:text-sm text-foreground mt-1 capitalize">{difficulty}</div>
                  </div>
                  {targetCompany && (
                    <div>
                      <div className="font-mono text-[10px] md:text-[11px] text-text3">Target company / role</div>
                      <div className="font-semibold text-xs md:text-sm text-foreground mt-1">{targetCompany}</div>
                    </div>
                  )}
                  {startDate && (
                    <div>
                      <div className="font-mono text-[10px] md:text-[11px] text-text3">Start date</div>
                      <div className="font-semibold text-xs md:text-sm text-foreground mt-1">
                        {new Date(startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })}
                      </div>
                    </div>
                  )}
                  {endDate && (
                    <div>
                      <div className="font-mono text-[10px] md:text-[11px] text-text3">End date</div>
                      <div className="font-semibold text-xs md:text-sm text-foreground mt-1">
                        {new Date(endDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })}
                      </div>
                    </div>
                  )}
                  {description && (
                    <div className="col-span-2">
                      <div className="font-mono text-[10px] md:text-[11px] text-text3">Why it matters</div>
                      <div className="text-xs md:text-sm text-foreground mt-1 leading-relaxed">{description}</div>
                    </div>
                  )}
                </div>
                <div className="bg-surface rounded-lg p-3 text-xs md:text-[13px] text-text2">
                  After posting, go to your Dashboard → Sessions tab to add
                  specific topics (Arrays, System Design problems, Behavioral
                  themes). Each topic becomes an open slot the community can
                  apply to fill.
                </div>
              </div>
              {submitError && (
                <div className="bg-red-bg text-red text-xs rounded-lg px-3 py-2 mb-3">
                  {submitError}
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Edit
                </Button>
                <Button
                  className="flex-[2]"
                  onClick={handlePost}
                  disabled={submitting}
                >
                  {submitting ? "Posting…" : "Post goal"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="hidden lg:block">
          <div className="font-mono text-[11px] text-text3 mb-4">
            How it looks to the community
          </div>
          <div className="bg-card border border-border rounded-[20px] p-5 md:p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full av-orange flex items-center justify-center font-display font-extrabold text-sm">
                  {user?.initials ?? "??"}
                </div>
                <div>
                  <div className="font-semibold">{user?.name ?? "—"}</div>
                  <div className="font-mono text-[11px] text-text3">
                    Just now{user?.location ? ` · ${user.location}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-display font-extrabold text-[22px] trust-high">
                <div className="w-2 h-2 rounded-full bg-green" />
                {user?.trustScore ?? 500}
              </div>
            </div>
            <div className="font-display font-bold text-base mb-2">
              {goalTitle || "Crack FAANG in 10 weeks"}
            </div>
            <div className="text-sm text-text2 mb-4">
              This is shown publicly — be honest, it attracts helpers who take
              it seriously.
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <span className="font-mono text-[11px] text-text3 px-2 py-0.5 border border-border/50 rounded">
                  {selectedTypes.join(" · ")}
                </span>
                <span className="font-mono text-[11px] text-primary px-2 py-0.5 border border-primary/30 rounded">
                  0 open slots yet
                </span>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-surface rounded-[20px] p-5">
            <div className="font-mono text-[11px] text-text3 mb-3">
              What happens after posting
            </div>
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {[
                {
                  done: true,
                  active: false,
                  title: "Goal posted",
                  desc: "Visible to community. No open slots yet.",
                },
                {
                  done: false,
                  active: true,
                  title: "Add topics in Dashboard",
                  desc: "Each topic = one session slot with a date/time. Community can now see and apply.",
                },
                {
                  done: false,
                  active: false,
                  title: "Applicants come in",
                  desc: "You review each person's trust score and message. Approve the best one per slot.",
                },
                {
                  done: false,
                  active: false,
                  title: "Sessions run, reps count",
                  desc: "Each completed session = 1 rep. Reach 100.",
                },
              ].map((item, i) => (
                <div key={i} className="relative pb-5 pl-5">
                  <div
                    className={cn(
                      "absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-card z-10",
                      item.done && "border-green bg-green",
                      item.active && "border-primary bg-primary",
                      !item.done && !item.active && "border-border",
                    )}
                  />
                  <div className="text-[13px] font-medium">{item.title}</div>
                  <div className="font-mono text-[11px] text-text3 mt-1">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
