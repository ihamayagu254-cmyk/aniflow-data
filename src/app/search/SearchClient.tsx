'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Anime, GeneroType } from '@/types'
import AnimeCard from '@/components/ui/AnimeCard'
import { cn } from '@/lib/utils'

interface Props {
  animes: Anime[]
  generos: GeneroType[]
  initialSearch: string
  initialGenero: string
}

const PAGE_SIZE = 24

export default function SearchClient({ animes, generos, initialSearch, initialGenero }: Props) {
  const [search, setSearch] = useState(initialSearch)
  const [selectedGenero, setSelectedGenero] = useState(initialGenero)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = animes
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.titulo.toLowerCase().includes(q) ||
        a.descricao.toLowerCase().includes(q) ||
        a.generos.some(g => g.toLowerCase().includes(q))
      )
    }
    if (selectedGenero) {
      result = result.filter(a =>
        a.generos.some(g => g.toLowerCase() === selectedGenero.toLowerCase())
      )
    }
    if (selectedStatus) {
      result = result.filter(a => a.status === selectedStatus)
    }
    return result
  }, [animes, search, selectedGenero, selectedStatus])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const reset = () => {
    setSearch('')
    setSelectedGenero('')
    setSelectedStatus('')
    setPage(1)
  }

  const hasFilters = search || selectedGenero || selectedStatus

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar por título, gênero..."
          className="input-dark w-full pl-12 pr-12 py-3.5 rounded-xl text-sm"
        />
        {search && (
          <button
            onClick={() => { setSearch(''); setPage(1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Status filter */}
        {['Em lançamento', 'Completo', 'Em breve'].map(s => (
          <button
            key={s}
            onClick={() => { setSelectedStatus(selectedStatus === s ? '' : s); setPage(1) }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              selectedStatus === s
                ? 'bg-purple-500/30 border-purple-500/50 text-purple-300'
                : 'bg-white/5 border-white/10 text-text-muted hover:text-text-secondary'
            )}
          >
            {s}
          </button>
        ))}

        <div className="w-px h-6 bg-white/10 self-center mx-1" />

        {/* Genre filters */}
        {generos.map(g => (
          <button
            key={g}
            onClick={() => { setSelectedGenero(selectedGenero === g ? '' : g); setPage(1) }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize',
              selectedGenero === g
                ? 'bg-purple-500/30 border-purple-500/50 text-purple-300'
                : 'bg-white/5 border-white/10 text-text-muted hover:text-text-secondary'
            )}
          >
            {g}
          </button>
        ))}

        {hasFilters && (
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-text-muted text-sm mb-4">
        {filtered.length === 0
          ? 'Nenhum resultado encontrado'
          : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}${hasFilters ? ' filtrado' + (filtered.length !== 1 ? 's' : '') : ''}`}
      </p>

      {/* Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {paginated.map(anime => (
            <AnimeCard key={anime.id} anime={anime} size="sm" />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
          <p className="text-text-muted text-lg">Nenhum anime encontrado</p>
          <p className="text-text-muted text-sm mt-2">Tente outros termos ou remova os filtros</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-bg-card border border-white/5 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            Anterior
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-10 h-10 rounded-lg text-sm font-medium transition-all',
                  page === p
                    ? 'bg-accent-purple text-white shadow-lg shadow-purple-500/30'
                    : 'bg-bg-card border border-white/5 text-text-secondary hover:text-text-primary'
                )}
              >
                {p}
              </button>
            )
          })}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-bg-card border border-white/5 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}
