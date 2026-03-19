"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface AuthScreenProps {
  onNavigate: (screen: string) => void;
}

export function LoginScreen({ onNavigate }: AuthScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      onNavigate("dashboard");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up max-w-[420px] mx-auto mt-6 md:mt-10 px-4 md:px-0">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">
        Welcome back
      </div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-2">
        Log <span className="text-primary">in</span>
      </h1>
      <p className="text-xs md:text-sm text-text2 mb-5 md:mb-7">
        Your trust score and goal are waiting.
      </p>

      <div className="bg-card border border-border rounded-[20px] p-5 md:p-6">
        <div className="mb-4 md:mb-5">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
            placeholder="arjun@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-5 md:mb-6">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
            Password
          </label>
          <input
            type="password"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        {error && <p className="text-[13px] text-red mb-4">{error}</p>}
        <Button
          className="w-full h-11 md:h-12 text-sm md:text-base"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in…" : "Log in"}
        </Button>
        <div className="h-px bg-border my-4 md:my-5" />
        <Button variant="outline" className="w-full gap-2.5 text-[13px]">
          Continue with Google
        </Button>
        <p className="text-center text-xs md:text-[13px] text-text3 mt-4">
          No account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => onNavigate("signup")}
          >
            Sign up free
          </span>
        </p>
      </div>
    </div>
  );
}

export function SignupScreen({ onNavigate }: AuthScreenProps) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      onNavigate("dashboard");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up max-w-[460px] mx-auto mt-6 md:mt-10 px-4 md:px-0">
      <div className="font-mono text-[11px] text-text3 tracking-[0.12em] uppercase mb-1.5">
        Get started
      </div>
      <h1 className="font-display font-extrabold text-2xl md:text-[32px] text-ink tracking-tight mb-2">
        Create your <span className="text-primary">account</span>
      </h1>
      <p className="text-xs md:text-sm text-text2 mb-5 md:mb-7">
        You start with 500 trust points. Build from there.
      </p>

      <div className="bg-card border border-border rounded-[20px] p-5 md:p-6">
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
            Full name
          </label>
          <input
            className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
            placeholder="Arjun Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
            placeholder="arjun@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4 md:mb-5">
          <label className="block text-[13px] font-medium text-text2 mb-1.5 font-mono">
            Password
          </label>
          <input
            type="password"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-border rounded-lg text-sm md:text-[15px] bg-card focus:border-primary outline-none"
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
          />
        </div>
        <div className="bg-surface rounded-lg px-4 py-3 md:py-3.5 mb-4 md:mb-5 flex items-center gap-3">
          <div className="font-display font-extrabold text-2xl md:text-[28px] text-green">
            500
          </div>
          <div>
            <div className="text-xs md:text-[13px] font-semibold">
              Starting trust score
            </div>
            <div className="font-mono text-[10px] md:text-[11px] text-text3 mt-0.5">
              Show up and it grows. No-show and it drops.
            </div>
          </div>
        </div>
        {error && <p className="text-[13px] text-red mb-4">{error}</p>}
        <Button
          className="w-full h-11 md:h-12 text-sm md:text-base"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <div className="h-px bg-border my-4 md:my-5" />
        <Button variant="outline" className="w-full gap-2.5 text-[13px]">
          Continue with Google
        </Button>
        <p className="text-center text-xs md:text-[13px] text-text3 mt-4">
          Have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => onNavigate("login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
