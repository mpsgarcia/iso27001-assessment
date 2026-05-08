'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { listarProjetos, criarProjeto, excluirProjeto, carregarAvaliacoes } from '@/lib/firestore'
import { Projeto, AvaliacaoItem } from '@/lib/types'
import { REQUISITOS } from '@/lib/data/requisitos'
import { CONTROLES } from '@/lib/data/controles'
import { Loader2 } from 'lucide-react'

export default function ProjetosPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [conformidadeGlobal, setConformidadeGlobal] = useState<number | null>(null)
  const [criticos, setCriticos] = useState(0)
  const [busca, setBusca] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [criando, setCriando] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [form, setForm] = useState({
    organizacao: '',
    consultor: '',
    dataInicio: '',
    dataEntrega: '',
    versao: '1.0',
    classificacao: 'Confidencial',
  })

  useEffect(() => {
    if (!authLoading && !user) { router.replace('/login'); return }
    if (user) carregarProjetos()
  }, [user, authLoading])

  async function carregarProjetos() {
    try {
      const lista = await listarProjetos(user!.uid)
      setProjetos(lista)
      if (lista.length > 0) {
        calcularConformidadeGlobal(lista)
      }
    } catch (e) {
      console.error('Erro ao carregar projetos:', e)
    } finally {
      setLoading(false)
    }
  }

  async function calcularConformidadeGlobal(lista: Projeto[]) {
    const todasAvaliacoes = await Promise.all(
      lista.flatMap((p) => [
        carregarAvaliacoes(p.id, 'requisitos'),
        carregarAvaliacoes(p.id, 'controles'),
      ])
    )
    const allIds = [
      ...REQUISITOS.map((r) => r.id),
      ...CONTROLES.map((c) => c.id),
    ]
    let conformes = 0
    let elegiveis = 0
    let totalCriticos = 0
    todasAvaliacoes.forEach((aval: Record<string, AvaliacaoItem>) => {
      allIds.forEach((id) => {
        const av = aval[id]
        if (!av || av.status === 'nao_preenchido') return
        if (av.status === 'nao_aplicavel') return
        elegiveis++
        if (av.status === 'atende_totalmente') conformes++
        if (av.status === 'nao_atende' && av.prioridade === 'critica') totalCriticos++
      })
    })
    setConformidadeGlobal(elegiveis > 0 ? Math.round((conformes / elegiveis) * 100) : 0)
    setCriticos(totalCriticos)
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    if (form.dataEntrega < form.dataInicio) {
      alert('A data de entrega deve ser igual ou posterior à data de início.')
      return
    }
    setCriando(true)
    try {
      const id = await criarProjeto(user!.uid, form)
      router.push(`/projetos/${id}`)
    } finally {
      setCriando(false)
    }
  }

  async function confirmarExcluir() {
    if (!confirmDelete) return
    setExcluindo(true)
    try {
      await excluirProjeto(confirmDelete)
      setProjetos((prev) => prev.filter((p) => p.id !== confirmDelete))
    } finally {
      setExcluindo(false)
      setConfirmDelete(null)
    }
  }

  const projetosFiltrados = busca.trim()
    ? projetos.filter(
        (p) =>
          p.organizacao.toLowerCase().includes(busca.toLowerCase()) ||
          p.consultor.toLowerCase().includes(busca.toLowerCase())
      )
    : projetos

  const classifColor: Record<string, string> = {
    Confidencial: 'bg-error-container text-on-error-container',
    Restrito: 'bg-surface-container-high text-on-secondary-fixed-variant',
    Interno: 'bg-surface-container text-on-surface-variant',
    Público: 'bg-surface-variant text-on-surface-variant',
  }

  const renderHeader = () => (
    <header className="topbar fixed top-0 right-0 w-[calc(100%-280px)] z-40 px-xl justify-between">
      <div className="flex items-center gap-xl h-full">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            className="input !min-h-[40px] !py-2 pl-10 pr-4 w-64 !text-[14px]"
            placeholder="Buscar projetos..."
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <nav className="hidden md:flex h-full">
          <a className="topbar-tab active" href="/projetos">Projetos</a>
        </nav>
      </div>
      <div className="flex items-center gap-lg">
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-lg py-sm rounded-lg font-title text-title-md hover:shadow-hover transition-all hover:-translate-y-0.5"
        >
          + Novo Projeto
        </button>
        <button className="material-symbols-outlined text-[#7F7F7F] hover:text-[#FF7400] transition-colors">notifications</button>
      </div>
    </header>
  )

  if (authLoading || loading) {
    return (
      <>
        {renderHeader()}
        <main className="pt-16 min-h-screen">
          <div className="p-xl max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-md" />
            <p className="text-on-surface-variant font-inter">Carregando projetos...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      {/* Header */}
      {renderHeader()}

      {/* Main */}
      <main className="pt-16 min-h-screen">
        <div className="p-xl max-w-7xl mx-auto">

          {/* Título */}
          <div className="flex justify-between items-end mb-xl animate-fade-in">
            <div>
              <h2 className="font-manrope text-display-xl text-on-surface mb-xs">Projetos de Auditoria</h2>
              <p className="text-on-surface-variant font-inter text-body-base">
                Gerencie suas avaliações de conformidade ISO 27001 em tempo real.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-xs bg-primary text-on-primary px-xl py-sm rounded-lg font-title text-title-md hover:shadow-[0_16px_40px_rgba(255,116,0,0.15)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Novo Projeto
            </button>
          </div>

          {/* Stats bento */}
          <div className="grid grid-cols-12 gap-lg mb-xl animate-slide-up">
            <div className="col-span-12 lg:col-span-8 glass-panel p-lg rounded-xl flex items-center justify-between glow-border transition-all duration-300">
              <div className="flex items-center gap-xl">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="transparent" stroke="rgba(63, 63, 70, 0.5)" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r="40" fill="transparent"
                      stroke="#a855f7" strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - (conformidadeGlobal ?? 0) / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-manrope text-headline-lg text-primary font-bold">
                    {projetos.length === 0 ? '—' : conformidadeGlobal === null ? '...' : `${conformidadeGlobal}%`}
                  </div>
                </div>
                <div>
                  <h3 className="font-manrope text-headline-lg text-on-surface">Conformidade Global</h3>
                  <p className="text-body-sm text-on-surface-variant font-inter">
                    Baseado em {projetos.length} projeto{projetos.length !== 1 ? 's' : ''} ativo{projetos.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
              <div className="flex gap-lg">
                <div className="text-center">
                  <span className="block font-manrope text-display-xl text-on-surface">{projetos.length.toString().padStart(2, '0')}</span>
                  <span className="text-label-caps font-inter text-on-surface-variant uppercase">Ativos</span>
                </div>
                <div className="text-center">
                  <span className="block font-manrope text-display-xl text-error">{String(criticos).padStart(2, '0')}</span>
                  <span className="text-label-caps font-inter text-on-surface-variant uppercase">Críticos</span>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 bg-white rounded-xl overflow-hidden relative min-h-[160px] shadow-sm border border-[rgba(45,45,45,0.08)]">
              <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: 'linear-gradient(90deg, #FF7400, #FF9A0A)' }} />
              <div className="relative p-lg h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-xs mb-xs">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: '#FF7400' }}>picture_as_pdf</span>
                    <h4 className="font-title text-[17px] font-bold text-[#2D2D2D]">Relatório Mensal</h4>
                  </div>
                  <p className="text-[13px] text-[#7F7F7F] leading-relaxed">Exporte sua análise de lacunas ISO 27001 em PDF ou Excel.</p>
                </div>
                <button
                  onClick={() => projetos.length > 0 && router.push(`/projetos/${projetos[0].id}/exportar`)}
                  disabled={projetos.length === 0}
                  className="self-start text-white font-title font-semibold text-[13px] px-lg py-xs rounded-lg transition-all hover:-translate-y-0.5 mt-md disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: '#FF7400', boxShadow: '0 6px 20px rgba(255,116,0,0.25)' }}
                >
                  Exportar PDF
                </button>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="px-xl py-lg border-b border-outline-variant/30 flex justify-between items-center bg-white">
              <h3 className="font-manrope text-headline-lg text-on-surface">Lista de Projetos</h3>
              <div className="flex items-center gap-md">
                <button className="flex items-center gap-xs px-md py-xs border border-outline-variant rounded-lg text-body-sm hover:bg-surface-variant/10 transition-colors font-inter">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Filtrar
                </button>
              </div>
            </div>

            {projetos.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-[64px] text-outline/40 block mb-md">folder_open</span>
                <h3 className="font-manrope text-title-md text-on-surface mb-xs">Nenhum projeto ainda</h3>
                <p className="text-on-surface-variant text-body-sm font-inter mb-lg">Crie seu primeiro projeto de assessment ISO 27001</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-xs bg-secondary text-on-secondary px-xl py-sm rounded-lg font-manrope text-title-md hover:shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Criar Projeto
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/50">
                        {['Projeto', 'Consultor', 'Período', 'Classificação', 'Versão', ''].map((h) => (
                          <th key={h} className="px-xl py-md font-inter text-label-caps text-on-surface-variant uppercase">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {projetosFiltrados.map((projeto) => (
                        <tr
                          key={projeto.id}
                          className="row-hover-effect cursor-pointer"
                          onClick={() => router.push(`/projetos/${projeto.id}`)}
                        >
                          <td className="px-xl py-lg">
                            <div className="flex items-center gap-md">
                              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined">corporate_fare</span>
                              </div>
                              <div>
                                <p className="font-manrope text-title-md text-on-surface">{projeto.organizacao}</p>
                                <p className="text-body-sm text-on-surface-variant font-inter">ISO 27001:2022</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-xl py-lg">
                            <div className="flex items-center gap-xs">
                              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-xs font-bold">
                                {projeto.consultor?.[0]?.toUpperCase()}
                              </div>
                              <span className="font-inter text-body-base">{projeto.consultor}</span>
                            </div>
                          </td>
                          <td className="px-xl py-lg">
                            <p className="font-inter text-body-sm text-on-surface font-medium">{projeto.dataInicio}</p>
                            <p className="font-inter text-body-sm text-on-surface-variant">{projeto.dataEntrega}</p>
                          </td>
                          <td className="px-xl py-lg">
                            <span className={`px-md py-1 rounded-full text-label-caps font-inter text-[10px] uppercase ${classifColor[projeto.classificacao] || 'bg-surface-container text-on-surface-variant'}`}>
                              {projeto.classificacao}
                            </span>
                          </td>
                          <td className="px-xl py-lg">
                            <span className="font-inter text-body-sm text-on-surface-variant">v{projeto.versao}</span>
                          </td>
                          <td className="px-xl py-lg text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmDelete(projeto.id) }}
                              className="material-symbols-outlined text-outline hover:text-error transition-colors"
                            >
                              delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-xl py-md bg-surface-container-lowest border-t border-outline-variant/30 flex justify-between items-center">
                  <p className="font-inter text-body-sm text-on-surface-variant">
                    Mostrando {projetosFiltrados.length} de {projetos.length} projeto{projetos.length !== 1 ? 's' : ''}
                    {busca && <span className="ml-xs text-primary">· "{busca}"</span>}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="glass-panel border border-outline-variant/50 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] w-full max-w-sm animate-slide-up">
            <div className="px-xl py-lg border-b border-outline-variant/30 flex items-center gap-md">
              <span className="material-symbols-outlined text-error text-[24px]">warning</span>
              <h2 className="font-manrope text-headline-lg text-on-surface">Excluir projeto?</h2>
            </div>
            <div className="px-xl py-lg">
              <p className="font-inter text-body-base text-on-surface-variant">
                Esta ação é irreversível. Todas as avaliações, controles e dados do projeto serão permanentemente apagados.
              </p>
            </div>
            <div className="px-xl py-lg border-t border-outline-variant/30 flex gap-sm">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={excluindo}
                className="flex-1 px-lg py-sm border border-outline-variant text-on-surface-variant font-inter font-semibold rounded-lg hover:bg-surface-variant/10 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExcluir}
                disabled={excluindo}
                className="flex-1 bg-error text-on-error px-lg py-sm rounded-lg font-manrope text-title-md hover:brightness-110 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-xs"
              >
                {excluindo ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Excluindo...</>
                ) : (
                  'Sim, excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal novo projeto */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="glass-panel border border-outline-variant/50 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] w-full max-w-[512px] animate-slide-up">
            <div className="px-xl py-lg border-b border-outline-variant/30">
              <h2 className="font-manrope text-headline-lg text-on-surface">Novo Projeto de Assessment</h2>
              <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
                Preencha os dados de identificação do projeto
              </p>
            </div>
            <form onSubmit={handleCriar} className="px-xl py-lg space-y-lg">
              <div className="form-group">
                <label className="form-label">Organização <span className="required">*</span></label>
                <input
                  required
                  value={form.organizacao}
                  onChange={(e) => setForm({ ...form, organizacao: e.target.value })}
                  placeholder="Nome da empresa avaliada"
                  className="input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Consultor Responsável <span className="required">*</span></label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">person</span>
                  <input
                    required
                    value={form.consultor}
                    onChange={(e) => setForm({ ...form, consultor: e.target.value })}
                    placeholder="Nome do consultor"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="form-group">
                  <label className="form-label">Data de Início <span className="required">*</span></label>
                  <input
                    required type="date"
                    value={form.dataInicio}
                    onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Entrega Prevista <span className="required">*</span></label>
                  <input
                    required type="date"
                    value={form.dataEntrega}
                    onChange={(e) => setForm({ ...form, dataEntrega: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="form-group">
                  <label className="form-label">Versão</label>
                  <input
                    value={form.versao}
                    onChange={(e) => setForm({ ...form, versao: e.target.value })}
                    placeholder="v1.0"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Classificação</label>
                  <div className="input-with-icon">
                    <span className="material-symbols-outlined">lock</span>
                    <select
                      value={form.classificacao}
                      onChange={(e) => setForm({ ...form, classificacao: e.target.value })}
                      style={{ colorScheme: 'light' }}
                      className="appearance-none"
                    >
                      <option>Confidencial</option>
                      <option>Restrito</option>
                      <option>Interno</option>
                      <option>Público</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-sm pt-xs">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-lg py-sm border border-outline-variant text-on-surface-variant font-inter font-semibold rounded-lg hover:bg-surface-variant/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={criando}
                  className="flex-1 bg-secondary text-on-secondary px-lg py-sm rounded-lg font-manrope text-title-md hover:brightness-110 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-xs"
                >
                  {criando ? <><Loader2 className="h-4 w-4 animate-spin" />Criando...</> : 'Criar Projeto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
