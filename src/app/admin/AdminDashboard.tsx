'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus, Edit2, Trash2, CheckCircle, XCircle, Shield,
  Database, Play, Film, MessageSquare, LogOut, Eye,
  RefreshCw, Loader2, AlertTriangle, Github, ExternalLink
} from 'lucide-react'
import { Anime } from '@/types'
import AnimeFormModal from './AnimeFormModal'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Props {
  initialAnimes: Anime[]
  dbStatus: { ok: boolean; error: string }
}

export default function AdminDashboard({ initialAnimes, dbStatus }: Props) {
  const [animes, setAnimes] = useState<Anime[]>(initialAnimes)
  const [modal, setModal] = useState<{ open: boolean; anime?: Anime }>({ open: false })
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/animes?limit=200')
      const data = await res.json()
      setAnimes(data.animes || [])
      showToast('Dados atualizados!')
    } catch {
      showToast('Erro ao atualizar', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (anime: Anime) => {
    if (!confirm(`Deletar "${anime.titulo}"? Esta ação não pode ser desfeita.`)) return
    setDeleting(anime.id)
    try {
      const res = await fetch(`/api/animes/crud?id=${anime.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAnimes(prev => prev.filter(a => a.id !== anime.id))
      showToast(`"${anime.titulo}" removido com sucesso!`)
    } catch (e) {
      showToast(String(e), 'error')
    } finally {
      setDeleting(null)
    }
  }

  const handleSave = (saved: Anime, isNew: boolean) => {
    if (isNew) {
      setAnimes(prev => [saved, ...prev])
      showToast(`"${saved.titulo}" adicionado! Commit criado no GitHub ✅`)
    } else {
      setAnimes(prev => prev.map(a => a.id === saved.id ? saved : a))
      showToast(`"${saved.titulo}" atualizado! Commit criado no GitHub ✅`)
    }
    setModal({ open: false })
  }

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  const totalEps = animes.reduce((acc, a) => acc + a.episodios.length, 0)

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium animate-slide-up max-w-sm',
          toast.type === 'success'
            ? 'bg-green-500/20 border-green-500/30 text-green-300'
            : 'bg-red-500/20 border-red-500/30 text-red-300'
        )}>
          {toast.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <XCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-bg-secondary border-r border-white/5 fixed top-0 left-0 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-glow flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-bold gradient-text">AniFlow</span>
            </Link>
            <div className="mt-3 flex items-center gap-2 px-2 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-purple-300 text-xs font-medium">Painel Admin</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            <SidebarLink active icon={<Film className="w-4 h-4" />} label="Animes" count={animes.length} />
            <a href="/search" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all text-sm">
              <Eye className="w-4 h-4" />
              Ver Site
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
          </nav>

          {/* DB Status */}
          <div className="p-4 border-t border-white/5">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border',
              dbStatus.ok
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            )}>
              <Github className="w-3.5 h-3.5" />
              GitHub {dbStatus.ok ? 'Conectado ✓' : 'Erro ✗'}
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/5 transition-all text-sm mt-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-64 flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary">Gerenciar Animes</h1>
              <p className="text-text-muted text-sm mt-1">
                Cada alteração cria um commit automático no GitHub
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card border border-white/5 text-text-secondary hover:text-text-primary transition-all text-sm"
              >
                <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                Atualizar
              </button>
              <button
                onClick={() => setModal({ open: true })}
                className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
              >
                <Plus className="w-4 h-4" /> Novo Anime
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard icon={<Film className="w-5 h-5 text-purple-400" />} label="Total de Animes" value={animes.length} color="purple" />
            <StatCard icon={<Play className="w-5 h-5 text-pink-400" />} label="Total de Episódios" value={totalEps} color="pink" />
            <StatCard icon={<Database className="w-5 h-5 text-cyan-400" />} label="GitHub como DB" value="Ativo" color="cyan" isText />
          </div>

          {/* GitHub Info Banner */}
          {!dbStatus.ok && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 font-medium text-sm">GitHub não configurado</p>
                <p className="text-red-400/70 text-xs mt-1">
                  Configure as variáveis GITHUB_TOKEN, GITHUB_OWNER e GITHUB_REPO no Vercel.
                </p>
                <p className="text-red-400/50 text-xs mt-1 font-mono">{dbStatus.error}</p>
              </div>
            </div>
          )}

          {/* Animes Table */}
          {animes.length === 0 ? (
            <div className="text-center py-20 bg-bg-card rounded-2xl border border-white/5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-glow mx-auto mb-4 flex items-center justify-center opacity-20">
                <Film className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-text-primary font-semibold text-lg mb-2">Nenhum anime cadastrado</h3>
              <p className="text-text-muted text-sm mb-6">Clique em "Novo Anime" para começar</p>
              <button
                onClick={() => setModal({ open: true })}
                className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
              >
                <Plus className="w-4 h-4" /> Adicionar Primeiro Anime
              </button>
            </div>
          ) : (
            <div className="bg-bg-card rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-text-muted text-xs font-semibold uppercase tracking-wider">Anime</th>
                    <th className="text-left px-6 py-4 text-text-muted text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Gêneros</th>
                    <th className="text-left px-6 py-4 text-text-muted text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Eps</th>
                    <th className="text-left px-6 py-4 text-text-muted text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Status</th>
                    <th className="text-right px-6 py-4 text-text-muted text-xs font-semibold uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {animes.map(anime => (
                    <tr key={anime.id} className="hover:bg-white/2 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded-lg overflow-hidden relative flex-shrink-0 bg-bg-hover">
                            {anime.capa ? (
                              <Image src={anime.capa} alt={anime.titulo} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Film className="w-4 h-4 text-text-muted" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-text-primary font-medium text-sm">{anime.titulo}</p>
                            {anime.ano && <p className="text-text-muted text-xs">{anime.ano}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {anime.generos.slice(0, 2).map(g => (
                            <span key={g} className="badge bg-white/5 text-text-muted border border-white/10 capitalize">
                              {g}
                            </span>
                          ))}
                          {anime.generos.length > 2 && (
                            <span className="text-text-muted text-xs">+{anime.generos.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-text-secondary text-sm font-mono">{anime.episodios.length}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {anime.status && (
                          <span className={cn('badge', {
                            'bg-green-500/20 text-green-400 border border-green-500/30': anime.status === 'Em lançamento',
                            'bg-blue-500/20 text-blue-400 border border-blue-500/30': anime.status === 'Completo',
                            'bg-orange-500/20 text-orange-400 border border-orange-500/30': anime.status === 'Em breve',
                          })}>
                            {anime.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/anime/${anime.id}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary transition-all"
                            title="Ver página"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setModal({ open: true, anime })}
                            className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-text-muted hover:text-purple-400 transition-all"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(anime)}
                            disabled={deleting === anime.id}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-all disabled:opacity-50"
                            title="Deletar"
                          >
                            {deleting === anime.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Anime Form Modal */}
      {modal.open && (
        <AnimeFormModal
          anime={modal.anime}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}

function StatCard({
  icon, label, value, color, isText
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  color: 'purple' | 'pink' | 'cyan'
  isText?: boolean
}) {
  const colors = {
    purple: 'bg-purple-500/10 border-purple-500/20',
    pink: 'bg-pink-500/10 border-pink-500/20',
    cyan: 'bg-cyan-500/10 border-cyan-500/20',
  }
  return (
    <div className={cn('rounded-2xl border p-5', colors[color])}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-text-muted text-sm">{label}</span>
      </div>
      <p className={cn('font-display font-bold', isText ? 'text-2xl gradient-text' : 'text-3xl text-text-primary')}>
        {value}
      </p>
    </div>
  )
}

function SidebarLink({
  active, icon, label, count
}: {
  active?: boolean
  icon: React.ReactNode
  label: string
  count?: number
}) {
  return (
    <div className={cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all cursor-default',
      active
        ? 'bg-purple-500/20 border border-purple-500/20 text-purple-300'
        : 'text-text-muted hover:text-text-secondary hover:bg-white/5'
    )}>
      {icon}
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full',
          active ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-text-muted'
        )}>
          {count}
        </span>
      )}
    </div>
  )
}
