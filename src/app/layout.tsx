import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AniFlow — Assista Animes Grátis',
    template: '%s | AniFlow',
  },
  description: 'Plataforma gratuita de streaming de animes. Assista online sem anúncios.',
  keywords: ['anime', 'streaming', 'assistir anime', 'anime online', 'grátis'],
  openGraph: {
    title: 'AniFlow',
    description: 'Plataforma gratuita de streaming de animes',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg-primary text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  )
}
