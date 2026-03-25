'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'

export default function FavoriteButton({ animeId }: { animeId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(animeId)

  return (
    <button
      onClick={() => toggleFavorite(animeId)}
      className={cn(
        'flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold transition-all',
        fav
          ? 'bg-pink-500/20 border-pink-500/40 text-pink-400 hover:bg-pink-500/30'
          : 'bg-white/5 border-white/10 text-text-secondary hover:text-pink-400 hover:border-pink-500/30'
      )}
    >
      <Heart className={cn('w-4 h-4', fav && 'fill-current')} />
      {fav ? 'Favoritado' : 'Favoritar'}
    </button>
  )
}
