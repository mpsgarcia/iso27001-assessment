'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { carregarAvaliacoes } from '@/lib/firestore'
import { AvaliacaoItem } from '@/lib/types'
import { CONTROLES, CATEGORIAS_CONTROLES, SUBCATEGORIAS } from '@/lib/data/controles'
import AvaliacaoItemCard from '@/components/AvaliacaoItemCard'
import AnimatedTab from '@/components/AnimatedTab'
import { Loader2 } from 'lucide-react'

export default function ControlesPage() {
  const params = useParams()
  const id = params.id as string
  const [avaliacoes, setAvaliacoes] = useState<Record<string, AvaliacaoItem>>({})
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState(CATEGORIAS_CONTROLES[0]?.id ?? '')
  const [subAbaAtiva, setSubAbaAtiva] = useState<string>('')
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('todos')

  useEffect(() => {
    carregarAvaliacoes(id, 'controles').then((a) => {
      setAvaliacoes(a)
      setLoading(false)
    })
  }, [id])

  function handleUpdate(itemId: string, dados: Partial<AvaliacaoItem>) {
    setAvaliacoes((prev) => ({ ...prev, [itemId]: { ...prev[itemId], ...dados } as AvaliacaoItem }))
  }

  // Quando troca a aba principal, reseta a sub-aba para a primeira
  function trocarAba(catId: string) {
    setAbaAtiva(catId)
    setSubAbaAtiva(SUBCATEGORIAS[catId]?.[0] ?? '')
    setBusca('')
    setStatusFiltro('todos')
  }

  // Inicializa sub-aba na primeira carga
  const subAbas = SUBCATEGORIAS[abaAtiva] ?? []
  const subAbaEfetiva = subAbaAtiva || subAbas[0] || ''

  // Métricas globais
  const totalIds = CONTROLES.map((c) => c.id)
  const preenchidos = totalIds.filter(
    (i) => avaliacoes[i]?.status && avaliacoes[i].status !== 'nao_preenchido'
  ).length
  const pct = Math.round((preenchidos / totalIds.length) * 100)
  const conformes = totalIds.filter((i) => avaliacoes[i]?.status === 'atende_totalmente').length
  const parciais  = totalIds.filter((i) => avaliacoes[i]?.status === 'atende_parcialmente').length
  const naoAtende = totalIds.filter((i) => avaliacoes[i]?.status === 'nao_atende').length
  const pendentes = totalIds.filter((i) => !avaliacoes[i]?.status || avaliacoes[i].status === 'nao_preenchido').length

  // Aba ativa
  const catAtiva = CATEGORIAS_CONTROLES.find((c) => c.id === abaAtiva)
  const itensAba  = CONTROLES.filter((c) => c.categoria === abaAtiva)
  const preenAba  = itensAba.filter((i) => avaliacoes[i.id]?.status && avaliacoes[i.id].status !== 'nao_preenchido').length
  const pctAba    = itensAba.length > 0 ? Math.round((preenAba / itensAba.length) * 100) : 0

  // Sub-aba ativa
  const itensSub = useMemo(() =>
    CONTROLES.filter((c) => c.categoria === abaAtiva && c.subcategoria === subAbaEfetiva),
    [abaAtiva, subAbaEfetiva]
  )
  const preenSub = itensSub.filter((i) => avaliacoes[i.id]?.status && avaliacoes[i.id].status !== 'nao_preenchido').length
  const pctSub   = itensSub.length > 0 ? Math.round((preenSub / itensSub.length) * 100) : 0

  // Filtros dentro da sub-aba
  const itensFiltrados = itensSub.filter((c) => {
    const matchBusca = !busca ||
      c.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      c.nome.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = statusFiltro === 'todos' ||
      (avaliacoes[c.id]?.status || 'nao_preenchido') === statusFiltro
    return matchBusca && matchStatus
  })

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
        <h2 className="page-title">93 Controles — Anexo A</h2>
        <p className="page-subtitle">
          Avalie os controles de segurança da informação conforme ISO/IEC 27001:2022
        </p>
        <div className="progress-row">
          <div className="progress-meta">
            <span>{preenchidos} de {totalIds.length} controles avaliados</span>
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

      {/* Card de navegação em dois níveis */}
      <div className="bg-white rounded-xl border border-[rgba(45,45,45,0.08)] shadow-sm">

        {/* ── Nível 1: Anexos ── */}
        <div
          className="flex border-b border-[rgba(45,45,45,0.08)] overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIAS_CONTROLES.map((cat) => {
            const itens = CONTROLES.filter((c) => c.categoria === cat.id)
            const preen = itens.filter(
              (i) => avaliacoes[i.id]?.status && avaliacoes[i.id].status !== 'nao_preenchido'
            ).length
            const isAtiva  = cat.id === abaAtiva
            const allDone  = preen === itens.length && itens.length > 0
            const anexoNum = cat.id.replace(/([A-Z])(\d)/, '$1.$2')

            return (
              <button
                key={cat.id}
                onClick={() => trocarAba(cat.id)}
                className="flex items-center gap-xs px-lg py-md whitespace-nowrap transition-all flex-shrink-0 font-body text-[14px] font-semibold"
                style={{
                  borderBottom: isAtiva ? '2px solid #FF7400' : '2px solid transparent',
                  color: isAtiva ? '#FF7400' : allDone ? '#009668' : '#7F7F7F',
                  background: isAtiva ? 'rgba(255,116,0,0.04)' : 'transparent',
                }}
              >
                {allDone && !isAtiva && (
                  <span className="material-symbols-outlined text-[14px]" style={{ color: '#009668' }}>check_circle</span>
                )}
                Anexo {anexoNum}
              </button>
            )
          })}
        </div>

        {/* Cabeçalho da categoria + progress */}
        <div className="px-xl pt-lg pb-md flex items-center justify-between">
          <div>
            <h3 className="font-title font-bold text-[16px] text-[#2D2D2D]">{catAtiva?.label}</h3>
            <p className="text-[13px] text-[#7F7F7F] mt-1">
              {preenAba} de {itensAba.length} controles avaliados nesta categoria
            </p>
          </div>
          <div className="flex items-center gap-md">
            <div className="w-24 h-1.5 bg-[rgba(45,45,45,0.08)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pctAba}%`, background: pctAba === 100 ? '#009668' : '#FF7400' }}
              />
            </div>
            <span className="font-title font-bold text-[14px]" style={{ color: pctAba === 100 ? '#009668' : '#FF7400' }}>
              {pctAba}%
            </span>
          </div>
        </div>

        {/* ── Nível 2: Subcategorias ── */}
        {subAbas.length > 1 && (
          <div
            className="overflow-x-auto border-y border-[rgba(45,45,45,0.06)]"
            style={{ scrollbarWidth: 'none', background: 'rgba(45,45,45,0.015)' }}
          >
            <div className="flex flex-nowrap px-md">
              {subAbas.map((sub) => {
                const itens    = CONTROLES.filter((c) => c.categoria === abaAtiva && c.subcategoria === sub)
                const preen    = itens.filter((i) => avaliacoes[i.id]?.status && avaliacoes[i.id].status !== 'nao_preenchido').length
                const isAtivaS = sub === subAbaEfetiva
                const allDoneS = preen === itens.length && itens.length > 0
                const label = sub
                  .replace('Políticas, Papéis e Responsabilidades', 'Políticas')
                  .replace('Gestão de Ativos e Classificação', 'Gestão de Ativos')
                  .replace('Controle de Acesso e Identidade', 'Controle de Acesso')
                  .replace('Segurança em Fornecedores e Nuvem', 'Fornecedores')
                  .replace('Gestão de Incidentes e Continuidade', 'Incidentes')
                  .replace('Conformidade e Governança', 'Conformidade')
                  .replace('Operações, Monitoramento e Proteção de Dados', 'Operações')
                  .replace('Redes e Segurança de Aplicações', 'Redes e Apps')
                  .replace('Acesso e Autenticação', 'Acesso')
                  .replace('Desenvolvimento Seguro', 'Desenvolvimento')

                return (
                  <button
                    key={sub}
                    title={sub}
                    onClick={() => { setSubAbaAtiva(sub); setBusca(''); setStatusFiltro('todos') }}
                    className="flex items-center gap-xs py-sm px-md whitespace-nowrap transition-all flex-shrink-0 font-body font-medium"
                    style={{
                      fontSize: '15px',
                      borderBottom: isAtivaS ? '2px solid #4B1196' : '2px solid transparent',
                      color: isAtivaS ? '#4B1196' : allDoneS ? '#009668' : '#7F7F7F',
                    }}
                  >
                    {allDoneS && !isAtivaS && (
                      <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#009668' }}>check_circle</span>
                    )}
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Mini progresso da sub-aba + filtros */}
        <div className="px-xl pt-md pb-sm border-b border-[rgba(45,45,45,0.06)]">
          <div className="flex items-center justify-between mb-md">
            <p className="text-[13px] text-[#7F7F7F]">
              <span className="font-semibold text-[#2D2D2D]">{subAbaEfetiva}</span>
              {' '}— {preenSub} de {itensSub.length} controles avaliados
            </p>
            <div className="flex items-center gap-md">
              <div className="w-20 h-1.5 bg-[rgba(45,45,45,0.08)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pctSub}%`, background: pctSub === 100 ? '#009668' : '#4B1196' }}
                />
              </div>
              <span className="font-title font-bold text-[13px]" style={{ color: pctSub === 100 ? '#009668' : '#4B1196' }}>
                {pctSub}%
              </span>
            </div>
          </div>

          {/* Filtro de status */}
          <div className="flex gap-md pb-md">
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="input !min-h-[40px] !text-[13px] w-48 appearance-none"
              style={{ colorScheme: 'light' }}
            >
              <option value="todos">Todos os status</option>
              <option value="nao_preenchido">Não preenchido</option>
              <option value="nao_atende">Não atende</option>
              <option value="atende_parcialmente">Atende Parcialmente</option>
              <option value="atende_totalmente">Atende Totalmente</option>
              <option value="nao_aplicavel">Não Aplicável</option>
            </select>
          </div>
        </div>

        {/* Lista de controles */}
        <div className="px-xl py-lg">
          {itensFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-[48px] block mb-md" style={{ color: 'rgba(45,45,45,0.2)' }}>search_off</span>
              <p className="font-body text-[14px] text-[#7F7F7F]">Nenhum controle encontrado.</p>
            </div>
          ) : (
            <AnimatedTab tabKey={`${abaAtiva}-${subAbaEfetiva}`} className="space-y-sm">
              {itensFiltrados.map((controle) => (
                <AvaliacaoItemCard
                  key={controle.id}
                  projetoId={id}
                  tipo="controles"
                  itemId={controle.id}
                  codigo={controle.codigo}
                  titulo={controle.nome}
                  texto={controle.texto}
                  avaliacao={avaliacoes[controle.id]}
                  mostrarSoA={true}
                  onUpdate={handleUpdate}
                />
              ))}
            </AnimatedTab>
          )}
        </div>

        {/* Navegação entre Anexos */}
        <div className="flex justify-between items-center px-xl py-md border-t border-[rgba(45,45,45,0.08)]">
          {(() => {
            const idx  = CATEGORIAS_CONTROLES.findIndex((c) => c.id === abaAtiva)
            const prev = CATEGORIAS_CONTROLES[idx - 1]
            const next = CATEGORIAS_CONTROLES[idx + 1]
            return (
              <>
                <button
                  onClick={() => prev && trocarAba(prev.id)}
                  disabled={!prev}
                  className="flex items-center gap-xs font-body text-[14px] font-semibold transition-all disabled:opacity-30"
                  style={{ color: prev ? '#FF7400' : undefined }}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  {prev ? `Anexo ${prev.id.replace(/([A-Z])(\d)/, '$1.$2')}` : 'Início'}
                </button>
                <span className="text-[12px] text-[#7F7F7F]">{idx + 1} / {CATEGORIAS_CONTROLES.length}</span>
                <button
                  onClick={() => next && trocarAba(next.id)}
                  disabled={!next}
                  className="flex items-center gap-xs font-body text-[14px] font-semibold transition-all disabled:opacity-30"
                  style={{ color: next ? '#FF7400' : undefined }}
                >
                  {next ? `Anexo ${next.id.replace(/([A-Z])(\d)/, '$1.$2')}` : 'Fim'}
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
