"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

interface SessionScreenProps {
  onNavigate: (screen: string) => void
}

export function SessionScreen({ onNavigate }: SessionScreenProps) {
  const [time, setTime] = useState(43 * 60 + 21) // 43:21 in seconds
  const [showUp, setShowUp] = useState('ontime')
  const [quality, setQuality] = useState('5')
  const [useful, setUseful] = useState('very')

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t > 0 ? t - 1 : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="animate-fade-up">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">Live session</div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-5 md:mb-8">
        Session <span className="text-primary">#35</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 max-w-[1000px]">
        {/* Left Column */}
        <div>
          {/* Hero Timer */}
          <div className="bg-ink rounded-[20px] px-5 md:px-8 py-5 md:py-7 mb-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 md:w-10 h-9 md:h-10 rounded-full av-purple flex items-center justify-center font-display font-extrabold text-xs md:text-sm">RK</div>
                <div>
                  <div className="text-white font-semibold text-sm">Rahul Krishnan</div>
                  <div className="text-white/40 text-[10px] md:text-xs font-mono">Interviewer today · ★ 892</div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-green/30 text-[#6ee09a]">● Live</span>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div>
                <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">{formatTime(time)}</div>
                <div className="font-mono text-[10px] md:text-xs text-white/40">remaining</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">35</div>
                <div className="font-mono text-[10px] md:text-xs text-white/40">session #</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl md:text-[32px] text-primary tracking-tight">65</div>
                <div className="font-mono text-[10px] md:text-xs text-white/40">reps left</div>
              </div>
            </div>
          </div>

          {/* Session Topic */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="font-display font-bold text-base md:text-[17px]">Today&apos;s topic</div>
              <span className="badge-dsa text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full self-start">DSA · Session #35</span>
            </div>
            <div className="font-display font-bold text-base md:text-lg mb-1.5">Trees — BFS & DFS</div>
            <div className="text-xs md:text-sm text-text2 mb-3">Rahul is the interviewer. You are being assessed. Rahul will pick a tree problem and run the mock interview format — introduce it, let you code, probe your reasoning.</div>
            <div className="flex gap-2 flex-wrap">
              {['Binary Trees', 'Level Order Traversal', 'Inorder / Preorder', 'Depth-First Search'].map((tag) => (
                <span key={tag} className="font-mono text-[10px] md:text-[11px] text-text3 px-2 py-0.5 border border-border/50 rounded">{tag}</span>
              ))}
            </div>
          </div>

          {/* DSA Checklist */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-4">
            <div className="font-display font-bold text-base md:text-[17px] mb-1">Session checklist</div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-3">DSA mock — follow this structure</div>
            <div className="flex flex-col gap-2.5">
              {[
                { checked: true, label: 'Clarify constraints, input/output, edge cases' },
                { checked: true, label: 'State brute force approach first, get buy-in' },
                { checked: false, label: 'Explain optimised approach before coding' },
                { checked: false, label: 'Narrate while coding — don\'t go silent' },
                { checked: false, label: 'State time & space complexity' },
                { checked: false, label: 'Test with provided examples + edge cases' },
              ].map((item, i) => (
                <label key={i} className="flex items-start gap-2.5 cursor-pointer text-xs md:text-sm">
                  <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 mt-0.5" />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Interviewer Tips */}
          <div className="bg-surface rounded-[20px] p-4 md:p-5">
            <div className="font-display font-bold text-[13px] mb-1">Interviewer guide (for Rahul)</div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-2.5">How to run a good mock interview</div>
            <div className="flex flex-col gap-2 text-xs md:text-[13px] text-text2">
              {[
                'Give a real problem, not a hint-heavy version',
                'Stay quiet while they think — let them struggle',
                'Only hint if completely stuck for 5+ mins',
                'Ask "what\'s the complexity?" after they finish',
                'Give specific, honest feedback at the end',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Session Notes */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-4">
            <div className="font-display font-bold text-base md:text-[17px] mb-3">Session notes</div>
            <textarea 
              className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none resize-none"
              rows={5}
              placeholder="Jot down observations as the session runs...

e.g.
— Started with brute force O(n²), explained well
— Missed null pointer edge case
— Needed hint on using a queue for BFS
— Coding was clean, variable names good"
            />
          </div>

          {/* Post-session Feedback */}
          <div className="bg-card border-[1.5px] border-primary rounded-[20px] p-4 md:p-5">
            <div className="font-display font-bold text-base md:text-[17px] mb-1">Rate this session</div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-4">Your rating updates Rahul&apos;s trust score publicly.</div>

            {/* Show up */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Did Rahul show up?</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'ontime', label: 'On time' },
                  { value: 'late', label: 'Late (<10 min)' },
                  { value: 'noshow', label: 'No-show' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setShowUp(opt.value)}
                    className={cn(
                      "font-mono text-[10px] md:text-xs font-medium px-3 md:px-4 py-1.5 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all",
                      showUp === opt.value && "border-primary text-primary bg-[#fff5f2]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Quality */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Feedback quality (as interviewer)</label>
              <div className="flex gap-2">
                {['1', '2', '3', '4', '5'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={cn(
                      "font-mono text-xs font-medium w-9 md:w-10 h-8 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all",
                      quality === q && "border-primary text-primary bg-[#fff5f2]"
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Usefulness */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Was the session useful?</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'very', label: 'Very useful' },
                  { value: 'somewhat', label: 'Somewhat' },
                  { value: 'not', label: 'Not really' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setUseful(opt.value)}
                    className={cn(
                      "font-mono text-[10px] md:text-xs font-medium px-3 md:px-4 py-1.5 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all",
                      useful === opt.value && "border-primary text-primary bg-[#fff5f2]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Written Feedback */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Written feedback for Rahul (optional)</label>
              <textarea 
                className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none resize-none"
                rows={2}
                placeholder="e.g. Great probing questions. Pushed me when I went silent. Could be more specific on hints."
              />
            </div>

            {/* Stake Notice */}
            <div className="bg-surface rounded-lg px-3.5 py-2.5 mb-4 text-xs text-text2">
              Rahul staked <strong className="text-foreground">150 pts</strong>. Marking no-show will deduct them automatically.
            </div>

            <Button className="w-full" onClick={() => onNavigate('dashboard')}>
              Submit & complete session
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
