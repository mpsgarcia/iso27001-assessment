'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { criarUsuarioComoAdmin } from '@/lib/auth'
import { listarUsuarios, registrarNovoUsuario, atualizarRoleUsuario } from '@/lib/firestore'
import { Usuario, RoleUsuario } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export default function ConfiguracoesPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loadingUsuarios, setLoadingUsuarios] = useState(true)
  const [criando, setCriando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const [form, setForm] = useState({ email: '', role: 'user' as RoleUsuario })

  useEffect(() => {
    if (!authLoading && !user) { router.replace('/login'); return }
    if (!authLoading && !isAdmin) { router.replace('/projetos'); return }
    if (!authLoading && isAdmin) carregarUsuarios()
  }, [authLoading, user, isAdmin])

  async function carregarUsuarios() {
    setLoadingUsuarios(true)
    try {
      const lista = await listarUsuarios()
      setUsuarios(lista.sort((a, b) => a.email.localeCompare(b.email)))
    } finally {
      setLoadingUsuarios(false)
    }
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setCriando(true)
    try {
      const uid = await criarUsuarioComoAdmin(form.email)
      await registrarNovoUsuario(uid, form.email)
      if (form.role === 'admin') {
        await atualizarRoleUsuario(uid, 'admin')
      }
      setSucesso(`Conta criada! Um e-mail de definição de senha foi enviado para ${form.email}.`)
      setForm({ email: '', role: 'user' })
      carregarUsuarios()
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('email-already-in-use')) setErro('Este e-mail já possui uma conta.')
        else if (err.message.includes('restrito')) setErro(err.message)
        else setErro('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setCriando(false)
    }
  }

  async function handleToggleRole(u: Usuario) {
    const novaRole: RoleUsuario = u.role === 'admin' ? 'user' : 'admin'
    await atualizarRoleUsuario(u.uid, novaRole)
    setUsuarios((prev) => prev.map((x) => x.uid === u.uid ? { ...x, role: novaRole } : x))
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="p-xl max-w-4xl mx-auto">

      {/* Título */}
      <div className="mb-xl">
        <h2 className="page-title">Configurações</h2>
        <p className="page-subtitle">Gerencie os usuários com acesso à plataforma.</p>
      </div>

      <div className="grid grid-cols-12 gap-lg">

        {/* Formulário de criação */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white rounded-xl border border-[rgba(45,45,45,0.08)] shadow-sm p-xl">
            <div className="flex items-center gap-xs mb-lg">
              <span className="material-symbols-outlined text-primary">person_add</span>
              <h3 className="font-title font-bold text-[16px] text-[#2D2D2D]">Criar Novo Usuário</h3>
            </div>

            <form onSubmit={handleCriar} className="space-y-md">
              <div className="form-group">
                <label className="form-label">E-mail corporativo <span className="required">*</span></label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="nome@spread.com.br"
                  />
                </div>
                <p className="font-body text-[12px] text-[#7F7F7F] mt-xs">
                  O usuário receberá um e-mail para definir a própria senha.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Perfil</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">shield_person</span>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as RoleUsuario })}
                    style={{ colorScheme: 'light' }}
                    className="appearance-none"
                  >
                    <option value="user">Consultor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              {erro && (
                <div
                  className="flex items-center gap-xs rounded-lg px-md py-sm font-body text-[13px]"
                  style={{ background: 'rgba(204,34,0,0.08)', border: '1px solid rgba(204,34,0,0.20)', color: '#CC2200' }}
                >
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {erro}
                </div>
              )}

              {sucesso && (
                <div
                  className="flex items-center gap-xs rounded-lg px-md py-sm font-body text-[13px]"
                  style={{ background: 'rgba(0,150,104,0.08)', border: '1px solid rgba(0,150,104,0.20)', color: '#009668' }}
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  {sucesso}
                </div>
              )}

              <button
                type="submit"
                disabled={criando}
                className="w-full py-sm bg-secondary text-on-secondary font-title font-semibold text-[14px] rounded-lg transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-xs"
              >
                {criando ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Criando...</>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">person_add</span>Criar usuário</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de usuários */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white rounded-xl border border-[rgba(45,45,45,0.08)] shadow-sm overflow-hidden">
            <div className="px-xl py-lg border-b border-[rgba(45,45,45,0.08)]">
              <h3 className="font-title font-bold text-[16px] text-[#2D2D2D]">Usuários Cadastrados</h3>
            </div>

            {loadingUsuarios ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-secondary" />
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-[48px] block mb-md" style={{ color: 'rgba(45,45,45,0.2)' }}>group</span>
                <p className="font-body text-[14px] text-[#7F7F7F]">Nenhum usuário cadastrado.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[rgba(45,45,45,0.06)]">
                {usuarios.map((u) => {
                  const isCurrentUser = u.uid === user?.uid
                  return (
                    <li key={u.uid} className="flex items-center justify-between px-xl py-md">
                      <div className="flex items-center gap-md">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: u.role === 'admin' ? '#FF7400' : '#4B1196' }}
                        >
                          {u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-body text-[14px] text-[#2D2D2D] font-semibold">
                            {u.email}
                            {isCurrentUser && (
                              <span className="ml-xs font-body text-[11px] text-[#7F7F7F]">(você)</span>
                            )}
                          </p>
                          <p className="font-body text-[12px] text-[#7F7F7F]">
                            {u.role === 'admin' ? 'Administrador' : 'Consultor'}
                          </p>
                        </div>
                      </div>

                      {!isCurrentUser && (
                        <button
                          onClick={() => handleToggleRole(u)}
                          title={u.role === 'admin' ? 'Remover admin' : 'Tornar admin'}
                          className="flex items-center gap-xs px-md py-xs rounded-lg font-body text-[12px] font-semibold transition-all"
                          style={{
                            background: u.role === 'admin' ? 'rgba(255,116,0,0.08)' : 'rgba(75,17,150,0.08)',
                            color: u.role === 'admin' ? '#FF7400' : '#4B1196',
                          }}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {u.role === 'admin' ? 'shield' : 'shield_person'}
                          </span>
                          {u.role === 'admin' ? 'Admin' : 'Consultor'}
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
