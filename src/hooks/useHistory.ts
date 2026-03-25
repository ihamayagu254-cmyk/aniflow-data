'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'aniflow_history'

interface HistoryEntry {
  animeId: string
  episodeNumber: number
  animeTitle: string
  episodeTitle: string
  animeCapa: string
  watchedAt: string
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  const addToHistory = useCallback((entry: Omit<HistoryEntry, 'watchedAt'>) => {
    setHistory(prev => {
      // Remove duplicata se já existe
      const filtered = prev.filter(
        h => !(h.animeId === entry.animeId && h.episodeNumber === entry.episodeNumber)
      )
      const next = [{ ...entry, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 50)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const hasWatched = useCallback(
    (animeId: string, episodeNumber: number) =>
      history.some(h => h.animeId === animeId && h.episodeNumber === episodeNumber),
    [history]
  )

  const clearHistory = useCallback(() => {
    setHistory([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return { history, addToHistory, hasWatched, clearHistory }
}
