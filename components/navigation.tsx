"use client"

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { Menu, X, Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react'
import { PATH_TO_SCREEN, useNavigate } from '@/lib/routes'

export function Navigation() {
  const { isLoggedIn, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const navigate = useNavigate()
  const currentScreen = PATH_TO_SCREEN[pathname] ?? 'landing'

  const handleNavigate = (screen: string) => {
    navigate(screen)
    setMobileMenuOpen(false)
    setProfileDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 bg-ink flex items-center justify-between px-4 md:px-8 h-14">
        <a 
          href="/"
          onClick={e => { e.preventDefault(); handleNavigate('landing') }}
          className="font-display font-bold text-lg md:text-xl text-white tracking-tight flex items-center gap-2 cursor-pointer no-underline"
        >
          Mock<span className="text-primary">Mate</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {!isLoggedIn ? (
            <>
              <NavLink 
                active={currentScreen === 'landing'} 
                href="/"
                onClick={() => handleNavigate('landing')}
              >
                Home
              </NavLink>
              <NavLink 
                active={currentScreen === 'feed'} 
                href="/feed"
                onClick={() => handleNavigate('feed')}
              >
                Browse goals
              </NavLink>
              <div className="w-px h-5 bg-white/10 mx-2" />
              <NavLink href="/login" onClick={() => handleNavigate('login')}>Log in</NavLink>
              <a 
                href="/signup"
                onClick={e => { e.preventDefault(); handleNavigate('signup') }}
                className="ml-1 bg-primary text-white text-xs font-display font-semibold px-4 py-1.5 rounded-md hover:bg-[#e04400] transition-colors no-underline"
              >
                Sign up free
              </a>
            </>
          ) : (
            <>
              <NavLink 
                active={currentScreen === 'feed'} 
                href="/feed"
                onClick={() => handleNavigate('feed')}
              >
                Browse
              </NavLink>
              <NavLink 
                active={currentScreen === 'post'} 
                href="/post-goal"
                onClick={() => handleNavigate('post')}
              >
                Post Goal
              </NavLink>
              <NavLink 
                active={currentScreen === 'dashboard'} 
                href="/dashboard"
                onClick={() => handleNavigate('dashboard')}
              >
                Dashboard
              </NavLink>
              <NavLink 
                active={currentScreen === 'myapplications'} 
                href="/my-applications"
                onClick={() => handleNavigate('myapplications')}
              >
                My Applications
              </NavLink>
              <div className="w-px h-5 bg-white/10 mx-2" />
              
              {/* Notifications Bell */}
              <a 
                href="/notifications"
                onClick={e => { e.preventDefault(); handleNavigate('notifications') }}
                className="relative p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors no-underline"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </a>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors",
                    profileDropdownOpen && "bg-white/5"
                  )}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="w-7 h-7 rounded-full av-orange flex items-center justify-center font-display font-bold text-[10px]">
                    {user?.initials}
                  </div>
                  <span className="font-mono text-[11px] text-gold">
                    {user?.trustScore}
                  </span>
                  <ChevronDown size={14} className={cn(
                    "text-white/50 transition-transform",
                    profileDropdownOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-fade-up">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-border bg-surface">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full av-orange flex items-center justify-center font-display font-bold text-sm">
                          {user?.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{user?.name}</div>
                          <div className="font-mono text-xs text-text3">{user?.email}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4">
                        <div>
                          <div className="font-mono text-lg font-semibold text-gold">{user?.trustScore}</div>
                          <div className="font-mono text-[10px] text-text3 uppercase">Trust Score</div>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                          <div className="font-mono text-lg font-semibold">94%</div>
                          <div className="font-mono text-[10px] text-text3 uppercase">Show Rate</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <DropdownItem 
                        icon={<User size={16} />} 
                        href="/profile"
                        onClick={() => handleNavigate('profile')}
                      >
                        View Profile
                      </DropdownItem>
                      <DropdownItem 
                        icon={<Settings size={16} />} 
                        href="/profile"
                        onClick={() => handleNavigate('profile')}
                      >
                        Settings
                      </DropdownItem>
                      <div className="h-px bg-border my-1" />
                      <DropdownItem 
                        icon={<LogOut size={16} />} 
                        onClick={logout}
                        className="text-red"
                      >
                        Log out
                      </DropdownItem>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-ink md:hidden">
          <div className="pt-16 px-4 flex flex-col gap-2">
            {!isLoggedIn ? (
              <>
                <MobileNavLink 
                  active={currentScreen === 'landing'} 
                  href="/"
                  onClick={() => handleNavigate('landing')}
                >
                  Home
                </MobileNavLink>
                <MobileNavLink 
                  active={currentScreen === 'feed'} 
                  href="/feed"
                  onClick={() => handleNavigate('feed')}
                >
                  Browse goals
                </MobileNavLink>
                <div className="h-px bg-white/10 my-2" />
                <MobileNavLink href="/login" onClick={() => handleNavigate('login')}>Log in</MobileNavLink>
                <a 
                  href="/signup"
                  onClick={e => { e.preventDefault(); handleNavigate('signup') }}
                  className="block bg-primary text-white text-sm font-display font-semibold px-4 py-3 rounded-lg hover:bg-[#e04400] transition-colors mt-2 text-center no-underline"
                >
                  Sign up free
                </a>
              </>
            ) : (
              <>
                {/* Mobile Profile Header */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 rounded-full av-orange flex items-center justify-center font-display font-bold text-sm">
                    {user?.initials}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{user?.name}</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="font-mono text-xs text-gold">{user?.trustScore} trust</span>
                      <span className="font-mono text-xs text-white/50">94% show rate</span>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-white/10 mb-2" />
                <MobileNavLink 
                  active={currentScreen === 'feed'} 
                  href="/feed"
                  onClick={() => handleNavigate('feed')}
                >
                  Browse
                </MobileNavLink>
                <MobileNavLink 
                  active={currentScreen === 'post'} 
                  href="/post-goal"
                  onClick={() => handleNavigate('post')}
                >
                  Post Goal
                </MobileNavLink>
                <MobileNavLink 
                  active={currentScreen === 'dashboard'} 
                  href="/dashboard"
                  onClick={() => handleNavigate('dashboard')}
                >
                  Dashboard
                </MobileNavLink>
                <MobileNavLink 
                  active={currentScreen === 'myapplications'} 
                  href="/my-applications"
                  onClick={() => handleNavigate('myapplications')}
                >
                  My Applications
                </MobileNavLink>
                <MobileNavLink 
                  active={currentScreen === 'notifications'} 
                  href="/notifications"
                  onClick={() => handleNavigate('notifications')}
                >
                  Notifications
                </MobileNavLink>
                <div className="h-px bg-white/10 my-2" />
                <MobileNavLink 
                  active={currentScreen === 'profile'} 
                  href="/profile"
                  onClick={() => handleNavigate('profile')}
                >
                  View Profile
                </MobileNavLink>
                <MobileNavLink onClick={logout} className="text-red">
                  Log out
                </MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function NavLink({ 
  children, 
  active, 
  onClick,
  href,
  className
}: { 
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  href?: string
  className?: string
}) {
  return (
    <a
      href={href ?? '#'}
      onClick={e => { e.preventDefault(); onClick?.() }}
      className={cn(
        "text-[13px] font-mono text-white/50 px-3.5 py-1.5 rounded-md cursor-pointer border-none bg-transparent transition-all hover:text-white hover:bg-white/5 no-underline",
        active && "text-primary bg-white/5",
        className
      )}
    >
      {children}
    </a>
  )
}

function MobileNavLink({ 
  children, 
  active, 
  onClick,
  href,
  className
}: { 
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  href?: string
  className?: string
}) {
  return (
    <a
      href={href ?? '#'}
      onClick={e => { e.preventDefault(); onClick?.() }}
      className={cn(
        "block text-base font-mono text-white/70 px-4 py-3 rounded-lg cursor-pointer transition-all hover:text-white hover:bg-white/5 no-underline",
        active && "text-primary bg-white/10",
        className
      )}
    >
      {children}
    </a>
  )
}

function DropdownItem({ 
  children, 
  icon,
  onClick,
  href,
  className
}: { 
  children: React.ReactNode
  icon: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
}) {
  return (
    <a
      href={href ?? '#'}
      onClick={e => { e.preventDefault(); onClick?.() }}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text2 hover:bg-surface transition-colors no-underline",
        className
      )}
    >
      {icon}
      {children}
    </a>
  )
}
