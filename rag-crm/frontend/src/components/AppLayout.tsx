import { useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3, BrainCircuit, LayoutDashboard, LogOut, Menu, Search,
  Settings as SettingsIcon, Target, Users, X,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Command' },
  { to: '/leads', icon: Users, label: 'Accounts' },
  { to: '/search', icon: Search, label: 'Deal Intel' },
  { to: '/analytics', icon: BarChart3, label: 'Signal Analytics' },
  { to: '/settings', icon: SettingsIcon, label: 'Workspace' },
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-[#f6f7f4]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-[#101412] text-white transition-transform duration-200 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-400 text-gray-950">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-4">DealGraph</p>
            <p className="text-xs text-white/50">RAG revenue workspace</p>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Target className="h-3.5 w-3.5" />
              B2B services pipeline
            </div>
            <p className="mt-2 text-sm font-medium text-white">
              Prioritize the next useful customer conversation.
            </p>
          </div>
        </div>

        <nav className="space-y-1 px-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white text-gray-950'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-red-500/10 hover:text-red-100"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-gray-950/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="cursor-pointer rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 lg:flex">
            <Search className="h-4 w-4" />
            Ask deal questions in Deal Intel
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-950">{user.name || 'Workspace'}</p>
              <p className="text-xs text-gray-500">{user.plan || 'free'} plan</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="hidden rounded-md p-2 text-gray-400 hover:bg-gray-100 md:block lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="app-surface flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
