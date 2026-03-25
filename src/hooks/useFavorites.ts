'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'aniflow_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setFavorites(JSON.parse(stored))
    } catch {}
  }, [])

  const save = useCallback((ids: string[]) => {
    setFavorites(ids)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {}
  }, [])

  const toggleFavorite = useCallback((animeId: string) => {
    setFavorites(prev => {
      const next = prev.includes(animeId)
        ? prev.filter(id => id !== animeId)
        : [...prev, animeId]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const isFavorite = useCallback((animeId: string) => favorites.includes(animeId), [favorites])

  return { favorites, isFavorite, toggleFavorite }
}
