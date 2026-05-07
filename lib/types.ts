export type StatusAvaliacao =
  | 'nao_atende'
  | 'atende_parcialmente'
  | 'atende_totalmente'
  | 'nao_aplicavel'
  | 'nao_preenchido'

export type Prioridade = 'critica' | 'alta' | 'media' | 'baixa' | ''

export const STATUS_LABELS: Record<StatusAvaliacao, string> = {
  nao_atende: 'Não atende',
  atende_parcialmente: 'Atende Parcialmente',
  atende_totalmente: 'Atende Totalmente',
  nao_aplicavel: 'Não Aplicável',
  nao_preenchido: 'Não preenchido',
}

export const STATUS_COLORS: Record<StatusAvaliacao, string> = {
  nao_atende: '#ef4444',
  atende_parcialmente: '#f97316',
  atende_totalmente: '#22c55e',
  nao_aplicavel: '#94a3b8',
  nao_preenchido: '#e2e8f0',
}

export const PRIORIDADE_LABELS: Record<string, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

export interface AvaliacaoItem {
  status: StatusAvaliacao
  constatado: string
  acoes: string
  prioridade: Prioridade
  responsavel: string
  prazo: string
  evidencia: string
  obsConsultor: string
  justificativaSoA?: string
}

export interface Projeto {
  id: string
  organizacao: string
  consultor: string
  dataInicio: string
  dataEntrega: string
  versao: string
  classificacao: string
  logoUrl?: string
  criadoEm: string
  atualizadoEm: string
  uid: string
}

export interface AvaliacaoRequisito extends AvaliacaoItem {
  clausulaId: string
}

export interface AvaliacaoControle extends AvaliacaoItem {
  controleId: string
}
