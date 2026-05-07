'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { buscarProjeto, atualizarProjeto, carregarAvaliacoes } from '@/lib/firestore'
import { Projeto, AvaliacaoItem } from '@/lib/types'
import { REQUISITOS } from '@/lib/data/requisitos'
import { CONTROLES } from '@/lib/data/controles'
import { Loader2 } from 'lucide-react'

const CLASSIFICACOES = ['Confidencial', 'Restrito', 'Interno', 'Público']

export default function CapaPage() {
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<Partial<Projeto>>({})
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [avalReq, setAvalReq] = useState<Record<string, AvaliacaoItem>>({})
  const [avalCtrl, setAvalCtrl] = useState<Record<string, AvaliacaoItem>>({})

  useEffect(() => {
    buscarProjeto(id).then((p) => {
      if (p) setForm(p)
      setLoading(false)
    })
    carregarAvaliacoes(id, 'requisitos').then(setAvalReq)
    carregarAvaliacoes(id, 'controles').then(setAvalCtrl)
  }, [id])

  // Cálculo de Conformidade
  const allIds = [
    ...REQUISITOS.map((r) => ({ id: r.id, tipo: 'req' as const })),
    ...CONTROLES.map((c)  => ({ id: c.id, tipo: 'ctrl' as const })),
  ]
  const elegíveis = allIds.filter(({ id: iid, tipo }) => {
    const av = tipo === 'req' ? avalReq[iid] : avalCtrl[iid]
    return av?.status !== 'nao_aplicavel'
  })
  const conformes = elegíveis.filter(({ id: iid, tipo }) => {
    const av = tipo === 'req' ? avalReq[iid] : avalCtrl[iid]
    return av?.status === 'atende_totalmente'
  })
  const pctConformidade = elegíveis.length > 0
    ? Math.round((conformes.length / elegíveis.length) * 100)
    : 0
  const totalAvaliados = allIds.filter(({ id: iid, tipo }) => {
    const av = tipo === 'req' ? avalReq[iid] : avalCtrl[iid]
    return av?.status && av.status !== 'nao_preenchido'
  }).length
  // Gauge SVG
  const RADIUS = 58
  const CIRCUM = 2 * Math.PI * RADIUS
  const fillDash = (pctConformidade / 100) * CIRCUM
  const gaugeColor = pctConformidade >= 70 ? '#009668' : pctConformidade >= 40 ? '#FF9A0A' : '#CC2200'


  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try {
      await atualizarProjeto(id, form)
      setSalvo(true)
      setTimeout(() => setSalvo(false), 2500)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-container-padding py-xl animate-fade-in">

      {/* Hero */}
      <section className="mb-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <span className="font-inter text-label-caps text-secondary mb-xs block uppercase tracking-widest">
              Módulo de Configuração
            </span>
            <h2 className="font-manrope text-display-xl text-on-surface tracking-tight">
              Capa do Projeto
            </h2>
            <p className="font-inter text-body-base text-on-surface-variant mt-sm max-w-2xl">
              Defina os parâmetros fundamentais e a identidade da organização para o assessment ISO 27001:2022.
            </p>
          </div>
          <div className="flex gap-sm">
            <button
              type="button"
              className="px-lg py-sm border border-outline-variant text-on-surface-variant font-inter font-semibold rounded-lg hover:bg-surface-variant/10 transition-all"
            >
              Descartar
            </button>
            <button
              form="capa-form"
              type="submit"
              disabled={salvando || loading}
              className="px-xl py-sm bg-primary text-on-primary font-title text-title-md rounded-lg shadow-md hover:shadow-[0_16px_40px_rgba(255,116,0,0.15)] transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-xs"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Carregando...</>
              ) : salvando ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Salvando...</>
              ) : salvo ? (
                <><span className="material-symbols-outlined text-[18px]">check_circle</span>Salvo!</>
              ) : (
                <><span className="material-symbols-outlined text-[18px]">save</span>Salvar Projeto</>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Form Bento Grid */}
      <form id="capa-form" onSubmit={handleSalvar}>
        <div className="grid grid-cols-12 gap-lg">

          {/* Coluna Esquerda */}
          <div className="col-span-12 lg:col-span-8 space-y-lg">

            {/* Identificação */}
            <div className="glass-panel p-xl rounded-xl border border-outline-variant/30 shadow-sm glow-border transition-all duration-300">
              <div className="flex items-center gap-xs mb-lg">
                <span className="material-symbols-outlined text-primary">business</span>
                <h3 className="font-manrope text-headline-lg text-on-surface">Identificação da Organização</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                <div className="col-span-1 md:col-span-2 form-group">
                  <label className="form-label">
                    Nome da Organização <span className="required">*</span>
                  </label>
                  <input
                    required
                    value={form.organizacao || ''}
                    onChange={(e) => setForm({ ...form, organizacao: e.target.value })}
                    placeholder="Ex: SecureTech Systems Ltda."
                    className="input"
                  />
                </div>
                <div className="col-span-1 form-group">
                  <label className="form-label">
                    Consultor Responsável <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="material-symbols-outlined">person</span>
                    <input
                      required
                      value={form.consultor || ''}
                      onChange={(e) => setForm({ ...form, consultor: e.target.value })}
                      placeholder="Nome do consultor"
                    />
                  </div>
                </div>
                <div className="col-span-1 form-group">
                  <label className="form-label">
                    Classificação do Documento
                  </label>
                  <div className="input-with-icon">
                    <span className="material-symbols-outlined">lock</span>
                    <select
                      value={form.classificacao || 'Confidencial'}
                      onChange={(e) => setForm({ ...form, classificacao: e.target.value })}
                      style={{ colorScheme: 'light' }}
                      className="appearance-none"
                    >
                      {CLASSIFICACOES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Cronograma */}
            <div className="glass-panel p-xl rounded-xl border border-outline-variant/30 shadow-sm glow-border transition-all duration-300">
              <div className="flex items-center gap-xs mb-lg">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                <h3 className="font-manrope text-headline-lg text-on-surface">Cronograma e Versão</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
                <div className="form-group">
                  <label className="form-label">
                    Data de Início <span className="required">*</span>
                  </label>
                  <input
                    required type="date"
                    value={form.dataInicio || ''}
                    onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Entrega Prevista <span className="required">*</span>
                  </label>
                  <input
                    required type="date"
                    value={form.dataEntrega || ''}
                    onChange={(e) => setForm({ ...form, dataEntrega: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Versão do Documento
                  </label>
                  <input
                    value={form.versao || ''}
                    onChange={(e) => setForm({ ...form, versao: e.target.value })}
                    placeholder="v1.0.0"
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita — Conformidade */}
          <div className="col-span-12 lg:col-span-4">
            <div className="glass-panel p-xl rounded-xl border border-outline-variant/30 shadow-sm h-full flex flex-col glow-border transition-all duration-300">
              <div className="flex items-center gap-xs mb-lg">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <h3 className="font-manrope text-headline-lg text-on-surface">Índice de Conformidade</h3>
              </div>

              {/* Gauge circular */}
              <div className="flex-grow flex flex-col items-center justify-center gap-md py-md">
                <div className="relative flex items-center justify-center">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    {/* Trilha */}
                    <circle
                      cx="80" cy="80" r={RADIUS}
                      fill="none"
                      stroke="rgba(45,45,45,0.08)"
                      strokeWidth="14"
                    />
                    {/* Fill animado */}
                    <circle
                      cx="80" cy="80" r={RADIUS}
                      fill="none"
                      stroke={gaugeColor}
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={`${fillDash} ${CIRCUM}`}
                      strokeDashoffset={CIRCUM / 4}
                      style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.25,0.46,0.45,0.94), stroke 0.4s ease' }}
                    />
                  </svg>
                  {/* % no centro */}
                  <div className="absolute flex flex-col items-center">
                    <span
                      className="font-title font-bold leading-none"
                      style={{ fontSize: 36, color: gaugeColor, transition: 'color 0.4s ease' }}
                    >
                      {pctConformidade}%
                    </span>
                    <span className="font-body text-[11px] text-[#7F7F7F] mt-1 uppercase tracking-widest">conform.</span>
                  </div>
                </div>

                {/* Legenda */}
                <div className="w-full grid grid-cols-2 gap-sm mt-xs">
                  <div className="text-center p-sm rounded-lg" style={{ background: 'rgba(0,150,104,0.08)' }}>
                    <div className="font-title font-bold text-[20px]" style={{ color: '#009668' }}>
                      {conformes.length}
                    </div>
                    <div className="font-body text-[11px] text-[#7F7F7F] uppercase tracking-widest">Conformes</div>
                  </div>
                  <div className="text-center p-sm rounded-lg" style={{ background: 'rgba(45,45,45,0.05)' }}>
                    <div className="font-title font-bold text-[20px]" style={{ color: '#2D2D2D' }}>
                      {totalAvaliados}
                    </div>
                    <div className="font-body text-[11px] text-[#7F7F7F] uppercase tracking-widest">Avaliados</div>
                  </div>
                </div>
              </div>

              {/* Barra de progresso do total */}
              <div className="mt-md pt-md border-t border-[rgba(45,45,45,0.06)]">
                <div className="flex justify-between mb-xs">
                  <span className="font-body text-[12px] text-[#7F7F7F]">Preenchimento geral</span>
                  <span className="font-title font-bold text-[12px]" style={{ color: '#4B1196' }}>
                    {allIds.length > 0 ? Math.round((totalAvaliados / allIds.length) * 100) : 0}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(45,45,45,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #FF7400, #4B1196)',
                      borderRadius: 999,
                      width: `${allIds.length > 0 ? Math.round((totalAvaliados / allIds.length) * 100) : 0}%`,
                      transition: 'width 1s cubic-bezier(0.25,0.46,0.45,0.94)',
                    }}
                  />
                </div>
                <p className="font-body text-[11px] text-[#9A9A9A] mt-xs">
                  {totalAvaliados} de {allIds.length} itens avaliados (excl. N/A)
                </p>
              </div>
            </div>
          </div>

          {/* Footer Banner */}
          <div className="col-span-12">
            <div className="relative overflow-hidden rounded-xl h-44 shadow-[0_24px_80px_rgba(45,45,45,0.12)]" style={{ background: '#2D2D2D' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at right, rgba(255,116,0,0.18), transparent 60%)' }} />
              <div className="relative p-xl z-10 flex items-center h-full">
                <div className="max-w-[480px]">
                  <h4 className="font-title text-[22px] font-bold text-white mb-xs">Pronto para Auditar?</h4>
                  <p className="font-body text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Após preencher a capa, acesse as abas de <span style={{ color: '#FF7400', fontWeight: 600 }}>Requisitos</span> e <span style={{ color: '#FF7400', fontWeight: 600 }}>Controles</span> para iniciar o Gap Analysis ISO 27001:2022.
                  </p>
                </div>
              </div>
              <div className="absolute right-xl top-1/2 -translate-y-1/2" style={{ opacity: 0.06 }}>
                <span className="material-symbols-outlined text-white" style={{ fontSize: 180 }}>verified_user</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, #FF7400, #4B1196)' }} />
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
