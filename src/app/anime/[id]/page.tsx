import { readDB } from '@/lib/github'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Star, Calendar, Film, ChevronRight, Check } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CommentsSection from './CommentsSection'
import FavoriteButton from './FavoriteButton'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data } = await readDB()
    const anime = data.animes.find(a => a.id === params.id)
    if (!anime) return { title: 'Anime não encontrado' }
    return {
      title: anime.titulo,
      description: anime.descricao.slice(0, 160),
      openGraph: { images: [anime.capa] },
    }
  } catch {
    return { title: 'AniFlow' }
  }
}

export default async function AnimePage({ params }: Props) {
  const { data } = await readDB()
  const anime = data.animes.find(a => a.id === params.id)

  if (!anime) notFound()

  const firstEp = anime.episodios[0]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Banner */}
        <div className="relative h-[50vh] min-h-[360px]">
          <Image
            src={anime.banner || anime.capa}
            alt={anime.titulo}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover */}
            <div className="flex-shrink-0 w-40 sm:w-52 mx-auto md:mx-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 glow-ring aspect-[2/3]">
                <Image
                  src={anime.capa}
                  alt={anime.titulo}
                  fill
                  className="object-cover"
                  sizes="208px"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-0 md:pt-16">
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-3">
                {anime.generos.map(g => (
                  <Link
                    key={g}
                    href={`/search?genero=${g}`}
                    className="badge bg-purple-500/20 border border-purple-500/30 text-purple-300 capitalize hover:bg-purple-500/30 transition-colors"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                {anime.titulo}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-4">
                {anime.nota && anime.nota > 0 ? (
                  <span className="flex items-center gap-1.5 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <strong>{anime.nota.toFixed(1)}</strong>
                  </span>
                ) : null}
                {anime.ano && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {anime.ano}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Film className="w-4 h-4" /> {anime.episodios.length} ep{anime.episodios.length !== 1 ? 's' : ''}
                </span>
                {anime.status && (
                  <span className={`badge ${
                    anime.status === 'Em lançamento' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    anime.status === 'Completo' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {anime.status}
                  </span>
                )}
              </div>

              <p className="text-text-secondary leading-relaxed mb-6 max-w-2xl">
                {anime.descricao}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {firstEp && (
                  <Link
                    href={`/watch/${anime.id}/${firstEp.numero}`}
                    className="btn-glow flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
                  >
                    <Play className="w-4 h-4 fill-white" /> Assistir EP 1
                  </Link>
                )}
                <FavoriteButton animeId={anime.id} />
              </div>
            </div>
          </div>

          {/* Episodes List */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
              Episódios <span className="text-text-muted font-normal text-lg">({anime.episodios.length})</span>
            </h2>

            {anime.episodios.length === 0 ? (
              <div className="text-center py-12 bg-bg-card rounded-2xl border border-white/5">
                <Film className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-text-muted">Nenhum episódio disponível ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {anime.episodios.map(ep => (
                  <Link
                    key={ep.numero}
                    href={`/watch/${anime.id}/${ep.numero}`}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-bg-card hover:bg-bg-hover border border-white/5 hover:border-purple-500/30 transition-all"
                  >
                    {/* Thumbnail or number */}
                    <div className="w-16 h-10 rounded-lg bg-bg-hover flex-shrink-0 overflow-hidden relative">
                      {ep.thumbnail ? (
                        <Image src={ep.thumbnail} alt="" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-text-muted text-xs font-mono">{ep.numero}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                        <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-muted mb-0.5">Episódio {ep.numero}</p>
                      <p className="text-text-primary text-sm font-medium truncate group-hover:text-accent-purple transition-colors">
                        {ep.titulo}
                      </p>
                      {ep.duracao && <p className="text-xs text-text-muted mt-0.5">{ep.duracao}</p>}
                    </div>

                    <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0 group-hover:text-accent-purple group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="mt-12 mb-8">
            <CommentsSection animeId={anime.id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
