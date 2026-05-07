'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/auth'

const navItems = [
  { label: 'Projetos', href: '/projetos', icon: 'folder' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.replace('/login')
  }

  const initial = user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className="sidebar fixed left-0 top-0 h-full flex flex-col py-md px-sm z-50">

        {/* Logo */}
        <div className="mb-xl px-sm pt-lg">
          <h1 className="sidebar-logo font-title text-display-xl font-bold leading-tight">
            GRC Shield
          </h1>
          <p className="sidebar-subtitle mt-base">
            ISO 27001 Assessment
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-xs">
          {navItems.map((item) => {
            const active = item.href !== '#' && pathname.startsWith(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`sidebar-item ${active ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-white/10 pt-md space-y-xs">
          {isAdmin && (
            <Link
              href="/configuracoes"
              className={`w-full flex items-center gap-md px-md py-sm rounded-xl transition-all duration-200 hover:translate-x-1 ${pathname.startsWith('/configuracoes') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="font-body text-title-md">Configurações</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-md px-md py-sm text-white/60 hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-all duration-200 hover:translate-x-1"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-body text-title-md">Sair</span>
          </button>

          {/* User */}
          <div className="flex items-center gap-md px-md pt-sm mt-sm">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="overflow-hidden">
              <p className="font-body text-white font-bold text-body-sm truncate">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-white/50 text-[11px] truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main ml-[280px] flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
