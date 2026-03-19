"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from '@/lib/auth-context'

interface AuthScreenProps {
  onNavigate: (screen: string) => void
}

export function LoginScreen({ onNavigate }: AuthScreenProps) {
  const { login } = useAuth()

  const handleLogin = () => {
    login()
    onNavigate('dashboard')
  }

  return (
    <div className="animate-fade-up max-w-[420px] mx-auto mt-6 md:mt-10 px-4 md:px-0">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">Welcome back</div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-2">
        Log <span className="text-primary">in</span>
      </h1>
      <p className="text-xs md:text-sm text-text2 mb-5 md:mb-7">Your trust score and goal are waiting.</p>

      <div className="bg-card border border-border rounded-[20px] p-5 md:p-6">
        <div className="mb-4 md:mb-5">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Email</label>
          <input 
            type="email"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
            placeholder="arjun@gmail.com"
          />
        </div>
        <div className="mb-5 md:mb-6">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Password</label>
          <input 
            type="password"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
            placeholder="••••••••"
          />
        </div>
        <Button className="w-full h-11 md:h-12 text-sm md:text-base" onClick={handleLogin}>Log in</Button>
        <div className="h-px bg-border my-4 md:my-5" />
        <Button variant="outline" className="w-full gap-2.5 text-[13px]">
          Continue with Google
        </Button>
        <p className="text-center text-xs md:text-[13px] text-text3 mt-4">
          No account? <span className="text-primary cursor-pointer" onClick={() => onNavigate('signup')}>Sign up free</span>
        </p>
      </div>
    </div>
  )
}

export function SignupScreen({ onNavigate }: AuthScreenProps) {
  const { login } = useAuth()

  const handleSignup = () => {
    login()
    onNavigate('dashboard')
  }

  return (
    <div className="animate-fade-up max-w-[460px] mx-auto mt-6 md:mt-10 px-4 md:px-0">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">Get started</div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-2">
        Create your <span className="text-primary">account</span>
      </h1>
      <p className="text-xs md:text-sm text-text2 mb-5 md:mb-7">You start with 500 trust points. Build from there.</p>

      <div className="bg-card border border-border rounded-[20px] p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">First name</label>
            <input 
              className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
              placeholder="Arjun"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Last name</label>
            <input 
              className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
              placeholder="Kumar"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Email</label>
          <input 
            type="email"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
            placeholder="arjun@gmail.com"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Password</label>
          <input 
            type="password"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
            placeholder="Min 8 characters"
          />
        </div>
        <div className="mb-4 md:mb-5">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">Years of experience</label>
          <select className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none cursor-pointer">
            <option>0–1 years (fresher)</option>
            <option>2–4 years</option>
            <option>5–8 years</option>
            <option>8+ years</option>
          </select>
        </div>
        <div className="bg-surface rounded-lg px-4 py-3 md:py-3.5 mb-4 md:mb-5 flex items-center gap-3">
          <div className="font-display font-extrabold text-2xl md:text-[28px] text-green">500</div>
          <div>
            <div className="text-xs md:text-[13px] font-semibold">Starting trust score</div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-0.5">Show up and it grows. No-show and it drops.</div>
          </div>
        </div>
        <Button className="w-full h-11 md:h-12 text-sm md:text-base" onClick={handleSignup}>Create account</Button>
        <div className="h-px bg-border my-4 md:my-5" />
        <Button variant="outline" className="w-full gap-2.5 text-[13px]">
          Continue with Google
        </Button>
        <p className="text-center text-xs md:text-[13px] text-text3 mt-4">
          Have an account? <span className="text-primary cursor-pointer" onClick={() => onNavigate('login')}>Log in</span>
        </p>
      </div>
    </div>
  )
}
