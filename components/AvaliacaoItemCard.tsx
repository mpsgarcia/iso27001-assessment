'use client'

import { useState, useCallback } from 'react'
import { AvaliacaoItem, StatusAvaliacao, Prioridade } from '@/lib/types'
import { salvarAvaliacao } from '@/lib/firestore'
import { cn } from '@/lib/utils'
import StatusSelect from '@/components/StatusSelect'

const STATUS_OPTIONS: { value: StatusAvaliacao; label: string; icon: string; color: string }[] = [
  { value: 'nao_preenchido',      label: 'Não preenchido',      icon: 'radio_button_unchecked', color: 'text-outline' },
  { value: 'atende_totalmente',   label: 'Atende Totalmente',   icon: 'check_circle',           color: 'text-on-tertiary-container' },
  { value: 'atende_parcialmente', label: 'Atende Parcialmente', icon: 'pending',                color: 'text-amber-500' },
  { value: 'nao_atende',          label: 'Não atende',          icon: 'cancel',                 color: 'text-error' },
  { value: 'nao_aplicavel',       label: 'Não Aplicável',       icon: 'do_not_disturb_on',      color: 'text-outline' },
]

const STATUS_COLORS: Record<StatusAvaliacao, { text: string; bg: string; icon: string }> = {
  nao_preenchido:      { text: '#7F7F7F', bg: 'rgba(127,127,127,0.10)', icon: '#7F7F7F' },
  atende_totalmente:   { text: '#009668', bg: 'rgba(0,150,104,0.10)',   icon: '#009668' },
  atende_parcialmente: { text: '#B85A00', bg: 'rgba(255,154,10,0.14)',  icon: '#B85A00' },
  nao_atende:          { text: '#CC2200', bg: 'rgba(204,34,0,0.10)',    icon: '#CC2200' },
  nao_aplicavel:       { text: '#4B1196', bg: 'rgba(75,17,150,0.10)',   icon: '#4B1196' },
}

const PRIORIDADES = [
  { value: 'critica', label: 'Crítica' },
  { value: 'alta',    label: 'Alta' },
  { value: 'media',   label: 'Média' },
  { value: 'baixa',   label: 'Baixa' },
]

const STATUS_BADGE: Record<StatusAvaliacao, string> = {
  atende_totalmente:   'conforme',
  atende_parcialmente: 'partial',
  nao_atende:          'fail',
  nao_aplicavel:       'na',
  nao_preenchido:      'pending',
}

interface Props {
  projetoId: string
  tipo: 'requisitos' | 'controles'
  itemId: string
  codigo: string
  titulo: string
  texto: string
  avaliacao?: AvaliacaoItem
  mostrarSoA?: boolean
  onUpdate?: (itemId: string, dados: Partial<AvaliacaoItem>) => void
}

export default function AvaliacaoItemCard({
  projetoId, tipo, itemId, codigo, titulo, texto, avaliacao, mostrarSoA = false, onUpdate,
}: Props) {
  const [expandido, setExpandido] = useState(false)
  const [dados, setDados] = useState<Partial<AvaliacaoItem>>(avaliacao || { status: 'nao_preenchido' })
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const salvar = useCallback((novosDados: Partial<AvaliacaoItem>) => {
    if (timer) clearTimeout(timer)
    const t = setTimeout(() => salvarAvaliacao(projetoId, tipo, itemId, novosDados), 800)
    setTimer(t)
  }, [projetoId, tipo, itemId, timer])

  function atualizar(campo: keyof AvaliacaoItem, valor: string) {
    const novo = { ...dados, [campo]: valor }
    setDados(novo)
    salvar(novo)
    onUpdate?.(itemId, novo)
  }

  const status = (dados.status || 'nao_preenchido') as StatusAvaliacao
  const statusOpt = STATUS_OPTIONS.find((s) => s.value === status)
  const precisaAcao = status === 'nao_atende' || status === 'atende_parcialmente'
  const ehNaoAplicavel = status === 'nao_aplicavel'

  return (
    <div className="requirement-panel">
      {/* Header clicável */}
      <button
        onClick={() => setExpandido((p) => !p)}
        className="requirement-panel-header w-full border-none outline-none text-left"
      >
        <div className="flex items-center gap-md min-w-0">
          <span
            className="material-symbols-outlined flex-shrink-0"
            style={{ color: STATUS_COLORS[status].icon, transition: 'color 0.2s ease' }}
          >
            {statusOpt?.icon}
          </span>
          <span className="font-title text-[11px] font-bold bg-[#FF7400]/10 text-[#FF7400] px-2 py-1 rounded uppercase tracking-widest flex-shrink-0">
            {codigo}
          </span>
          <span className="font-body text-[15px] font-medium truncate">{titulo}</span>
        </div>

        <div className="flex items-center gap-md flex-shrink-0">
          <span
            className="status-chip"
            style={{
              color: STATUS_COLORS[status].text,
              background: STATUS_COLORS[status].bg,
              transition: 'color 0.2s ease, background 0.2s ease',
            }}
          >
            {statusOpt?.label}
          </span>
          <span
            className="material-symbols-outlined text-[#7F7F7F]"
            style={{
              transform: expandido ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            expand_more
          </span>
        </div>
      </button>

      {/* Conteúdo — sempre renderizado, height animado */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: expandido ? '3000px' : '0',
          opacity: expandido ? 1 : 0,
          transition: expandido
            ? 'max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.28s ease'
            : 'max-height 0.35s cubic-bezier(0.55, 0, 0.1, 1), opacity 0.22s ease',
        }}
      >
        <div className="requirement-panel-body form-stack">

          {/* Texto da norma */}
          <div className="norm-box">
            <p className="norm-label">Requisito da Norma</p>
            <p className="norm-text whitespace-pre-line">{texto}</p>
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">
              Status da Avaliação <span className="required">*</span>
            </label>
            <StatusSelect
              value={(dados.status || 'nao_preenchido') as StatusAvaliacao}
              onChange={(v) => atualizar('status', v)}
            />
          </div>

          {/* Constatações */}
          <div className="form-group">
            <label className="form-label">
              O que foi constatado
            </label>
            <textarea
              value={dados.constatado || ''}
              onChange={(e) => atualizar('constatado', e.target.value)}
              placeholder="Descreva o que foi observado durante o assessment..."
              className="textarea textarea-lg"
            />
          </div>

          {/* Justificativa SoA */}
          {mostrarSoA && ehNaoAplicavel && (
            <div className="form-group">
              <label className="form-label">
                Justificativa de Exclusão (SoA) <span className="required">*</span>
              </label>
              <textarea
                rows={2}
                value={dados.justificativaSoA || ''}
                onChange={(e) => atualizar('justificativaSoA', e.target.value)}
                placeholder="Justifique por que este controle não se aplica..."
                className="textarea error"
              />
            </div>
          )}

          {/* Plano de ação */}
          {precisaAcao && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Ações de Adequação <span className="required">*</span>
                </label>
                <textarea
                  rows={3}
                  value={dados.acoes || ''}
                  onChange={(e) => atualizar('acoes', e.target.value)}
                  placeholder="Descreva as ações necessárias para adequação..."
                  className="textarea"
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">
                    Prioridade <span className="required">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={dados.prioridade || ''}
                      onChange={(e) => atualizar('prioridade', e.target.value)}
                      className="select select-trigger appearance-none"
                      style={{ colorScheme: 'light' }}
                    >
                      <option value="">Selecione</option>
                      {PRIORIDADES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7F7F7F]">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Responsável <span className="required">*</span>
                  </label>
                  <input
                    value={dados.responsavel || ''}
                    onChange={(e) => atualizar('responsavel', e.target.value)}
                    placeholder="Nome ou área"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Prazo <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    value={dados.prazo || ''}
                    onChange={(e) => atualizar('prazo', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </>
          )}

          {/* Evidência */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Evidência existente
              </label>
              <div className="input-icon-wrap">
                <span className="material-symbols-outlined input-icon">link</span>
                <input
                  className="input"
                  value={dados.evidencia || ''}
                  onChange={(e) => atualizar('evidencia', e.target.value)}
                  placeholder="Nome do doc, caminho ou URL"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Obs. do consultor
              </label>
              <input
                value={dados.obsConsultor || ''}
                onChange={(e) => atualizar('obsConsultor', e.target.value)}
                placeholder="Notas internas..."
                className="input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
