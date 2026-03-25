'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Heart, Star } from 'lucide-react'
import { Anime } from '@/types'
import { cn, truncate } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'

interface AnimeCardProps {
  anime: Anime
  size?: 'sm' | 'md' | 'lg'
}

export default function AnimeCard({ anime, size = 'md' }: AnimeCardProps) {
  const [imgError, setImgError] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(anime.id)

  const sizeClasses = {
    sm: 'w-36 sm:w-40',
    md: 'w-44 sm:w-48',
    lg: 'w-52 sm:w-56',
  }

  const imgHeightClasses = {
    sm: 'h-52 sm:h-56',
    md: 'h-60 sm:h-64',
    lg: 'h-72 sm:h-76',
  }

  return (
    <div className={cn('flex-shrink-0 anime-card group cursor-pointer', sizeClasses[size])}>
      <Link href={`/anime/${anime.id}`}>
        <div className={cn('relative rounded-xl overflow-hidden bg-bg-card', imgHeightClasses[size])}>
          {/* Cover Image */}
          {!imgError && anime.capa ? (
            <Image
              src={anime.capa}
              alt={anime.titulo}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              sizes="(max-width: 640px) 144px, 192px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-pink-900/40">
              <Play className="w-12 h-12 text-white/20" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(anime.id)
            }}
            className={cn(
              'absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm border transition-all duration-200',
              fav
                ? 'bg-pink-500/80 border-pink-400/50 text-white'
                : 'bg-black/40 border-white/20 text-white/60 hover:text-white opacity-0 group-hover:opacity-100'
            )}
          >
            <Heart className={cn('w-3.5 h-3.5', fav && 'fill-white')} />
          </button>

          {/* Status badge */}
          {anime.status && (
            <div className="absolute top-2 left-2">
              <span className={cn('badge text-white', {
                'bg-green-500/80': anime.status === 'Em lançamento',
                'bg-blue-500/80': anime.status === 'Completo',
                'bg-orange-500/80': anime.status === 'Em breve',
              })}>
                {anime.status === 'Em lançamento' ? '● AO VIVO' : anime.status}
              </span>
            </div>
          )}

          {/* Episode count */}
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-white/80 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {anime.episodios.length} ep{anime.episodios.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Rating */}
          {anime.nota && anime.nota > 0 ? (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white/80">{anime.nota.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div className="mt-2.5 px-0.5">
          <h3 className="text-text-primary font-semibold text-sm leading-tight line-clamp-2 group-hover:text-accent-purple transition-colors">
            {anime.titulo}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {anime.generos.slice(0, 2).map(g => (
              <span key={g} className="text-[10px] text-text-muted px-1.5 py-0.5 bg-white/5 rounded-full capitalize">
                {g}
              </span>
            ))}
            {anime.ano && (
              <span className="text-[10px] text-text-muted">{anime.ano}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
