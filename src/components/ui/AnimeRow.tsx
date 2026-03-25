'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AnimeCard from './AnimeCard'
import { Anime } from '@/types'

interface AnimeRowProps {
  title: string
  animes: Anime[]
  subtitle?: string
}

export default function AnimeRow({ title, animes, subtitle }: AnimeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  if (!animes.length) return null

  return (
    <section className="relative group/row">
      {/* Header */}
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-text-primary">
            {title}
          </h2>
          {subtitle && (
            <p className="text-text-muted text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all opacity-0 group-hover/row:opacity-100"
            aria-label="Scroll esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all opacity-0 group-hover/row:opacity-100"
            aria-label="Scroll direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-row px-4 sm:px-6 lg:px-8 pb-2"
      >
        {animes.map(anime => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  )
}
