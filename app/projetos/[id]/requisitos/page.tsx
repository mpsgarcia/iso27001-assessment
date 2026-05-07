'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { carregarAvaliacoes } from '@/lib/firestore'
import { AvaliacaoItem, StatusAvaliacao } from '@/lib/types'
import { REQUISITOS, GRUPOS_REQUISITOS } from '@/lib/data/requisitos'
import AvaliacaoItemCard from '@/components/AvaliacaoItemCard'
import AnimatedTab from '@/components/AnimatedTab'
import { Loader2 } from 'lucide-react'

export default function RequisitosPage() {
  const params = useParams()
  const id = params.id as string
  const [avaliacoes, setAvaliacoes] = useState<Record<string, AvaliacaoItem>>({})
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState(GRUPOS_REQUISITOS[0]?.id ?? '')

  useEffect(() => {
    carregarAvaliacoes(id, 'requisitos').then((a) => {
      setAvaliacoes(a)
      setLoading(false)
    })
  }, [id])

  function handleUpdate(itemId: string, dados: Partial<AvaliacaoItem>) {
    setAvaliacoes((prev) => ({ ...prev, [itemId]: { ...prev[itemId], ...dados } as AvaliacaoItem }))
  }

  // Métricas globais
  const totalIds = REQUISITOS.map((r) => r.id)
  const preenchidos = totalIds.filter(
    (i) => avaliacoes[i]?.status && avaliacoes[i].status !== 'nao_preenchido'
  ).length
  const pct = Math.round((preenchidos / totalIds.length) * 100)
  const conformes  = totalIds.filter((i) => avaliacoes[i]?.status === 'atende_totalmente').length
  const parciais   = totalIds.filter((i) => avaliacoes[i]?.status === 'atende_parcialmente').length
  const naoAtende  = totalIds.filter((i) => avaliacoes[i]?.status === 'nao_atende').length
  const pendentes  = totalIds.filter((i) => !avaliacoes[i]?.status || avaliacoes[i].status === 'nao_preenchido').length

  // Aba ativa
  const grupoAtivo = GRUPOS_REQUISITOS.find((g) => g.id === abaAtiva)
  const itensAtivos = REQUISITOS.filter((r) => r.grupo === abaAtiva)
  const preenAtivos = itensAtivos.filter(
    (i) => avaliacoes[i.id]?.status && avaliacoes[i.id].status !== 'nao_preenchido'
  ).length
  const pctAba = itensAtivos.length > 0
    ? Math.round((preenAtivos / itensAtivos.length) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="p-xl max-w-5xl mx-auto">

      {/* Título + Progresso global */}
      <div className="mb-xl">
        <h2 className="page-title">Requisitos — Cláusulas 4 a 10</h2>
        <p className="page-subtitle">
          Avalie cada requisito mandatório do SGSI conforme a ISO/IEC 27001:2022
        </p>
        <div className="progress-row">
          <div className="progress-meta">
            <span>{preenchidos} de {totalIds.length} requisitos avaliados</span>
            <span className="progress-percent">{pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* KPI Cards globais */}
      <div className="metrics-grid mb-xl">
        {[
          { label: 'Conformes',  value: conformes,  metricClass: 'metric-conformes' },
          { label: 'Não atende', value: naoAtende,  metricClass: 'metric-nao-atende' },
          { label: 'Parciais',   value: parciais,   metricClass: 'metric-parciais' },
          { label: 'Pendentes',  value: pendentes,  metricClass: 'metric-pendentes' },
        ].map((kpi) => (
          <div key={kpi.label} className={`metric-card ${kpi.metricClass}`}>
            <div className="metric-value">{kpi.value.toString().padStart(2, '0')}</div>
            <div className="metric-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Abas de Cláusulas */}
      <div className="bg-white rounded-xl border border-[rgba(45,45,45,0.08)] shadow-sm overflow-hidden">

        {/* Tab Bar */}
        <div className="flex overflow-x-auto border-b border-[rgba(45,45,45,0.08)]" style={{ scrollbarWidth: 'none' }}>
          {GRUPOS_REQUISITOS.map((grupo) => {
            const itens = REQUISITOS.filter((r) => r.grupo === grupo.id)
            const preen = itens.filter(
              (i) => avaliacoes[i.id]?.status && avaliacoes[i.id].status !== 'nao_preenchido'
            ).length
            const clauseNum = grupo.label.split(' ')[1] // "4", "5", etc.
            const isAtiva = grupo.id === abaAtiva
            const allDone = preen === itens.length && itens.length > 0

            return (
              <button
                key={grupo.id}
                onClick={() => setAbaAtiva(grupo.id)}
                className="flex items-center gap-xs px-lg py-md whitespace-nowrap transition-all relative flex-shrink-0 font-body text-[14px] font-semibold"
                style={{
                  borderBottom: isAtiva ? '2px solid #FF7400' : '2px solid transparent',
                  color: isAtiva ? '#FF7400' : allDone ? '#009668' : '#7F7F7F',
                  background: isAtiva ? 'rgba(255,116,0,0.04)' : 'transparent',
                }}
              >
                {allDone && !isAtiva && (
                  <span className="material-symbols-outlined text-[14px]" style={{ color: '#009668' }}>check_circle</span>
                )}
                Cláusula {clauseNum}
              </button>
            )
          })}
        </div>

        {/* Cabeçalho da aba ativa */}
        <div className="px-xl pt-lg pb-md flex items-center justify-between">
          <div>
            <h3 className="font-title font-bold text-[16px] text-[#2D2D2D]">
              {grupoAtivo?.label}
            </h3>
            <p className="text-[13px] text-[#7F7F7F] mt-1">
              {preenAtivos} de {itensAtivos.length} requisitos avaliados nesta cláusula
            </p>
          </div>
          {/* Mini progress da aba */}
          <div className="flex items-center gap-md">
            <div className="w-24 h-1.5 bg-[rgba(45,45,45,0.08)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pctAba}%`, background: pctAba === 100 ? '#009668' : '#FF7400' }}
              />
            </div>
            <span
              className="font-title font-bold text-[14px]"
              style={{ color: pctAba === 100 ? '#009668' : '#FF7400' }}
            >
              {pctAba}%
            </span>
          </div>
        </div>

        {/* Itens da aba */}
        <AnimatedTab tabKey={abaAtiva} className="px-xl pb-xl space-y-sm">
          {itensAtivos.map((req) => (
            <AvaliacaoItemCard
              key={req.id}
              projetoId={id}
              tipo="requisitos"
              itemId={req.id}
              codigo={req.codigo}
              titulo={req.titulo}
              texto={req.texto}
              avaliacao={avaliacoes[req.id]}
              mostrarSoA={false}
              onUpdate={handleUpdate}
            />
          ))}
        </AnimatedTab>

        {/* Navegação entre abas */}
        <div className="flex justify-between items-center px-xl py-md border-t border-[rgba(45,45,45,0.08)]">
          {(() => {
            const idx = GRUPOS_REQUISITOS.findIndex((g) => g.id === abaAtiva)
            const prev = GRUPOS_REQUISITOS[idx - 1]
            const next = GRUPOS_REQUISITOS[idx + 1]
            return (
              <>
                <button
                  onClick={() => prev && setAbaAtiva(prev.id)}
                  disabled={!prev}
                  className="flex items-center gap-xs font-body text-[14px] font-semibold transition-all disabled:opacity-30"
                  style={{ color: prev ? '#FF7400' : undefined }}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  {prev ? prev.label.split(' — ')[0] : 'Início'}
                </button>
                <span className="text-[12px] text-[#7F7F7F]">
                  {GRUPOS_REQUISITOS.findIndex((g) => g.id === abaAtiva) + 1} / {GRUPOS_REQUISITOS.length}
                </span>
                <button
                  onClick={() => next && setAbaAtiva(next.id)}
                  disabled={!next}
                  className="flex items-center gap-xs font-body text-[14px] font-semibold transition-all disabled:opacity-30"
                  style={{ color: next ? '#FF7400' : undefined }}
                >
                  {next ? next.label.split(' — ')[0] : 'Fim'}
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
