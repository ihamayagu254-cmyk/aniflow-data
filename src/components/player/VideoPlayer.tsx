'use client'

import { useState } from 'react'
import { getEmbedUrl } from '@/lib/utils'
import { AlertCircle, ExternalLink } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  title: string
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [error, setError] = useState(false)
  const { type, embedUrl } = getEmbedUrl(url)

  if (error) {
    return (
      <div className="aspect-video-wrapper bg-bg-card rounded-xl overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
          <AlertCircle className="w-16 h-16 text-red-400/50" />
          <div className="text-center">
            <p className="text-text-primary font-semibold mb-2">Erro ao carregar o vídeo</p>
            <p className="text-text-muted text-sm mb-4">O player não conseguiu carregar este vídeo.</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-purple-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir em nova aba
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-video-wrapper rounded-xl overflow-hidden shadow-2xl shadow-black/50 bg-black">
      {type === 'direct' ? (
        /* HTML5 Video Player nativo */
        <video
          className="w-full h-full"
          controls
          autoPlay
          src={embedUrl}
          title={title}
          onError={() => setError(true)}
        >
          <source src={embedUrl} />
          Seu navegador não suporta reprodução de vídeo.
        </video>
      ) : (
        /* iframe para YouTube, Google Drive, ou qualquer embed */
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}
