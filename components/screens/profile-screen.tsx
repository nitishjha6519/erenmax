"use client"

import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

export function ProfileScreen() {
  return (
    <div className="animate-fade-up">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">Your public profile</div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-5 md:mb-8">
        Arjun <span className="text-primary">Kumar</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 max-w-[960px]">
        {/* Left Column */}
        <div>
          {/* Identity Card */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 md:mb-5">
              <div className="relative self-start">
                <div className="w-12 md:w-14 h-12 md:h-14 rounded-full av-orange flex items-center justify-center font-display font-extrabold text-base md:text-lg">AK</div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center text-[10px] text-white cursor-pointer">✎</div>
              </div>
              <div className="flex-1">
                <div className="font-display font-extrabold text-lg md:text-xl">Arjun Kumar</div>
                <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">Hyderabad · 3 YOE · Full Stack Engineer</div>
              </div>
              <Button variant="outline" size="sm" className="self-start sm:self-center">Edit profile</Button>
            </div>
            <div className="h-px bg-border my-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-2 text-center">
              <div>
                <div className="font-display font-extrabold text-xl md:text-[28px] text-green tracking-tight">780</div>
                <div className="font-mono text-[10px] md:text-xs text-text3">trust score</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">34</div>
                <div className="font-mono text-[10px] md:text-xs text-text3">helped others</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">96%</div>
                <div className="font-mono text-[10px] md:text-xs text-text3">show-up</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">4.7</div>
                <div className="font-mono text-[10px] md:text-xs text-text3">avg rating</div>
              </div>
            </div>
          </div>

          {/* Active Goal */}
          <div className="bg-card border border-primary rounded-[20px] p-4 md:p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-display font-bold text-sm">Active goal</div>
              <span className="badge-green text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full">In progress</span>
            </div>
            <div className="font-display font-bold text-sm md:text-base mb-1.5">FAANG DSA Grind</div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-3">Started Mar 1 · Targeting Google L4</div>
            <div className="flex gap-2 flex-wrap mb-3.5">
              <span className="badge-dsa text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">DSA</span>
              <span className="badge-design text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">System Design</span>
              <span className="badge-behavioral text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">Behavioral</span>
            </div>
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text2 mb-2">
              <span>Progress</span>
              <span>34 / 100 reps</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '34%' }} />
            </div>
          </div>

          {/* Topics I can help with */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-4">
            <div className="font-display font-bold text-sm mb-1">Topics I can help with</div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-3">Visible to anyone browsing open goals. People looking for helpers on these topics will see you first.</div>
            <div className="flex gap-2 flex-wrap mb-4">
              {['Arrays & Strings', 'Trees & Graphs', 'System Design', 'Dynamic Programming', 'Behavioral', 'Binary Search'].map((topic, i) => (
                <button
                  key={topic}
                  className={cn(
                    "font-mono text-[10px] md:text-xs font-medium px-3 md:px-4 py-1.5 rounded-full border-[1.5px] border-border bg-card text-text2 cursor-pointer transition-all",
                    i < 3 && "border-primary text-primary bg-[#fff5f2]"
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">About me</label>
              <textarea 
                className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none resize-none"
                rows={3}
                defaultValue="Strong in DSA and system design. 3 YOE at a mid-size startup. Available evenings IST. I give direct, specific feedback — not just validation."
              />
            </div>
          </div>

          {/* Availability */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-5">
            <div className="font-display font-bold text-sm mb-4">Availability</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Preferred time</label>
                <select className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none cursor-pointer">
                  <option>Evenings (6–10 PM IST)</option>
                  <option>Mornings (7–9 AM IST)</option>
                  <option>Weekends only</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Timezone</label>
                <select className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none cursor-pointer">
                  <option>IST (UTC+5:30)</option>
                  <option>PST (UTC-8)</option>
                  <option>EST (UTC-5)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Trust Score Visual */}
          <div className="bg-ink rounded-[20px] p-4 md:p-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-center sm:text-left">
                <div className="font-display font-extrabold text-4xl md:text-5xl text-green tracking-tight leading-none">780</div>
                <div className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-wider">Trust score</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/50">Sessions completed</span>
                  <span className="text-green font-mono">+340</span>
                </div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/50">Feedback quality</span>
                  <span className="text-green font-mono">+120</span>
                </div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/50">Streak bonuses</span>
                  <span className="text-green font-mono">+45</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Missed sessions</span>
                  <span className="text-red font-mono">-25</span>
                </div>
              </div>
            </div>
            <div className="h-px bg-white/10 my-3.5" />
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green" />
              <span className="text-xs text-white/60">750+ · Highly reliable · Shown first in open slots</span>
            </div>
          </div>

          {/* Reviews Received */}
          <div className="font-display font-bold text-sm mb-3 md:mb-4">Reviews received</div>
          <div className="flex flex-col gap-2.5 mb-5 md:mb-6">
            {[
              { initials: 'RK', name: 'Rahul Krishnan', topic: 'Trees: BFS/DFS · Mar 17', rating: 5, review: 'Shows up on time, every time. Feedback is sharp and specific — not just \'good job\'. Best helper I\'ve had.', color: 'av-purple' },
              { initials: 'NS', name: 'Neha Sharma', topic: 'URL Shortener · Mar 10', rating: 4, review: 'Solid on system design fundamentals. Pushed me on trade-offs but could go deeper on failure scenarios.', color: 'av-green' },
              { initials: 'PV', name: 'Priya Venkat', topic: 'Graphs: BFS · Mar 5', rating: 5, review: 'Came very well prepared. Walked through 3 different approaches before settling on optimal. Would pick him again.', color: 'av-blue' },
            ].map((r) => (
              <div key={r.name} className="bg-card border border-border rounded-xl p-3 md:p-4">
                <div className="flex items-start gap-2.5 mb-2.5">
                  <div className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${r.color} flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0`}>
                    {r.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-0.5">{r.topic}</div>
                  </div>
                  <div className="text-xs md:text-sm text-[#c17800]">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                </div>
                <p className="text-xs md:text-sm text-text2">&quot;{r.review}&quot;</p>
              </div>
            ))}
          </div>

          {/* Sessions I've helped with */}
          <div className="font-display font-bold text-sm mb-3">Sessions I&apos;ve helped with</div>
          <div className="flex flex-col gap-1.5">
            {[
              { topic: 'Trees — BFS & DFS', goal: "Rahul's goal", date: 'Mar 17 · 60 min', badge: 'DSA', points: '+18 pts' },
              { topic: 'Design URL Shortener', goal: "Neha's goal", date: 'Mar 10 · 75 min', badge: 'Design', points: '+15 pts' },
              { topic: 'Graphs — BFS Shortest Path', goal: "Priya's goal", date: 'Mar 5 · 60 min', badge: 'DSA', points: '+15 pts' },
            ].map((s) => (
              <div key={s.topic} className="bg-surface rounded-xl p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <div className="text-xs md:text-[13px] font-medium">{s.topic}</div>
                    <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">{s.goal} · {s.date}</div>
                  </div>
                  <span className={`${s.badge === 'DSA' ? 'badge-dsa' : 'badge-design'} text-[10px] font-mono font-medium px-2 py-0.5 rounded-full self-start sm:self-center`}>{s.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
