'use client'

import { useEffect } from 'react'
import { useHistory } from '@/hooks/useHistory'

interface Props {
  animeId: string
  episodeNumber: number
  animeTitle: string
  episodeTitle: string
  animeCapa: string
}

export default function WatchHistory({ animeId, episodeNumber, animeTitle, episodeTitle, animeCapa }: Props) {
  const { addToHistory } = useHistory()

  useEffect(() => {
    // Adiciona ao histórico ao começar a assistir
    addToHistory({ animeId, episodeNumber, animeTitle, episodeTitle, animeCapa })
  }, [animeId, episodeNumber])

  return null
}
