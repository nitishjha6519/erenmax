"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import type { UserStats, Session } from '@/lib/api'

export function ProfileScreen() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats|null>(null)
  const [helpedSessions, setHelpedSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    Promise.all([
      api.users.getMyStats(),
      api.sessions.getMySessions({ role:'partner', type:'all', limit:10 }),
    ]).then(([s,sess])=>{
      setStats(s.stats)
      setHelpedSessions(sess.sessions)
    }).catch(console.error).finally(()=>setLoading(false))
  },[])

  useEffect(()=>{ if(user?.bio) setBio(user.bio) },[user])

  const saveProfile = async()=>{
    setSaving(true)
    try { await api.users.updateProfile({ bio }) } catch(e){ console.error(e) } finally { setSaving(false); setEditing(false) }
  }

  const initials = user?.initials ?? '??'
  const name = user?.name ?? '—'
  const firstName = name.split(' ')[0]
  const lastName = name.split(' ').slice(1).join(' ')
  const location = user?.location ?? ''
  const yoe = user?.yoe
  const showUpPct = stats?.showUpRate!=null ? `${Math.round(stats.showUpRate*100)}%` : '—'
  const avgRating = stats?.avgRating!=null ? stats.avgRating.toFixed(1) : '—'

  function catBadgeClass(c?: string){ const k=(c ?? '').toLowerCase().replace(/\s/g,''); return k==='dsa'?'badge-dsa':k==='systemdesign'?'badge-design':'badge-behavioral'; }
  function catLabel(c?: string){ return ({dsa:'DSA',systemdesign:'System Design',behavioral:'Behavioral'} as Record<string,string>)[(c ?? '').toLowerCase().replace(/\s/g,'')] ?? (c || ''); }
  function formatDate(d: string){ return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'}); }

  return (
    <div className="animate-fade-up">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">Your public profile</div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-5 md:mb-8">
        {firstName} {lastName&&<span className="text-primary">{lastName}</span>}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 max-w-[960px]">
        {/* Left Column */}
        <div>
          {/* Identity Card */}
          <div className="bg-card border border-border rounded-[20px] p-4 md:p-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 md:mb-5">
              <div className="relative self-start">
                <div className="w-12 md:w-14 h-12 md:h-14 rounded-full av-orange flex items-center justify-center font-display font-extrabold text-base md:text-lg">{initials}</div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center text-[10px] text-white cursor-pointer" onClick={()=>setEditing(true)}>✎</div>
              </div>
              <div className="flex-1">
                <div className="font-display font-extrabold text-lg md:text-xl">{name}</div>
                <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">{[location,yoe?`${yoe} YOE`:null].filter(Boolean).join(' · ')}</div>
              </div>
              <Button variant="outline" size="sm" className="self-start sm:self-center" onClick={()=>setEditing(!editing)}>Edit profile</Button>
            </div>
            <div className="h-px bg-border my-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-2 text-center">
              <div><div className="font-display font-extrabold text-xl md:text-[28px] text-green tracking-tight">{stats?.trustScore??500}</div><div className="font-mono text-[10px] md:text-xs text-text3">trust score</div></div>
              <div><div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">{stats?.sessionsCompleted??0}</div><div className="font-mono text-[10px] md:text-xs text-text3">helped others</div></div>
              <div><div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">{showUpPct}</div><div className="font-mono text-[10px] md:text-xs text-text3">show-up</div></div>
              <div><div className="font-display font-extrabold text-xl md:text-[28px] text-ink tracking-tight">{avgRating}</div><div className="font-mono text-[10px] md:text-xs text-text3">avg rating</div></div>
            </div>
          </div>

          {/* Edit bio */}
          {editing&&(
            <div className="bg-card border border-primary rounded-[20px] p-4 md:p-5 mb-4">
              <div className="font-display font-bold text-sm mb-3">Edit profile</div>
              <div className="mb-3">
                <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">About me</label>
                <textarea className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none resize-none" rows={3} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell the community about yourself…"/>
              </div>
              <div className="flex gap-2"><Button variant="outline" size="sm" onClick={()=>setEditing(false)}>Cancel</Button><Button size="sm" onClick={saveProfile} disabled={saving}>{saving?'Saving…':'Save'}</Button></div>
            </div>
          )}

          {/* Bio / About */}
          {!editing&&bio&&(
            <div className="bg-card border border-border rounded-[20px] p-4 md:p-5 mb-4">
              <div className="font-display font-bold text-sm mb-2">About me</div>
              <p className="text-sm text-text2">{bio}</p>
            </div>
          )}

          {/* Trust Score */}
          <div className="bg-ink rounded-[20px] p-4 md:p-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-center sm:text-left">
                <div className="font-display font-extrabold text-4xl md:text-5xl text-green tracking-tight leading-none">{stats?.trustScore??500}</div>
                <div className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-wider">Trust score</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5"><span className="text-white/50">Sessions completed</span><span className="text-green font-mono">{stats?.sessionsCompleted??0}</span></div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-white/50">Show-up rate</span><span className="text-green font-mono">{showUpPct}</span></div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-white/50">Avg rating</span><span className="text-green font-mono">{avgRating}</span></div>
                <div className="flex justify-between text-xs"><span className="text-white/50">Current streak</span><span className="text-green font-mono">{stats?.currentStreak??0} days</span></div>
              </div>
            </div>
            <div className="h-px bg-white/10 my-3.5" />
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green" /><span className="text-xs text-white/60">{(stats?.trustScore??0)>=750?'750+ · Highly reliable · Shown first in open slots':(stats?.trustScore??0)>=500?'500–749 · Reliable. Occasionally missed sessions.':'Below 500 · Risky. Shown last in feed.'}</span></div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Sessions helped */}
          <div className="font-display font-bold text-sm mb-3 md:mb-4">Sessions I&apos;ve helped with</div>
          {loading?(
            <div className="flex flex-col gap-2">{[1,2,3].map(i=>(<div key={i} className="bg-surface rounded-xl p-3 animate-pulse"><div className="h-3 w-3/4 bg-surface3 rounded"/></div>))}</div>
          ):helpedSessions.length===0?(
            <p className="text-sm text-text3 mb-6">No sessions helped yet. Browse the feed to start helping others.</p>
          ):(
            <div className="flex flex-col gap-1.5 mb-5 md:mb-6">
              {helpedSessions.map(s=>(
                <div key={s.id} className="bg-surface rounded-xl p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <div className="text-xs md:text-[13px] font-medium">{s.topic}</div>
                      <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-1">{s.goal?.title?`${s.goal.title} · `:''}{ formatDate(s.scheduledAt ?? s.scheduledDate ?? '')} · {s.duration??60} min</div>
                    </div>
                    <span className={`${catBadgeClass(s.category)} text-[10px] font-mono font-medium px-2 py-0.5 rounded-full self-start sm:self-center`}>{catLabel(s.category)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Score tiers */}
          <div className="bg-surface rounded-[20px] p-4 md:p-5">
            <div className="font-mono text-[11px] text-text3 mb-3">Score tiers</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green"/><span className="text-xs md:text-sm"><strong>750+</strong> — Highly reliable, shown first in open slots</span></div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#c17800]"/><span className="text-xs md:text-sm"><strong>500–749</strong> — Reliable. Occasionally missed sessions.</span></div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red"/><span className="text-xs md:text-sm"><strong>Below 500</strong> — Risky. Shown last in feed.</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
