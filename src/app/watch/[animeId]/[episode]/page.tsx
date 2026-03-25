import { readDB } from '@/lib/github'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, List, Check } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import VideoPlayer from '@/components/player/VideoPlayer'
import CommentsSection from '@/app/anime/[id]/CommentsSection'
import WatchHistory from './WatchHistory'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: { animeId: string; episode: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data } = await readDB()
    const anime = data.animes.find(a => a.id === params.animeId)
    const epNum = parseInt(params.episode)
    const ep = anime?.episodios.find(e => e.numero === epNum)
    if (!anime || !ep) return { title: 'Episódio' }
    return { title: `${anime.titulo} - EP ${ep.numero}: ${ep.titulo}` }
  } catch {
    return { title: 'AniFlow' }
  }
}

export default async function WatchPage({ params }: Props) {
  const { data } = await readDB()
  const anime = data.animes.find(a => a.id === params.animeId)

  if (!anime) notFound()

  const epNum = parseInt(params.episode)
  const episode = anime.episodios.find(e => e.numero === epNum)

  if (!episode) notFound()

  const currentIndex = anime.episodios.findIndex(e => e.numero === epNum)
  const prevEp = currentIndex > 0 ? anime.episodios[currentIndex - 1] : null
  const nextEp = currentIndex < anime.episodios.length - 1 ? anime.episodios[currentIndex + 1] : null

  return (
    <>
      <Navbar />
      {/* Client-side history tracker */}
      <WatchHistory
        animeId={anime.id}
        episodeNumber={episode.numero}
        animeTitle={anime.titulo}
        episodeTitle={episode.titulo}
        animeCapa={anime.capa}
      />

      <main className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-text-primary transition-colors">Início</Link>
            <span>/</span>
            <Link href={`/anime/${anime.id}`} className="hover:text-text-primary transition-colors truncate max-w-[200px]">
              {anime.titulo}
            </Link>
            <span>/</span>
            <span className="text-text-primary">EP {episode.numero}</span>
          </nav>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Player Column */}
            <div className="xl:col-span-3">
              {/* Title */}
              <h1 className="font-display text-xl sm:text-2xl font-semibold text-text-primary mb-4">
                <span className="text-text-muted font-normal">EP {episode.numero} — </span>
                {episode.titulo}
              </h1>

              {/* Video Player */}
              <VideoPlayer url={episode.video_url} title={`${anime.titulo} - EP ${episode.numero}`} />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4 gap-3">
                {prevEp ? (
                  <Link
                    href={`/watch/${anime.id}/${prevEp.numero}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card hover:bg-bg-hover border border-white/5 hover:border-purple-500/30 text-text-secondary hover:text-text-primary transition-all text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:block">EP {prevEp.numero}: {prevEp.titulo}</span>
                    <span className="sm:hidden">Anterior</span>
                  </Link>
                ) : <div />}

                <Link
                  href={`/anime/${anime.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card hover:bg-bg-hover border border-white/5 text-text-muted hover:text-text-primary transition-all text-sm"
                >
                  <List className="w-4 h-4" /> Episódios
                </Link>

                {nextEp ? (
                  <Link
                    href={`/watch/${anime.id}/${nextEp.numero}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card hover:bg-bg-hover border border-white/5 hover:border-purple-500/30 text-text-secondary hover:text-text-primary transition-all text-sm"
                  >
                    <span className="hidden sm:block">EP {nextEp.numero}: {nextEp.titulo}</span>
                    <span className="sm:hidden">Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : <div />}
              </div>

              {/* Comments */}
              <div className="mt-8">
                <CommentsSection animeId={anime.id} episodeNumber={episode.numero} />
              </div>
            </div>

            {/* Episode List Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden sticky top-20">
                <div className="p-4 border-b border-white/5">
                  <h3 className="font-semibold text-text-primary text-sm">Lista de Episódios</h3>
                  <p className="text-text-muted text-xs mt-0.5">{anime.episodios.length} episódios</p>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {anime.episodios.map(ep => (
                    <Link
                      key={ep.numero}
                      href={`/watch/${anime.id}/${ep.numero}`}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors border-b border-white/5 last:border-0 ${
                        ep.numero === epNum ? 'bg-purple-500/10 border-l-2 border-l-accent-purple' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono ${
                        ep.numero === epNum
                          ? 'bg-accent-purple text-white'
                          : 'bg-white/5 text-text-muted'
                      }`}>
                        {ep.numero === epNum ? '▶' : ep.numero}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs truncate ${ep.numero === epNum ? 'text-accent-purple font-medium' : 'text-text-secondary'}`}>
                          {ep.titulo}
                        </p>
                        {ep.duracao && (
                          <p className="text-text-muted text-[10px] mt-0.5">{ep.duracao}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
