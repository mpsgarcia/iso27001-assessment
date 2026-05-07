'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

type Tab = 'login' | 'cadastro'

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) router.replace('/projetos')
  }, [user, authLoading, router])

  function resetForm() {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
  }

  function switchTab(t: Tab) {
    setTab(t)
    resetForm()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (tab === 'cadastro' && password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (tab === 'cadastro' && password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      if (tab === 'login') {
        await signIn(email, password)
        router.replace('/projetos')
      } else {
        await signUp(email, password)
        setSuccess('Conta criada com sucesso! Redirecionando...')
        setTimeout(() => router.replace('/projetos'), 1500)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('restrito')) setError(err.message)
        else if (err.message.includes('email-already-in-use')) setError('Este e-mail já está cadastrado.')
        else if (err.message.includes('wrong-password') || err.message.includes('invalid-credential')) setError('E-mail ou senha incorretos.')
        else setError(tab === 'login' ? 'E-mail ou senha incorretos.' : 'Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F5FA' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#FF7400' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F7F5FA' }}>

      {/* Painel esquerdo — Branding */}
      <div
        className="hidden lg:flex w-[420px] flex-col justify-between p-12 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #FF7400 0%, #CC4400 100%)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[22px]">verified_user</span>
            </div>
            <div>
              <h1 className="font-title text-[22px] font-bold text-white leading-tight">GRC Shield</h1>
              <p className="font-body text-[11px] text-white/70 uppercase tracking-widest">ISO 27001 Assessment</p>
            </div>
          </div>
          <p className="font-body text-[15px] text-white/80 leading-relaxed">
            Plataforma profissional de Gap Analysis para ISO/IEC 27001:2022 — desenvolvida pela Spread Tecnologia.
          </p>
        </div>

        <div className="space-y-6">
          {[
            { icon: 'verified_user',  title: 'Gap Analysis Completo',    desc: '26 requisitos + 93 controles avaliados em tempo real' },
            { icon: 'dashboard',      title: 'Dashboard Executivo',       desc: 'Conformidade, progresso e plano de ação em um painel' },
            { icon: 'picture_as_pdf', title: 'Relatórios Automáticos',   desc: 'Exporte PDF, Excel e SoA com um clique' },
          ].map((item) => (
            <div key={item.icon} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-[18px]">{item.icon}</span>
              </div>
              <div>
                <p className="font-title text-[14px] text-white font-semibold">{item.title}</p>
                <p className="font-body text-[13px] text-white/65 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="font-body text-[11px] text-white/40 uppercase tracking-widest">
          © 2025 Spread Tecnologia
        </p>
      </div>

      {/* Painel direito — Formulário */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[440px]">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3" style={{ background: '#FF7400' }}>
              <span className="material-symbols-outlined text-white text-[28px]">verified_user</span>
            </div>
            <h1 className="font-title text-[22px] font-bold" style={{ color: '#2D2D2D' }}>GRC Shield</h1>
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-8"
            style={{ background: 'rgba(45,45,45,0.07)' }}
          >
            {(['login', 'cadastro'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="flex-1 py-2.5 rounded-lg font-title text-[14px] font-semibold transition-all"
                style={{
                  background: tab === t ? '#FFFFFF' : 'transparent',
                  color: tab === t ? '#FF7400' : '#7F7F7F',
                  boxShadow: tab === t ? '0 2px 8px rgba(45,45,45,0.10)' : 'none',
                  transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {t === 'login' ? 'Entrar' : 'Criar Conta'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="font-title text-[26px] font-bold" style={{ color: '#2D2D2D' }}>
              {tab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="font-body text-[14px] mt-1" style={{ color: '#7F7F7F' }}>
              {tab === 'login'
                ? 'Faça login com seu e-mail corporativo para continuar.'
                : 'Cadastre-se com seu e-mail @spread.com.br.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* E-mail */}
            <div>
              <label className="font-title text-[12px] font-semibold block mb-1.5" style={{ color: '#5F5F5F' }}>
                E-mail corporativo
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 transition-all"
                style={{
                  border: '1px solid rgba(45,45,45,0.20)',
                  background: '#FFFFFF',
                  minHeight: 50,
                }}
                onFocus={() => {}} // handled by CSS below
              >
                <span className="material-symbols-outlined text-[20px] flex-shrink-0" style={{ color: '#7F7F7F' }}>mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@spread.com.br"
                  required
                  className="flex-1 border-none outline-none bg-transparent font-body text-[15px]"
                  style={{ color: '#2D2D2D' }}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="font-title text-[12px] font-semibold block mb-1.5" style={{ color: '#5F5F5F' }}>
                Senha
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 transition-all"
                style={{ border: '1px solid rgba(45,45,45,0.20)', background: '#FFFFFF', minHeight: 50 }}
              >
                <span className="material-symbols-outlined text-[20px] flex-shrink-0" style={{ color: '#7F7F7F' }}>lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="flex-1 border-none outline-none bg-transparent font-body text-[15px]"
                  style={{ color: '#2D2D2D' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ color: '#9A9A9A' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirmar senha — só no cadastro */}
            {tab === 'cadastro' && (
              <div style={{ animation: 'slideDown 0.2s ease both' }}>
                <label className="font-title text-[12px] font-semibold block mb-1.5" style={{ color: '#5F5F5F' }}>
                  Confirmar senha
                </label>
                <div
                  className="flex items-center gap-3 rounded-xl px-4 transition-all"
                  style={{ border: '1px solid rgba(45,45,45,0.20)', background: '#FFFFFF', minHeight: 50 }}
                >
                  <span className="material-symbols-outlined text-[20px] flex-shrink-0" style={{ color: '#7F7F7F' }}>lock_reset</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="flex-1 border-none outline-none bg-transparent font-body text-[15px]"
                    style={{ color: '#2D2D2D' }}
                  />
                </div>
              </div>
            )}

            {/* Erro */}
            {error && (
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 font-body text-[13px]"
                style={{ background: 'rgba(204,34,0,0.08)', border: '1px solid rgba(204,34,0,0.20)', color: '#CC2200' }}
              >
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Sucesso */}
            {success && (
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 font-body text-[13px]"
                style={{ background: 'rgba(0,150,104,0.08)', border: '1px solid rgba(0,150,104,0.20)', color: '#009668' }}
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {success}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-title text-[15px] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #FF7400, #CC4400)',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(255,116,0,0.30)',
              }}
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" />{tab === 'login' ? 'Entrando...' : 'Criando conta...'}</>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    {tab === 'login' ? 'login' : 'person_add'}
                  </span>
                  {tab === 'login' ? 'Entrar na plataforma' : 'Criar minha conta'}
                </>
              )}
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="font-body text-[13px]" style={{ color: '#9A9A9A' }}>
              Acesso restrito a colaboradores{' '}
              <span className="font-semibold" style={{ color: '#4B1196' }}>@spread.com.br</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
