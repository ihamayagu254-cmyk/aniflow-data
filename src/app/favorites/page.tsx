'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Trash2, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimeCard from '@/components/ui/AnimeCard'
import { useFavorites } from '@/hooks/useFavorites'
import { useHistory } from '@/hooks/useHistory'
import { Anime } from '@/types'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites()
  const { history, clearHistory } = useHistory()
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites')

  useEffect(() => {
    fetch('/api/animes')
      .then(r => r.json())
      .then(d => setAnimes(d.animes || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const favoriteAnimes = animes.filter(a => favorites.includes(a.id))

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-2">
            Minha Lista
          </h1>
          <p className="text-text-muted mb-8">Seus animes salvos e histórico</p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-bg-card rounded-xl w-fit mb-8 border border-white/5">
            <button
              onClick={() => setTab('favorites')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === 'favorites'
                  ? 'bg-accent-purple text-white shadow-lg shadow-purple-500/20'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Heart className="w-4 h-4" /> Favoritos ({favorites.length})
            </button>
            <button
              onClick={() => setTab('history')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === 'history'
                  ? 'bg-accent-purple text-white shadow-lg shadow-purple-500/20'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Clock className="w-4 h-4" /> Histórico ({history.length})
            </button>
          </div>

          {/* Favorites Tab */}
          {tab === 'favorites' && (
            loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton rounded-xl aspect-[2/3]" />)}
              </div>
            ) : favoriteAnimes.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
                <p className="text-text-muted text-lg">Nenhum favorito ainda</p>
                <p className="text-text-muted text-sm mt-2">Clique no coração em qualquer anime para salvar</p>
                <Link href="/search" className="btn-glow inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl text-white font-semibold text-sm">
                  Explorar Animes
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {favoriteAnimes.map(anime => (
                  <AnimeCard key={anime.id} anime={anime} size="sm" />
                ))}
              </div>
            )
          )}

          {/* History Tab */}
          {tab === 'history' && (
            history.length === 0 ? (
              <div className="text-center py-20">
                <Clock className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
                <p className="text-text-muted text-lg">Nenhum histórico ainda</p>
                <p className="text-text-muted text-sm mt-2">Os episódios que você assistir aparecerão aqui</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Limpar histórico
                  </button>
                </div>
                <div className="space-y-2">
                  {history.map((entry, i) => (
                    <Link
                      key={i}
                      href={`/watch/${entry.animeId}/${entry.episodeNumber}`}
                      className="flex items-center gap-4 p-4 bg-bg-card rounded-xl border border-white/5 hover:border-purple-500/20 hover:bg-bg-hover transition-all group"
                    >
                      <div className="w-16 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                        <Image src={entry.animeCapa} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary font-medium text-sm truncate group-hover:text-accent-purple transition-colors">
                          {entry.animeTitle}
                        </p>
                        <p className="text-text-muted text-xs mt-0.5">
                          EP {entry.episodeNumber}: {entry.episodeTitle}
                        </p>
                      </div>
                      <p className="text-text-muted text-xs flex-shrink-0">{formatDate(entry.watchedAt)}</p>
                    </Link>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
