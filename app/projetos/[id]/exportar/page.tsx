'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { buscarProjeto, carregarAvaliacoes } from '@/lib/firestore'
import { Projeto, AvaliacaoItem, STATUS_LABELS } from '@/lib/types'
import { REQUISITOS } from '@/lib/data/requisitos'
import { CONTROLES } from '@/lib/data/controles'
import { Loader2, FileText, Table2, Shield } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function ExportarPage() {
  const params = useParams()
  const id = params.id as string
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [reqAv, setReqAv] = useState<Record<string, AvaliacaoItem>>({})
  const [ctrlAv, setCtrlAv] = useState<Record<string, AvaliacaoItem>>({})
  const [loading, setLoading] = useState(true)
  const [exportandoPDF, setExportandoPDF] = useState(false)
  const [exportandoXLSX, setExportandoXLSX] = useState(false)
  const [exportandoSoA, setExportandoSoA] = useState(false)

  useEffect(() => {
    Promise.all([
      buscarProjeto(id),
      carregarAvaliacoes(id, 'requisitos'),
      carregarAvaliacoes(id, 'controles'),
    ]).then(([p, req, ctrl]) => {
      setProjeto(p)
      setReqAv(req)
      setCtrlAv(ctrl)
      setLoading(false)
    })
  }, [id])

  function exportarXLSX() {
    if (!projeto) return
    setExportandoXLSX(true)

    const wb = XLSX.utils.book_new()

    // Aba Capa
    const capaData = [
      ['ISO 27001 Assessment Platform'],
      [],
      ['Organização', projeto.organizacao],
      ['Consultor', projeto.consultor],
      ['Data de início', projeto.dataInicio],
      ['Data de entrega', projeto.dataEntrega],
      ['Versão', projeto.versao],
      ['Classificação', projeto.classificacao],
      [],
      ['Gap Analysis ISO/IEC 27001:2022'],
    ]
    const wsCapa = XLSX.utils.aoa_to_sheet(capaData)
    XLSX.utils.book_append_sheet(wb, wsCapa, 'Capa')

    // Aba Requisitos
    const reqHeaders = [
      'Cláusula', 'Título', 'Status', 'O que foi constatado',
      'Ações de Adequação', 'Prioridade', 'Responsável', 'Prazo',
      'Evidência existente', 'Obs. do consultor',
    ]
    const reqRows = REQUISITOS.map((r) => {
      const av = reqAv[r.id] || {}
      return [
        r.codigo, r.titulo,
        STATUS_LABELS[av.status || 'nao_preenchido'],
        av.constatado || '',
        av.acoes || '',
        av.prioridade || '',
        av.responsavel || '',
        av.prazo || '',
        av.evidencia || '',
        av.obsConsultor || '',
      ]
    })
    const wsReq = XLSX.utils.aoa_to_sheet([reqHeaders, ...reqRows])
    XLSX.utils.book_append_sheet(wb, wsReq, 'Requisitos Cláusulas 4-10')

    // Aba Controles
    const ctrlHeaders = [
      'Controle', 'Nome', 'Status', 'Constatações',
      'Ações de Adequação', 'Prioridade', 'Responsável', 'Prazo',
      'Justif. Exclusão (SoA)',
    ]
    const ctrlRows = CONTROLES.map((c) => {
      const av = ctrlAv[c.id] || {}
      return [
        c.codigo, c.nome,
        STATUS_LABELS[av.status || 'nao_preenchido'],
        av.constatado || '',
        av.acoes || '',
        av.prioridade || '',
        av.responsavel || '',
        av.prazo || '',
        av.justificativaSoA || '',
      ]
    })
    const wsCtrl = XLSX.utils.aoa_to_sheet([ctrlHeaders, ...ctrlRows])
    XLSX.utils.book_append_sheet(wb, wsCtrl, '93 Controles Anexo A')

    XLSX.writeFile(wb, `Gap_Analysis_${projeto.organizacao.replace(/\s/g, '_')}.xlsx`)
    setExportandoXLSX(false)
  }

  function exportarSoA() {
    if (!projeto) return
    setExportandoSoA(true)

    const wb = XLSX.utils.book_new()
    const headers = [
      'Controle', 'Nome do Controle', 'Incluído no SGSI', 'Status de Implementação', 'Justificativa de Exclusão',
    ]
    const rows = CONTROLES.map((c) => {
      const av = ctrlAv[c.id] || {}
      const status = av.status || 'nao_preenchido'
      const incluido = status === 'nao_aplicavel' ? 'Não' : 'Sim'
      return [
        c.codigo,
        c.nome,
        incluido,
        STATUS_LABELS[status],
        av.justificativaSoA || '',
      ]
    })
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    XLSX.utils.book_append_sheet(wb, ws, 'SoA - Declaração de Aplicabilidade')
    XLSX.writeFile(wb, `SoA_${projeto.organizacao.replace(/\s/g, '_')}.xlsx`)
    setExportandoSoA(false)
  }

  async function exportarPDF() {
    if (!projeto) return
    setExportandoPDF(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()

      // Capa
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, pageWidth, 297, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('Gap Analysis', pageWidth / 2, 100, { align: 'center' })
      doc.setFontSize(14)
      doc.text('ISO/IEC 27001:2022', pageWidth / 2, 115, { align: 'center' })
      doc.setFontSize(16)
      doc.text(projeto.organizacao, pageWidth / 2, 145, { align: 'center' })
      doc.setFontSize(10)
      doc.setTextColor(148, 163, 184)
      doc.text(`Consultor: ${projeto.consultor}`, pageWidth / 2, 165, { align: 'center' })
      doc.text(`Período: ${projeto.dataInicio} — ${projeto.dataEntrega}`, pageWidth / 2, 173, { align: 'center' })
      doc.text(`Versão ${projeto.versao} · ${projeto.classificacao}`, pageWidth / 2, 181, { align: 'center' })

      // Requisitos
      doc.addPage()
      doc.setTextColor(15, 23, 42)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Requisitos — Cláusulas 4 a 10', 14, 20)

      autoTable(doc, {
        startY: 28,
        head: [['Cláusula', 'Título', 'Status', 'Ações de Adequação', 'Responsável', 'Prazo']],
        body: REQUISITOS.map((r) => {
          const av = reqAv[r.id] || {}
          return [
            r.codigo,
            r.titulo,
            STATUS_LABELS[av.status || 'nao_preenchido'],
            av.acoes || '—',
            av.responsavel || '—',
            av.prazo || '—',
          ]
        }),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 99, 235] },
        columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 45 } },
      })

      // Controles
      doc.addPage()
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('93 Controles — Anexo A', 14, 20)

      autoTable(doc, {
        startY: 28,
        head: [['Controle', 'Nome', 'Status', 'Ações de Adequação', 'Responsável', 'Prazo']],
        body: CONTROLES.map((c) => {
          const av = ctrlAv[c.id] || {}
          return [
            c.codigo,
            c.nome,
            STATUS_LABELS[av.status || 'nao_preenchido'],
            av.acoes || '—',
            av.responsavel || '—',
            av.prazo || '—',
          ]
        }),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [37, 99, 235] },
        columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 50 } },
      })

      doc.save(`Gap_Analysis_${projeto.organizacao.replace(/\s/g, '_')}.pdf`)
    } finally {
      setExportandoPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const opcoes = [
    {
      icon: <FileText className="h-8 w-8 text-red-500" />,
      titulo: 'Relatório Executivo (PDF)',
      descricao: 'Documento completo com capa, sumário, tabelas de requisitos e controles, e plano de ação.',
      acao: exportarPDF,
      carregando: exportandoPDF,
      label: 'Exportar PDF',
      cor: 'border-red-200 hover:border-red-400',
      btnCor: 'bg-red-600 hover:bg-red-700',
    },
    {
      icon: <Table2 className="h-8 w-8 text-green-600" />,
      titulo: 'Planilha Excel (.xlsx)',
      descricao: 'Exportação completa com abas de Capa, Requisitos e Controles — estrutura idêntica à planilha original.',
      acao: exportarXLSX,
      carregando: exportandoXLSX,
      label: 'Exportar Excel',
      cor: 'border-green-200 hover:border-green-400',
      btnCor: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      titulo: 'Declaração de Aplicabilidade (SoA)',
      descricao: 'Planilha com os 93 controles, status de inclusão/exclusão e justificativas — base para a certificação.',
      acao: exportarSoA,
      carregando: exportandoSoA,
      label: 'Exportar SoA',
      cor: 'border-blue-200 hover:border-blue-400',
      btnCor: 'bg-blue-600 hover:bg-blue-700',
    },
  ]

  return (
    <div className="p-xl max-w-3xl mx-auto">
      <div className="mb-xl">
        <h2 className="page-title">Exportar</h2>
        <p className="page-subtitle">
          Gere os documentos do assessment para {projeto?.organizacao}
        </p>
      </div>

      <div className="form-stack">
        {opcoes.map((op) => (
          <div
            key={op.titulo}
            className="requirement-panel"
          >
            <div className="requirement-panel-body flex items-start gap-lg">
              <div className="flex-shrink-0 p-md rounded-xl" style={{ background: 'rgba(255,116,0,0.08)' }}>
                {op.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-title font-bold text-[16px] text-[#2D2D2D] mb-xs">{op.titulo}</h3>
                <p className="text-[#7F7F7F] text-[14px] leading-relaxed">{op.descricao}</p>
              </div>
              <button
                onClick={op.acao}
                disabled={op.carregando}
                className="flex-shrink-0 flex items-center gap-xs bg-[#FF7400] disabled:opacity-50 text-white px-lg py-sm rounded-lg font-title font-semibold text-[14px] hover:shadow-hover transition-all hover:-translate-y-0.5"
              >
                {op.carregando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  op.label
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
