"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

interface DashboardScreenProps {
  onNavigate: (screen: string) => void
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddTopicModal, setShowAddTopicModal] = useState(false)

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <div className="bg-ink rounded-[20px] px-5 md:px-10 py-6 md:py-9 mb-5 md:mb-6 relative overflow-hidden">
        <div className="absolute right-4 md:right-8 -top-2.5 font-display text-[80px] md:text-[120px] font-extrabold text-white/5 leading-none tracking-tight pointer-events-none">100</div>
        <div className="font-display font-extrabold text-xl md:text-[28px] text-white tracking-tight mb-1 relative z-10">Welcome back, Arjun</div>
        <div className="text-xs md:text-sm text-white/50 mb-4 md:mb-6 relative z-10">You&apos;re 34 reps into your FAANG goal. Keep the streak alive.</div>
        <div className="grid grid-cols-2 sm:flex gap-4 md:gap-8 relative z-10">
          <div>
            <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">34</div>
            <div className="font-mono text-[10px] md:text-xs text-white/40">reps done</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">66</div>
            <div className="font-mono text-[10px] md:text-xs text-white/40">reps to go</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">780</div>
            <div className="font-mono text-[10px] md:text-xs text-white/40">trust score</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-2xl md:text-[32px] text-white tracking-tight">14</div>
            <div className="font-mono text-[10px] md:text-xs text-white/40">day streak</div>
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="flex md:hidden gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'sessions', label: 'Sessions' },
          { key: 'partners', label: 'Partners' },
          { key: 'score', label: 'Trust' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap",
              activeTab === tab.key ? "bg-ink text-white" : "bg-surface text-text2"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-5 md:gap-6">
        {/* Sidebar - Desktop only */}
        <div className="hidden md:block">
          <div className="bg-ink rounded-[20px] p-4 sticky top-24">
            {[
              { key: 'overview', icon: '◼', label: 'Overview' },
              { key: 'sessions', icon: '◷', label: 'Sessions' },
              { key: 'partners', icon: '◎', label: 'My Partners' },
              { key: 'score', icon: '▲', label: 'Trust Score' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/55 text-sm font-medium cursor-pointer transition-all hover:text-white hover:bg-white/5 mb-0.5",
                  activeTab === tab.key && "text-white bg-white/10"
                )}
              >
                <span className="text-base w-5 text-center">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <div className="h-px bg-white/10 my-3" />
            <Button className="w-full" size="sm" onClick={() => onNavigate('post')}>
              + Post new goal
            </Button>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab onNavigate={onNavigate} setActiveTab={setActiveTab} />}
          {activeTab === 'sessions' && <SessionsTab onNavigate={onNavigate} setShowAddTopicModal={setShowAddTopicModal} setActiveTab={setActiveTab} />}
          {activeTab === 'partners' && <PartnersTab />}
          {activeTab === 'score' && <TrustScoreTab />}
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={() => setShowAddTopicModal(false)}>
          <div className="bg-card rounded-t-[20px] md:rounded-[20px] p-6 md:p-8 w-full md:w-[480px] md:max-w-[90vw] animate-fade-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="font-display font-extrabold text-lg md:text-[22px] mb-1">Add a topic</div>
            <div className="text-xs md:text-sm text-text2 mb-5 md:mb-6">Creates an open slot. The community sees it and applies to help you.</div>
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Category</label>
              <div className="flex flex-wrap gap-2">
                {['DSA', 'System Design', 'Behavioral'].map((type) => (
                  <button key={type} className="font-mono text-xs font-medium px-4 py-1.5 rounded-full border-[1.5px] border-primary text-primary bg-[#fff5f2] cursor-pointer">
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Topic</label>
              <input className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none" placeholder="e.g. Dynamic Programming — Knapsack" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Date & time</label>
                <input type="datetime-local" className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Duration</label>
                <select className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none cursor-pointer">
                  <option>30 mins</option>
                  <option>45 mins</option>
                  <option>60 mins</option>
                  <option>90 mins</option>
                </select>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Approval deadline</label>
              <select className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-[15px] bg-card focus:border-primary outline-none cursor-pointer">
                <option>2h before</option>
                <option>6h before</option>
                <option>12h before</option>
                <option>24h before</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddTopicModal(false)}>Cancel</Button>
              <Button className="flex-[2]" onClick={() => setShowAddTopicModal(false)}>Post to community</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OverviewTab({ onNavigate, setActiveTab }: { onNavigate: (screen: string) => void, setActiveTab: (tab: string) => void }) {
  return (
    <div>
      {/* Active Goal */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">Active goal</div>
      </div>
      <div className="bg-card border border-border rounded-[20px] p-4 md:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="font-display font-bold text-base md:text-[17px]">FAANG DSA Grind</div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">Interview prep · DSA, System Design, Behavioral</div>
          </div>
          <span className="badge-green text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full self-start">Active</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5 mb-4">
          <div className="w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center relative flex-shrink-0 mx-auto sm:mx-0" style={{ background: 'conic-gradient(var(--accent) 34%, var(--surface3) 0)' }}>
            <div className="absolute w-12 md:w-16 h-12 md:h-16 rounded-full bg-card" />
            <span className="font-display font-extrabold text-sm md:text-base z-10">34</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="font-mono text-[10px] md:text-[11px] text-text3">Progress to 100 reps</span>
              <span className="font-mono text-[10px] md:text-[11px] text-text3">34%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '34%' }} />
            </div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-2">~9 weeks remaining at current pace</div>
          </div>
        </div>
        <div className="h-px bg-border my-4" />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button size="sm" className="w-full sm:w-auto" onClick={() => onNavigate('session')}>Start today&apos;s session</Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setActiveTab('sessions')}>View roadmap</Button>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">Upcoming sessions</div>
        <button className="font-mono text-xs text-primary cursor-pointer" onClick={() => setActiveTab('sessions')}>View all</button>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <div className="bg-card border border-border rounded-xl px-4 md:px-5 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="font-mono text-xs text-text2 sm:min-w-[60px]">Today · 6:00 PM</div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Trees — BFS & DFS</div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">Session #35 · with Rahul Krishnan</div>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span className="badge-dsa text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full">DSA</span>
            <Button size="sm" onClick={() => onNavigate('session')}>Join</Button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 md:px-5 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="font-mono text-xs text-text2 sm:min-w-[60px]">Thu · 7:00 PM</div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Trees — Lowest Common Ancestor</div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">Session #36 · Priya applied — <span className="text-[#c17800]">approval pending</span></div>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span className="badge-dsa text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full">DSA</span>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('score')}>Review</Button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">Recent activity</div>
      </div>
      <div className="flex flex-col">
        {[
          { icon: '✓', bg: 'bg-green-bg', title: 'Session #34 completed — Binary Search', sub: 'Yesterday · Rahul rated you 5/5 ·', change: '+12 pts', up: true },
          { icon: '⟡', bg: 'bg-[#fff0e8]', title: 'Priya Venkat applied to Session #36', sub: '1h ago · Trees: LCA', action: 'Review application' },
          { icon: '★', bg: 'bg-blue-bg', title: '14-day streak reached', sub: '2 days ago ·', change: '+25 pts bonus', up: true },
        ].map((item, i) => (
          <div key={i} className="flex gap-3 py-3 md:py-3.5 border-b border-border/50 last:border-b-0">
            <div className={`w-8 md:w-9 h-8 md:h-9 rounded-xl ${item.bg} flex items-center justify-center text-sm md:text-base flex-shrink-0`}>{item.icon}</div>
            <div>
              <div className="text-sm font-medium">{item.title}</div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">
                {item.sub}
                {item.change && <span className={item.up ? 'text-green' : 'text-red'}> {item.change}</span>}
                {item.action && <span className="text-primary cursor-pointer" onClick={() => setActiveTab('score')}> {item.action}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SessionsTab({ onNavigate, setShowAddTopicModal, setActiveTab }: { onNavigate: (screen: string) => void, setShowAddTopicModal: (show: boolean) => void, setActiveTab: (tab: string) => void }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">Your 100-rep roadmap</div>
        <Button size="sm" onClick={() => setShowAddTopicModal(true)}>+ Add topic</Button>
      </div>
      <div className="text-xs md:text-sm text-text2 mb-4">Each topic is one session slot. Add up to 100. The community applies to help you — you approve who shows up.</div>

      {/* DSA Section */}
      <div className="flex items-center gap-2.5 py-1.5 mb-2 border-b border-border/50">
        <span className="font-mono text-[11px] font-medium text-blue">DSA</span>
        <div className="flex-1 h-0.5 bg-surface3 rounded overflow-hidden">
          <div className="h-full w-[62%] bg-blue rounded" />
        </div>
        <span className="font-mono text-[10px] md:text-[11px] text-text3">21 / 34 done</span>
      </div>
      <div className="flex flex-col gap-1.5 mb-4">
        <SessionCard done topic="Arrays — Two Pointer" subtitle="Mar 1 · Rahul Krishnan" badge="DSA" points="+12" />
        <SessionCard done topic="Arrays — Sliding Window" subtitle="Mar 3 · Neha Venkat" badge="DSA" points="+10" />
        <SessionCard live topic="Trees — BFS & DFS" subtitle="Session #35 · Rahul Krishnan" badge="DSA" onJoin={() => onNavigate('session')} />
        <SessionCard pending topic="Trees — Lowest Common Ancestor" subtitle="Session #36 · Priya applied — expires in 4h" time="Thu 7 PM" onReview={() => setActiveTab('score')} />
        <SessionCard open topic="Graphs — BFS Shortest Path" subtitle="Session #37 · Fri Mar 21 · No applicants yet" badge="DSA" />
        <AddTopicButton label="Add DSA topic — Graphs, DP, Backtracking, Heaps..." onClick={() => setShowAddTopicModal(true)} />
      </div>

      {/* System Design Section */}
      <div className="flex items-center gap-2.5 py-1.5 mb-2 border-b border-border/50">
        <span className="font-mono text-[11px] font-medium text-[#6b34d6]">System Design</span>
        <div className="flex-1 h-0.5 bg-surface3 rounded overflow-hidden">
          <div className="h-full w-[30%] bg-[#6b34d6] rounded" />
        </div>
        <span className="font-mono text-[10px] md:text-[11px] text-text3">9 / 30 done</span>
      </div>
      <div className="flex flex-col gap-1.5 mb-4">
        <SessionCard done topic="Design a URL Shortener" subtitle="Mar 5 · Aditya Mehta" badge="Design" points="+15" />
        <SessionCard pending topic="Design Twitter Feed" subtitle="Session #11 · 2 applicants — expires in 8h" time="Sat 5 PM" onReview={() => setActiveTab('score')} />
        <SessionCard open topic="Design a Rate Limiter" subtitle="Session #12 · Mon Mar 24 · No applicants yet" badge="Design" />
        <AddTopicButton label="Add System Design topic — Chat app, CDN, Search engine..." onClick={() => setShowAddTopicModal(true)} />
      </div>

      {/* Behavioral Section */}
      <div className="flex items-center gap-2.5 py-1.5 mb-2 border-b border-border/50">
        <span className="font-mono text-[11px] font-medium text-[#c17800]">Behavioral</span>
        <div className="flex-1 h-0.5 bg-surface3 rounded overflow-hidden">
          <div className="h-full w-[11%] bg-[#c17800] rounded" />
        </div>
        <span className="font-mono text-[10px] md:text-[11px] text-text3">4 / 36 done</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <SessionCard done topic="Leadership & Ownership stories" subtitle="Mar 8 · Sana Khan" badge="Behavioral" points="+8" />
        <SessionCard open topic="Conflict Resolution — STAR method" subtitle="Session #6 · Tue Mar 25 · No applicants yet" badge="Behavioral" />
        <AddTopicButton label="Add Behavioral topic — Failure, Teamwork, Growth mindset..." onClick={() => setShowAddTopicModal(true)} />
      </div>
    </div>
  )
}

function SessionCard({ done, live, pending, open, topic, subtitle, badge, points, time, onJoin, onReview }: { done?: boolean, live?: boolean, pending?: boolean, open?: boolean, topic: string, subtitle: string, badge?: string, points?: string, time?: string, onJoin?: () => void, onReview?: () => void }) {
  const badgeClass = badge === 'DSA' ? 'badge-dsa' : badge === 'Design' ? 'badge-design' : 'badge-behavioral'
  
  return (
    <div className={cn(
      "bg-card border border-border rounded-xl px-3 md:px-5 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4",
      done && "opacity-50",
      live && "border-[1.5px] border-primary",
      pending && "border-[#c17800] bg-[#fffbf2]"
    )}>
      <div className={cn(
        "font-mono text-xs sm:min-w-[60px]",
        done && "text-green",
        pending && "text-[#c17800]",
        open && "text-red"
      )}>
        {done ? '✓' : live ? 'Today 6 PM' : pending ? time : 'Open'}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm">
          {topic}
          {live && <span className="badge-green text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ml-1.5">Live</span>}
        </div>
        <div className={cn("font-mono text-[10px] md:text-[11px] mt-1", pending ? "text-[#c17800]" : "text-text3")}>{subtitle}</div>
      </div>
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        {done && badge && (
          <>
            <span className={`${badgeClass} text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full`}>{badge}</span>
            {points && <span className="font-mono text-[13px] font-medium text-green">{points}</span>}
          </>
        )}
        {live && <Button size="sm" onClick={onJoin}>Join</Button>}
        {pending && <Button size="sm" className="bg-[#fff3e0] text-[#c17800] border border-[#c17800] hover:bg-[#fff3e0]/80" onClick={onReview}>Review</Button>}
        {open && badge && <span className={`${badgeClass} text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full`}>{badge}</span>}
      </div>
    </div>
  )
}

function AddTopicButton({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-2 px-3.5 py-2.5 border-[1.5px] border-dashed border-border rounded-xl cursor-pointer transition-colors hover:border-primary"
    >
      <span className="text-base text-text3">+</span>
      <span className="font-mono text-[10px] md:text-xs text-text3">{label}</span>
    </div>
  )
}

function PartnersTab() {
  const partners = [
    { initials: 'RK', name: 'Rahul Krishnan', sessions: 9, topics: 'DSA — Arrays, Strings, Trees (today)', badges: ['Arrays', 'Strings', 'Trees'], trust: 892, color: 'av-purple' },
    { initials: 'NV', name: 'Neha Venkat', sessions: 5, topics: 'DSA + System Design', badges: ['Sliding Window', 'URL Shortener'], trust: 741, color: 'av-green' },
    { initials: 'AM', name: 'Aditya Mehta', sessions: 3, topics: 'System Design', badges: ['URL Shortener', 'Twitter Feed (upcoming)'], trust: 761, color: 'av-blue' },
    { initials: 'SK', name: 'Sana Khan', sessions: 2, topics: 'Behavioral', badges: ['Leadership', 'Ownership'], trust: 698, color: 'av-orange' },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">My Partners</div>
        <span className="font-mono text-[10px] md:text-[11px] text-text3">12 people have helped on your goal</span>
      </div>
      <div className="flex flex-col gap-2">
        {partners.map((p) => (
          <div key={p.name} className="bg-card border border-border rounded-xl p-3 md:p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${p.color} flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0`}>
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">{p.sessions} sessions · {p.topics}</div>
                <div className="flex gap-1 md:gap-1.5 mt-2 flex-wrap">
                  {p.badges.map((b) => (
                    <span key={b} className="badge-dsa text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
              </div>
              <div className={`flex items-center gap-1 md:gap-1.5 font-display font-extrabold text-base md:text-lg ${p.trust >= 750 ? 'trust-high' : 'trust-mid'}`}>
                <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${p.trust >= 750 ? 'bg-green' : 'bg-[#c17800]'}`} />
                {p.trust}
              </div>
            </div>
          </div>
        ))}
        {/* Pending */}
        <div className="bg-card border border-[#c17800] bg-[#fffbf2] rounded-xl p-3 md:p-4 cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-[#fff3e0] text-[#c17800] flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0">PV</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">
                Priya Venkat 
                <span className="badge text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#fff3e0] text-[#c17800] ml-1.5">Pending</span>
              </div>
              <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">Applied for Session #36 · Trees: LCA · Thu 7 PM</div>
              <div className="flex gap-1.5 mt-2">
                <span className="badge-dsa text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">Trees: LCA — awaiting</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-display font-extrabold text-base md:text-lg trust-high">
              <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-green" />
              834
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TrustScoreTab() {
  return (
    <div>
      {/* Trust Score Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">Trust score</div>
      </div>
      <div className="bg-card border border-border rounded-[20px] p-4 md:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-center sm:text-left">
            <div className="font-display font-extrabold text-4xl md:text-5xl text-green tracking-tight">780</div>
            <div className="font-mono text-[10px] md:text-xs text-text3 mt-1">your score</div>
          </div>
          <div className="flex-1">
            <div className="text-xs md:text-sm text-text2 mb-2">Score breakdown</div>
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text3 mb-2">
              <span>Sessions completed</span>
              <span className="text-green">+340</span>
            </div>
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text3 mb-2">
              <span>Quality feedback given</span>
              <span className="text-green">+120</span>
            </div>
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text3 mb-2">
              <span>Streak bonuses</span>
              <span className="text-green">+45</span>
            </div>
            <div className="flex justify-between font-mono text-[10px] md:text-[11px] text-text3">
              <span>Missed sessions (2x)</span>
              <span className="text-red">-50</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-surface rounded-[20px] p-4 md:p-5 mb-6">
        <div className="font-mono text-[11px] text-text3 mb-3">Score tiers</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green" /><span className="text-xs md:text-sm"><strong>750+</strong> — Highly reliable, shown first in open slots</span></div>
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#c17800]" /><span className="text-xs md:text-sm"><strong>500–749</strong> — Reliable. Occasionally missed sessions.</span></div>
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red" /><span className="text-xs md:text-sm"><strong>Below 500</strong> — Risky. Shown last in feed.</span></div>
        </div>
      </div>

      {/* Pending Applicants */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="font-display font-bold text-base md:text-[17px]">Pending applicants</div>
        <span className="badge-red text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full self-start">3 waiting</span>
      </div>
      <div className="text-xs md:text-sm text-text2 mb-4">People who applied to help with a specific session. Approve one per slot before the deadline — unanswered slots re-open to the community.</div>

      {/* Session #36 */}
      <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-2 px-2 md:px-3 py-1.5 bg-surface2 rounded-md inline-block">
        Session #36 — Trees: LCA · Thu 7:00 PM · <span className="text-red">expires in 4h</span>
      </div>
      <ApplicantCard 
        initials="PV" 
        name="Priya Venkat" 
        trust={834} 
        showUp="100%" 
        sessions={28}
        message="Strong in trees — helped 4 people on LCA. Will walk through recursive and iterative approaches and push on edge cases."
        urgent
        color="av-blue"
      />

      {/* Session #11 */}
      <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-4 mb-2 px-2 md:px-3 py-1.5 bg-surface2 rounded-md inline-block">
        Session #11 — System Design: Twitter Feed · Sat 5:00 PM · 2 applicants · <span className="text-red">expires in 8h</span>
      </div>
      <ApplicantCard 
        initials="AM" 
        name="Aditya Mehta" 
        trust={761} 
        showUp="95%" 
        sessions={19}
        message="Designed feed ranking at work. Will challenge you on fanout, cache invalidation, and pagination. Expect hard follow-ups."
        color="av-orange"
      />
      <ApplicantCard 
        initials="MK" 
        name="Meera K" 
        trust={612} 
        showUp="87%" 
        sessions={8}
        message="Learning system design myself — teaching it reinforces my own understanding. Will prepare thoroughly."
        color="av-green"
      />
    </div>
  )
}

function ApplicantCard({ initials, name, trust, showUp, sessions, message, urgent, color }: { initials: string, name: string, trust: number, showUp: string, sessions: number, message: string, urgent?: boolean, color: string }) {
  return (
    <div className={cn("bg-card border rounded-[20px] p-4 md:p-5 mb-2", urgent ? "border-[#c17800]" : "border-border")}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 md:w-10 h-9 md:h-10 rounded-full ${color} flex items-center justify-center font-display font-extrabold text-xs md:text-sm flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">{name}</div>
          <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">Applied 1h ago · {trust} trust · {showUp} show-up · {sessions} sessions</div>
        </div>
        <div className={`flex items-center gap-1 md:gap-1.5 font-display font-extrabold text-base md:text-lg ${trust >= 750 ? 'trust-high' : 'trust-mid'}`}>
          <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${trust >= 750 ? 'bg-green' : 'bg-[#c17800]'}`} />
          {trust}
        </div>
      </div>
      <div className="bg-surface rounded-lg p-3 mb-3">
        <div className="font-mono text-[10px] md:text-[11px] text-text3 mb-1">Message</div>
        <div className="text-xs md:text-sm italic">&quot;{message}&quot;</div>
      </div>
      {urgent && <div className="font-mono text-[10px] md:text-[11px] text-red mb-3">You must respond within 4h or slot re-opens</div>}
      <div className="flex gap-2">
        <Button className="flex-[2] text-sm">Approve {name.split(' ')[0]}</Button>
        <Button variant="outline" className="flex-1 text-sm">Reject</Button>
      </div>
    </div>
  )
}
