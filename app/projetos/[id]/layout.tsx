'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { buscarProjeto } from '@/lib/firestore'
import { Projeto } from '@/lib/types'
import { Loader2 } from 'lucide-react'

const tabs = [
  { label: 'Capa',        href: '',            icon: 'description' },
  { label: 'Requisitos',  href: '/requisitos',  icon: 'fact_check' },
  { label: 'Controles',   href: '/controles',   icon: 'security' },
  { label: 'Dashboard',   href: '/dashboard',   icon: 'dashboard' },
  { label: 'Estimativas', href: '/estimativas', icon: 'calculate' },
  { label: 'Exportar',    href: '/exportar',    icon: 'download' },
]

export default function ProjetoLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const id = params.id as string
  const pathname = usePathname()
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const base = `/projetos/${id}`

  useEffect(() => {
    buscarProjeto(id).then(setProjeto)
  }, [id])

  return (
    <>
      {/* TopBar fixa */}
      <header className="topbar fixed top-0 right-0 w-[calc(100%-280px)] z-40 justify-between px-xl">

        {/* Breadcrumb + Título */}
        <div className="flex items-center gap-md">
          <Link
            href="/projetos"
            className="flex items-center gap-xs text-[#7F7F7F] hover:text-[#FF7400] transition-colors font-body text-[14px]"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            Projetos
          </Link>
          <span className="text-[#7F7F7F]/30">/</span>
          {projeto ? (
            <span className="font-title text-[15px] text-[#2D2D2D] font-bold">
              {projeto.organizacao}
            </span>
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-[#7F7F7F]" />
          )}
          {projeto && (
            <span className="ml-4 flex items-center gap-xs">
              <span className="font-body text-[10px] text-[#7F7F7F] uppercase font-bold tracking-widest bg-[#2D2D2D]/5 px-2 py-1 rounded-full">
                {projeto.classificacao}
              </span>
              <span className="font-body text-[11px] text-[#7F7F7F] font-bold">
                v{projeto.versao}
              </span>
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex h-full">
          {tabs.map((tab) => {
            const href = `${base}${tab.href}`
            const active = tab.href === '' ? pathname === base : pathname.startsWith(href)
            return (
              <Link
                key={tab.href}
                href={href}
                className={`topbar-tab ${active ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </Link>
            )
          })}
        </div>
      </header>

      {/* Conteúdo — padding-top para compensar header */}
      <div className="pt-[72px] flex-1 overflow-auto min-h-screen">
        {children}
      </div>
    </>
  )
}
