"use client"

import { Button } from "@/components/ui/button"

interface MyApplicationsScreenProps {
  onNavigate: (screen: string) => void
}

export function MyApplicationsScreen({ onNavigate }: MyApplicationsScreenProps) {
  return (
    <div className="animate-fade-up">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">Logged in as Arjun Kumar</div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-5 md:mb-8">
        My <span className="text-primary">applications</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 max-w-[960px]">
        {/* Left Column */}
        <div>
          {/* Awaiting Approval */}
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-base md:text-[17px]">Awaiting approval</div>
            <span className="badge-gray text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full">2 pending</span>
          </div>

          {/* Pending Application 1 */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-3 border-l-[3px] border-l-[#c17800]">
            <div className="flex items-start sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 md:w-10 h-9 md:h-10 rounded-full av-purple flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0">RK</div>
                <div>
                  <div className="text-sm font-semibold">Rahul Krishnan&apos;s goal</div>
                  <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-0.5">Applied 1h ago</div>
                </div>
              </div>
              <span className="text-[10px] md:text-[11px] font-mono font-medium px-2 md:px-2.5 py-0.5 rounded-full bg-[#fff3e0] text-[#c17800] whitespace-nowrap">Pending</span>
            </div>
            <div className="bg-surface rounded-lg p-3 mb-3">
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-1">Applied slot</div>
              <div className="text-xs md:text-sm font-semibold">Trees — Lowest Common Ancestor</div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">Session #36 · Thu Mar 20 · 7:00 PM · 45 min</div>
            </div>
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text2 mb-3">
              <span>Stake at risk if approved & no-show</span>
              <span className="text-primary font-semibold">150 pts</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => onNavigate('feed')}>View goal</Button>
              <Button size="sm" className="bg-red-bg text-red border border-red/20 hover:bg-red-bg/80 text-xs">Withdraw</Button>
            </div>
          </div>

          {/* Pending Application 2 */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-5 md:mb-6 border-l-[3px] border-l-[#c17800]">
            <div className="flex items-start sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 md:w-10 h-9 md:h-10 rounded-full av-green flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0">NS</div>
                <div>
                  <div className="text-sm font-semibold">Neha Sharma&apos;s goal</div>
                  <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-0.5">Applied 3h ago</div>
                </div>
              </div>
              <span className="text-[10px] md:text-[11px] font-mono font-medium px-2 md:px-2.5 py-0.5 rounded-full bg-[#fff3e0] text-[#c17800] whitespace-nowrap">Pending</span>
            </div>
            <div className="bg-surface rounded-lg p-3 mb-3">
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-1">Applied slot</div>
              <div className="text-xs md:text-sm font-semibold">Design Twitter Feed</div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">Session #11 · Sat Mar 22 · 5:00 PM · 75 min</div>
            </div>
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text2 mb-3">
              <span>Stake at risk if approved & no-show</span>
              <span className="text-primary font-semibold">180 pts</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => onNavigate('feed')}>View goal</Button>
              <Button size="sm" className="bg-red-bg text-red border border-red/20 hover:bg-red-bg/80 text-xs">Withdraw</Button>
            </div>
          </div>

          {/* Approved - Upcoming */}
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-base md:text-[17px]">Approved — upcoming</div>
            <span className="badge-green text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full">1 confirmed</span>
          </div>

          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 border-l-[3px] border-l-green">
            <div className="flex items-start sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 md:w-10 h-9 md:h-10 rounded-full av-orange flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0">AM</div>
                <div>
                  <div className="text-sm font-semibold">Aditya Mehta&apos;s goal</div>
                  <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-0.5">Approved yesterday</div>
                </div>
              </div>
              <span className="badge-green text-[10px] md:text-[11px] font-mono font-medium px-2 md:px-2.5 py-0.5 rounded-full">Approved</span>
            </div>
            <div className="bg-green-bg rounded-lg p-3 mb-3">
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-1">Your confirmed slot</div>
              <div className="text-xs md:text-sm font-semibold">Conflict Resolution — STAR method</div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">Session #6 · Tue Mar 25 · 7:00 PM · 30 min</div>
            </div>
            <div className="bg-red-bg rounded-lg px-3 py-2 md:py-2.5 mb-3 text-[11px] md:text-xs text-red">
              You staked <strong>80 pts</strong>. No-show = you lose them.
            </div>
            <Button className="w-full" size="sm" onClick={() => onNavigate('session')}>Join session</Button>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Past Applications */}
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-base md:text-[17px]">Past applications</div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <div className="bg-card border border-border rounded-xl p-3 md:p-4 opacity-80">
              <div className="flex items-start sm:items-center justify-between gap-2 mb-2">
                <div className="text-xs md:text-[13px] font-semibold">Graphs — BFS (Priya&apos;s goal)</div>
                <span className="badge-green text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">Completed</span>
              </div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3">Mar 15 · 60 min · <span className="text-green">+18 pts earned</span></div>
              <div className="font-mono text-[10px] md:text-[11px] text-text2 mt-1">Rated 5/5 — &quot;Excellent, came prepared&quot;</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-3 md:p-4 opacity-80">
              <div className="flex items-start sm:items-center justify-between gap-2 mb-2">
                <div className="text-xs md:text-[13px] font-semibold">URL Shortener (Rahul&apos;s goal)</div>
                <span className="badge-green text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">Completed</span>
              </div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3">Mar 10 · 75 min · <span className="text-green">+15 pts earned</span></div>
              <div className="font-mono text-[10px] md:text-[11px] text-text2 mt-1">Rated 4/5 — &quot;Good depth, push harder on edge cases&quot;</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-3 md:p-4 opacity-55">
              <div className="flex items-start sm:items-center justify-between gap-2 mb-2">
                <div className="text-xs md:text-[13px] font-semibold">DP — Knapsack (Sneha&apos;s goal)</div>
                <span className="badge-red text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">Rejected</span>
              </div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3">Applied Mar 8 · Another applicant was chosen</div>
            </div>
          </div>

          {/* Trust Score Card */}
          <div className="bg-ink rounded-[20px] p-5 md:p-6">
            <div className="font-mono text-[10px] text-white/40 tracking-wider uppercase mb-2 md:mb-3">Trust score</div>
            <div className="font-display font-extrabold text-[36px] md:text-[42px] text-green tracking-tight leading-none">780</div>
            <div className="text-xs text-white/40 mt-1 mb-3 md:mb-4">+33 pts this month</div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Sessions completed</span>
                <span className="text-green font-mono">+33</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Missed this month</span>
                <span className="text-red font-mono">-0</span>
              </div>
            </div>
            <div className="h-px bg-white/10 my-3 md:my-4" />
            <Button variant="outline" className="w-full text-white/60 border-white/15 hover:bg-white/5" size="sm" onClick={() => onNavigate('feed')}>
              Browse more open slots
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
