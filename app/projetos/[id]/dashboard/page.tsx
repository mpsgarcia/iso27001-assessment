'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { carregarAvaliacoes } from '@/lib/firestore'
import { AvaliacaoItem, StatusAvaliacao, STATUS_LABELS } from '@/lib/types'
import { REQUISITOS, GRUPOS_REQUISITOS } from '@/lib/data/requisitos'
import { CONTROLES, CATEGORIAS_CONTROLES } from '@/lib/data/controles'
import { Loader2 } from 'lucide-react'

type Contagem = Record<StatusAvaliacao, number>

function calcContagem(avaliacoes: Record<string, AvaliacaoItem>, ids: string[]): Contagem {
  const c: Contagem = { nao_atende: 0, atende_parcialmente: 0, atende_totalmente: 0, nao_aplicavel: 0, nao_preenchido: 0 }
  ids.forEach((id) => {
    const s = (avaliacoes[id]?.status || 'nao_preenchido') as StatusAvaliacao
    c[s]++
  })
  return c
}

function DonutSVG({ pct, color }: { pct: number; color: string }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  return (
    <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="transparent" stroke="#e5eeff" strokeWidth="8" />
      <circle cx="48" cy="48" r={r} fill="transparent" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  )
}

const STATUS_COLORS_MAP: Record<StatusAvaliacao, string> = {
  atende_totalmente: '#009668',
  atende_parcialmente: '#f59e0b',
  nao_atende: '#ba1a1a',
  nao_aplicavel: '#76777d',
  nao_preenchido: '#c6c6cd',
}

export default function DashboardPage() {
  const params = useParams()
  const id = params.id as string
  const [reqAv, setReqAv] = useState<Record<string, AvaliacaoItem>>({})
  const [ctrlAv, setCtrlAv] = useState<Record<string, AvaliacaoItem>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      carregarAvaliacoes(id, 'requisitos'),
      carregarAvaliacoes(id, 'controles'),
    ]).then(([req, ctrl]) => {
      setReqAv(req); setCtrlAv(ctrl); setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  const reqIds = REQUISITOS.map((r) => r.id)
  const ctrlIds = CONTROLES.map((c) => c.id)
  const reqC = calcContagem(reqAv, reqIds)
  const ctrlC = calcContagem(ctrlAv, ctrlIds)

  const reqPreenchidos = reqIds.filter((i) => reqAv[i]?.status && reqAv[i].status !== 'nao_preenchido').length
  const ctrlPreenchidos = ctrlIds.filter((i) => ctrlAv[i]?.status && ctrlAv[i].status !== 'nao_preenchido').length

  const reqAplic = reqIds.length - reqC.nao_aplicavel - reqC.nao_preenchido
  const ctrlAplic = ctrlIds.length - ctrlC.nao_aplicavel - ctrlC.nao_preenchido
  const pctReq = reqAplic > 0 ? Math.round((reqC.atende_totalmente / reqAplic) * 100) : 0
  const pctCtrl = ctrlAplic > 0 ? Math.round((ctrlC.atende_totalmente / ctrlAplic) * 100) : 0
  const pctGlobal = Math.round((pctReq + pctCtrl) / 2)
  const pctCompReq = Math.round((reqPreenchidos / reqIds.length) * 100)
  const pctCompCtrl = Math.round((ctrlPreenchidos / ctrlIds.length) * 100)

  const STATUS_ORDER: StatusAvaliacao[] = ['atende_totalmente', 'atende_parcialmente', 'nao_atende', 'nao_aplicavel', 'nao_preenchido']

  return (
    <div className="p-xl max-w-7xl mx-auto">

      {/* Título */}
      <div className="mb-xl">
        <h2 className="font-manrope text-display-xl text-on-surface">Dashboard de Conformidade</h2>
        <p className="font-inter text-body-base text-on-surface-variant mt-xs">
          Visão consolidada do Gap Analysis ISO/IEC 27001:2022
        </p>
      </div>

      {/* KPI Bento */}
      <div className="grid grid-cols-12 gap-lg mb-xl">

        {/* Conformidade global */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl flex flex-col items-center justify-center shadow-sm">
          <div className="relative w-36 h-36 mb-lg">
            <DonutSVG pct={pctGlobal} color="#0051d5" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-manrope text-display-xl text-secondary">{pctGlobal}%</span>
              <span className="font-inter text-label-caps text-on-surface-variant uppercase">Conf.</span>
            </div>
          </div>
          <h3 className="font-manrope text-headline-lg text-on-surface text-center">Conformidade Global</h3>
          <p className="font-inter text-body-sm text-on-surface-variant text-center mt-xs">
            Baseado em requisitos e controles avaliados
          </p>
        </div>

        {/* Progresso de preenchimento */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl shadow-sm">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="font-manrope text-headline-lg text-on-surface">Progresso de Preenchimento</h3>
            <span className="bg-secondary/10 text-secondary font-inter text-label-caps uppercase px-md py-xs rounded-full">
              {Math.round((pctCompReq + pctCompCtrl) / 2)}% Completo
            </span>
          </div>
          <div className="space-y-lg">
            {[
              { label: 'Requisitos (Cláusulas 4-10)', pct: pctCompReq, color: 'bg-secondary' },
              { label: 'Controles Anexo A (93 controles)', pct: pctCompCtrl, color: 'bg-on-tertiary-container' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-xs">
                  <span className="font-inter text-body-sm text-on-surface">{item.label}</span>
                  <span className="font-inter text-body-sm text-on-surface-variant font-medium">{item.pct}%</span>
                </div>
                <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Cards de status */}
          <div className="grid grid-cols-4 gap-md mt-xl">
            {[
              { label: 'Conformes', value: reqC.atende_totalmente + ctrlC.atende_totalmente, color: 'text-on-tertiary-container', bg: 'bg-on-tertiary-container/10' },
              { label: 'Parciais', value: reqC.atende_parcialmente + ctrlC.atende_parcialmente, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Não atende', value: reqC.nao_atende + ctrlC.nao_atende, color: 'text-error', bg: 'bg-error-container' },
              { label: 'Pendentes', value: reqC.nao_preenchido + ctrlC.nao_preenchido, color: 'text-secondary', bg: 'bg-secondary/10' },
            ].map((kpi) => (
              <div key={kpi.label} className={`${kpi.bg} rounded-xl p-md text-center`}>
                <span className={`font-manrope text-display-xl ${kpi.color} font-bold block`}>
                  {kpi.value.toString().padStart(2, '0')}
                </span>
                <span className="font-inter text-label-caps text-on-surface-variant uppercase text-[10px]">
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donuts por seção */}
      <div className="grid grid-cols-12 gap-lg mb-xl">
        {[
          { titulo: 'Requisitos (Cláusulas 4-10)', total: reqIds.length, contagem: reqC, pct: pctReq },
          { titulo: 'Controles (Anexo A)', total: ctrlIds.length, contagem: ctrlC, pct: pctCtrl },
        ].map((sec) => (
          <div key={sec.titulo} className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl shadow-sm">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-manrope text-title-md text-on-surface">{sec.titulo}</h3>
              <span className="font-manrope text-headline-lg text-secondary">{sec.pct}%</span>
            </div>
            <div className="flex items-center gap-xl">
              <div className="relative w-28 h-28 flex-shrink-0">
                <DonutSVG pct={sec.pct} color="#0051d5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-inter text-body-sm text-on-surface-variant">{sec.pct}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-xs">
                {STATUS_ORDER.map((s) => (
                  <div key={s} className="flex items-center justify-between">
                    <div className="flex items-center gap-xs">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS_MAP[s] }} />
                      <span className="font-inter text-body-sm text-on-surface-variant">{STATUS_LABELS[s]}</span>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className="font-inter text-body-sm text-on-surface font-medium">{sec.contagem[s]}</span>
                      <div className="w-20 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(sec.contagem[s] / sec.total) * 100}%`, background: STATUS_COLORS_MAP[s] }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-xs border-t border-outline-variant/20 flex justify-between">
                  <span className="font-inter text-label-caps text-on-surface-variant uppercase">Total</span>
                  <span className="font-inter text-body-sm font-bold text-on-surface">{sec.total}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela por cláusula */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden mb-xl">
        <div className="px-xl py-lg border-b border-outline-variant/30 bg-white">
          <h3 className="font-manrope text-headline-lg text-on-surface">Status por Cláusula</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-xl py-md font-inter text-label-caps text-on-surface-variant uppercase">Cláusula</th>
                {['Conforme', 'Parcial', 'Não atende', 'N/A', 'Pendente', 'Total'].map((h) => (
                  <th key={h} className="px-md py-md font-inter text-label-caps text-on-surface-variant uppercase text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {GRUPOS_REQUISITOS.map((grupo) => {
                const itens = REQUISITOS.filter((r) => r.grupo === grupo.id)
                const c = calcContagem(reqAv, itens.map((i) => i.id))
                const pctGrupo = (itens.length - c.nao_aplicavel - c.nao_preenchido) > 0
                  ? Math.round((c.atende_totalmente / (itens.length - c.nao_aplicavel - c.nao_preenchido)) * 100)
                  : 0
                return (
                  <tr key={grupo.id} className="row-hover-effect">
                    <td className="px-xl py-md">
                      <div>
                        <p className="font-inter text-body-sm text-on-surface font-medium">{grupo.label.split(' — ')[0]}</p>
                        <p className="font-inter text-[11px] text-on-surface-variant">{grupo.label.split(' — ')[1]}</p>
                      </div>
                    </td>
                    <td className="px-md py-md text-center">
                      <span className="font-inter text-body-sm text-on-tertiary-container font-bold">{c.atende_totalmente}</span>
                    </td>
                    <td className="px-md py-md text-center">
                      <span className="font-inter text-body-sm text-amber-600 font-bold">{c.atende_parcialmente}</span>
                    </td>
                    <td className="px-md py-md text-center">
                      <span className="font-inter text-body-sm text-error font-bold">{c.nao_atende}</span>
                    </td>
                    <td className="px-md py-md text-center">
                      <span className="font-inter text-body-sm text-on-surface-variant">{c.nao_aplicavel}</span>
                    </td>
                    <td className="px-md py-md text-center">
                      <span className="font-inter text-body-sm text-outline">{c.nao_preenchido}</span>
                    </td>
                    <td className="px-md py-md text-center">
                      <div className="flex items-center gap-xs justify-center">
                        <div className="w-12 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: `${pctGrupo}%` }} />
                        </div>
                        <span className="font-inter text-label-caps text-secondary">{pctGrupo}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barras por categoria de controle */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="px-xl py-lg border-b border-outline-variant/30 bg-white">
          <h3 className="font-manrope text-headline-lg text-on-surface">Status por Categoria de Controles</h3>
        </div>
        <div className="p-xl grid grid-cols-4 gap-lg">
          {CATEGORIAS_CONTROLES.map((cat) => {
            const itens = CONTROLES.filter((c) => c.categoria === cat.id)
            const c = calcContagem(ctrlAv, itens.map((i) => i.id))
            const confPct = itens.length > 0 ? Math.round((c.atende_totalmente / itens.length) * 100) : 0
            return (
              <div key={cat.id} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-md">
                  <DonutSVG pct={confPct} color="#009668" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-inter text-body-sm font-bold text-on-tertiary-container">{confPct}%</span>
                  </div>
                </div>
                <p className="font-manrope text-title-md text-on-surface font-semibold">{cat.label.split(' — ')[0]}</p>
                <p className="font-inter text-label-caps text-on-surface-variant uppercase mt-xs">
                  {c.atende_totalmente}/{itens.length} conformes
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-xl text-center">
        <p className="font-inter text-label-caps text-on-surface-variant uppercase tracking-widest">
          GRC Shield · ISO 27001:2022 · Atualizado em tempo real
        </p>
      </div>
    </div>
  )
}
