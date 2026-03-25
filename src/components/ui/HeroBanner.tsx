'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Plus, Star, Info } from 'lucide-react'
import { Anime } from '@/types'
import { truncate } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'

interface HeroBannerProps {
  animes: Anime[]
}

export default function HeroBanner({ animes }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const { isFavorite, toggleFavorite } = useFavorites()

  const featured = animes.slice(0, 5)

  useEffect(() => {
    if (featured.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % featured.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [featured.length])

  if (!featured.length) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-glow mx-auto mb-6 flex items-center justify-center opacity-30">
            <Play className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl gradient-text mb-3">Bem-vindo ao AniFlow</h1>
          <p className="text-text-muted mb-6">Nenhum anime cadastrado ainda.</p>
          <Link
            href="/admin/login"
            className="btn-glow px-6 py-3 rounded-xl text-white font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Adicionar Anime
          </Link>
        </div>
      </div>
    )
  }

  const anime = featured[current]
  const firstEp = anime.episodios[0]

  return (
    <div className="relative h-[75vh] min-h-[520px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {featured.map((a, i) => (
          <div
            key={a.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={a.banner || a.capa}
              alt={a.titulo}
              fill
              priority={i === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/90 via-bg-primary/40 to-transparent" />
      <div className="hero-gradient absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-xl animate-fade-in">
          {/* Genres */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {anime.generos.slice(0, 3).map(g => (
              <span key={g} className="badge bg-white/10 border border-white/20 text-white/80 capitalize">
                {g}
              </span>
            ))}
            {anime.nota && anime.nota > 0 ? (
              <span className="flex items-center gap-1 badge bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
                <Star className="w-3 h-3 fill-current" />
                {anime.nota.toFixed(1)}
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
            {anime.titulo}
          </h1>

          {/* Description */}
          <p className="text-white/70 text-base leading-relaxed mb-6 line-clamp-3">
            {truncate(anime.descricao, 200)}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-white/50 mb-6">
            {anime.ano && <span>{anime.ano}</span>}
            <span>•</span>
            <span>{anime.episodios.length} episódio{anime.episodios.length !== 1 ? 's' : ''}</span>
            {anime.status && (
              <>
                <span>•</span>
                <span className="text-green-400">{anime.status}</span>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {firstEp ? (
              <Link
                href={`/watch/${anime.id}/${firstEp.numero}`}
                className="btn-glow flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                Assistir Agora
              </Link>
            ) : null}

            <Link
              href={`/anime/${anime.id}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all backdrop-blur-sm"
            >
              <Info className="w-4 h-4" />
              Detalhes
            </Link>

            <button
              onClick={() => toggleFavorite(anime.id)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-pink-500/30 border border-white/20 hover:border-pink-500/30 text-white font-semibold text-sm transition-all backdrop-blur-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {featured.length > 1 && (
        <div className="absolute bottom-6 right-8 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
