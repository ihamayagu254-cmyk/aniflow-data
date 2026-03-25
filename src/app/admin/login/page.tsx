'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Eye, EyeOff, Lock, Play, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Senha incorreta')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-glow flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-2xl gradient-text">AniFlow</span>
          </Link>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Área Admin</h1>
          <p className="text-text-muted text-sm mt-2">Acesso restrito ao administrador</p>
        </div>

        {/* Form */}
        <div className="bg-bg-card border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Senha de Administrador
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="input-dark w-full pl-10 pr-12 py-3.5 rounded-xl text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-glow w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</>
              ) : (
                <><Shield className="w-4 h-4" /> Entrar no Admin</>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-bg-hover rounded-xl border border-white/5">
            <p className="text-text-muted text-xs leading-relaxed">
              <strong className="text-text-secondary">💡 Configuração:</strong> Defina a variável de ambiente{' '}
              <code className="font-mono text-accent-purple bg-black/30 px-1 rounded">ADMIN_PASSWORD</code>{' '}
              no seu projeto Vercel para definir a senha.
            </p>
          </div>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          <Link href="/" className="hover:text-text-secondary transition-colors">
            ← Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  )
}
