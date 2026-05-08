'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { salvarEstimativa, carregarEstimativas } from '@/lib/firestore'
import { ESTIMATIVAS, FASES, EntregavelEstimativa } from '@/lib/data/estimativas'
import { formatCurrency } from '@/lib/utils'
import { Loader2, Info } from 'lucide-react'

type Maturidade = 'baixa' | 'media' | 'alta'

interface LinhaEstimativa extends EntregavelEstimativa {
  fatorAjuste: number
  dayRate: number
}

export default function EstimativasPage() {
  const params = useParams()
  const id = params.id as string
  const [maturidade, setMaturidade] = useState<Maturidade>('media')
  const [linhas, setLinhas] = useState<LinhaEstimativa[]>(
    ESTIMATIVAS.map((e) => ({ ...e, fatorAjuste: 1.0, dayRate: 1500 }))
  )
  const [loading, setLoading] = useState(true)
  const salvandoTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    carregarEstimativas(id).then((est) => {
      if (Object.keys(est).length > 0) {
        setLinhas((prev) =>
          prev.map((l) => {
            const salvo = est[l.id]
            if (salvo) {
              return {
                ...l,
                fatorAjuste: (salvo.fatorAjuste as number) ?? 1.0,
                dayRate: (salvo.dayRate as number) ?? 1500,
              }
            }
            return l
          })
        )
        if (est['_config']?.maturidade) {
          setMaturidade(est['_config'].maturidade as Maturidade)
        }
      }
      setLoading(false)
    })
  }, [id])

  function getHorasBase(linha: LinhaEstimativa) {
    if (maturidade === 'baixa') return linha.horasBaixa
    if (maturidade === 'alta') return linha.horasAlta
    return linha.horasMedia
  }

  function getHorasEstimadas(linha: LinhaEstimativa) {
    return Math.round(getHorasBase(linha) * linha.fatorAjuste)
  }

  function getCusto(linha: LinhaEstimativa) {
    return (getHorasEstimadas(linha) / 8) * linha.dayRate
  }

  const totalHoras = linhas.reduce((acc, l) => acc + getHorasEstimadas(l), 0)
  const totalCusto = linhas.reduce((acc, l) => acc + getCusto(l), 0)

  function salvarComDebounce(novasLinhas: LinhaEstimativa[], novaMatuidade: Maturidade) {
    if (salvandoTimer.current) clearTimeout(salvandoTimer.current)
    salvandoTimer.current = setTimeout(async () => {
      await Promise.all([
        salvarEstimativa(id, '_config', { maturidade: novaMatuidade }),
        ...novasLinhas.map((l) =>
          salvarEstimativa(id, l.id, {
            fatorAjuste: l.fatorAjuste,
            dayRate: l.dayRate,
          })
        ),
      ])
    }, 1000)
  }

  function atualizarLinha(itemId: string, campo: 'fatorAjuste' | 'dayRate', valor: number) {
    const novas = linhas.map((l) => (l.id === itemId ? { ...l, [campo]: valor } : l))
    setLinhas(novas)
    salvarComDebounce(novas, maturidade)
  }

  function mudarMaturidade(m: Maturidade) {
    setMaturidade(m)
    salvarComDebounce(linhas, m)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-xl max-w-6xl mx-auto">
      <div className="mb-xl">
        <h2 className="page-title">Estimativa de Esforço de Consultoria</h2>
        <p className="page-subtitle">
          Referências baseadas em experiência de mercado com projetos ISO 27001 no contexto brasileiro
        </p>
      </div>

      {/* Aviso metodológico */}
      <div className="norm-box mb-xl" style={{ borderLeftColor: 'rgba(255,154,10,0.6)' }}>
        <p className="norm-label" style={{ color: '#B85A00' }}>Aviso Metodológico</p>
        <p className="norm-text">
          Estes valores NÃO constituem proposta comercial. São referências para orientar o planejamento.
          Calibre o Fator de ajuste por linha e valide o total antes de formalizar qualquer orçamento.
        </p>
      </div>

      {/* Seletor de maturidade + totais */}
      <div className="glass-panel p-xl mb-xl flex flex-wrap items-center gap-xl">
        <div>
          <p className="form-label mb-md">Nível de maturidade da organização:</p>
          <div className="flex gap-sm">
            {(['baixa', 'media', 'alta'] as Maturidade[]).map((m) => (
              <button
                key={m}
                onClick={() => mudarMaturidade(m)}
                className={`px-lg py-sm rounded-lg font-title font-semibold text-[14px] border-2 transition-all ${
                  maturidade === m
                    ? 'border-[#FF7400] bg-[#FF7400]/10 text-[#FF7400]'
                    : 'border-[#2D2D2D]/12 text-[#7F7F7F] hover:border-[#FF7400]/40'
                }`}
              >
                {m === 'baixa' ? 'Baixa' : m === 'media' ? 'Média' : 'Alta'}
              </button>
            ))}
          </div>
        </div>
        <div className="ml-auto flex gap-xl">
          <div className="text-right">
            <p className="form-label">Total de horas</p>
            <p className="font-title text-[28px] font-bold text-[#2D2D2D]">{totalHoras}h</p>
          </div>
          <div className="text-right">
            <p className="form-label">Custo total estimado</p>
            <p className="font-title text-[28px] font-bold text-[#FF7400]">{formatCurrency(totalCusto)}</p>
          </div>
        </div>
      </div>

      {/* Tabela por fase */}
      {FASES.map((fase) => {
        const itens = linhas.filter((l) => l.fase === fase)
        const faseHoras = itens.reduce((acc, l) => acc + getHorasEstimadas(l), 0)
        const faseCusto = itens.reduce((acc, l) => acc + getCusto(l), 0)

        return (
          <div key={fase} className="requirement-panel mb-md">
            <div className="requirement-panel-header">
              <h3 className="font-title text-[14px] font-bold text-[#2D2D2D]">{fase}</h3>
              <div className="flex gap-xl text-[13px] text-[#7F7F7F]">
                <span><span className="font-bold text-[#2D2D2D]">{faseHoras}h</span> estimadas</span>
                <span className="font-bold text-[#FF7400]">{formatCurrency(faseCusto)}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(45,45,45,0.08)' }}>
                    <th className="text-left px-xl py-md form-label w-64">Entregável</th>
                    <th className="text-center px-md py-md form-label">H. Baixa</th>
                    <th className="text-center px-md py-md form-label">H. Média</th>
                    <th className="text-center px-md py-md form-label">H. Alta</th>
                    <th className="text-center px-md py-md form-label">Fator</th>
                    <th className="text-center px-md py-md form-label">H. Estimadas</th>
                    <th className="text-center px-md py-md form-label">Day-rate</th>
                    <th className="text-right px-xl py-md form-label">Custo (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((linha) => (
                    <tr key={linha.id} className="row-hover-effect" style={{ borderBottom: '1px solid rgba(45,45,45,0.06)' }}>
                      <td className="px-xl py-md">
                        <p className="font-body font-semibold text-[#2D2D2D] text-[13px]">{linha.entregavel}</p>
                        <p className="text-[#7F7F7F] text-[12px] mt-0.5">{linha.atividades}</p>
                      </td>
                      <td className="px-md py-md text-center text-[13px] text-[#7F7F7F] font-mono">{linha.horasBaixa}h</td>
                      <td className="px-md py-md text-center text-[13px] text-[#7F7F7F] font-mono">{linha.horasMedia}h</td>
                      <td className="px-md py-md text-center text-[13px] text-[#7F7F7F] font-mono">{linha.horasAlta}h</td>
                      <td className="px-md py-md">
                        <input
                          type="number" step="0.1" min="0.1" max="3"
                          value={linha.fatorAjuste}
                          onChange={(e) => atualizarLinha(linha.id, 'fatorAjuste', parseFloat(e.target.value) || 1)}
                          className="input !min-h-0 !py-1 !px-2 w-16 text-center !text-[13px]"
                        />
                      </td>
                      <td className="px-md py-md text-center">
                        <span className="font-bold text-[#FF7400] font-mono text-[13px]">{getHorasEstimadas(linha)}h</span>
                      </td>
                      <td className="px-md py-md">
                        <input
                          type="number" step="100" min="0"
                          value={linha.dayRate}
                          onChange={(e) => atualizarLinha(linha.id, 'dayRate', parseInt(e.target.value) || 1500)}
                          className="input !min-h-0 !py-1 !px-2 w-20 text-center !text-[13px]"
                        />
                      </td>
                      <td className="px-xl py-md text-right font-bold text-[#2D2D2D] font-mono text-[13px]">
                        {formatCurrency(getCusto(linha))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      {/* Total final */}
      <div className="glass-panel p-xl flex items-center justify-between" style={{ borderLeft: '4px solid #FF7400' }}>
        <div>
          <p className="form-label mb-xs">Total estimado do projeto completo</p>
          <p className="text-[13px] text-[#7F7F7F]">
            Maturidade {maturidade === 'baixa' ? 'baixa' : maturidade === 'media' ? 'média' : 'alta'} · {linhas.length} entregáveis
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#7F7F7F] text-[14px]">{totalHoras} horas</p>
          <p className="font-title text-[32px] font-bold text-[#FF7400]">{formatCurrency(totalCusto)}</p>
        </div>
      </div>
    </div>
  )
}
