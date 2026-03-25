export const dynamic = 'force-dynamic'
import { readDB } from '@/lib/github'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroBanner from '@/components/ui/HeroBanner'
import AnimeRow from '@/components/ui/AnimeRow'
import { Anime } from '@/types'

// ISR: revalida a cada 60 segundos
export const revalidate = 60

export default async function HomePage() {
  let animes: Anime[] = []

  try {
    const { data } = await readDB()
    animes = data.animes
  } catch (error) {
    console.error('Erro ao carregar animes:', error)
  }

  // Organiza por gênero e status
  const lancamentos = animes.filter(a => a.status === 'Em lançamento')
  const completos = animes.filter(a => a.status === 'Completo')
  const acaoAnimes = animes.filter(a => a.generos.includes('ação'))
  const isekaiAnimes = animes.filter(a => a.generos.includes('isekai'))
  const romanceAnimes = animes.filter(a => a.generos.includes('romance'))

  // Os com melhor nota
  const topAnimes = [...animes]
    .sort((a, b) => (b.nota || 0) - (a.nota || 0))
    .slice(0, 10)

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <HeroBanner animes={animes} />

        {/* Content Rows */}
        <div className="py-8 space-y-10 max-w-7xl mx-auto">
          {animes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">Nenhum anime cadastrado ainda.</p>
              <p className="text-text-muted text-sm mt-2">
                Acesse o <a href="/admin" className="text-accent-purple hover:underline">painel admin</a> para adicionar animes.
              </p>
            </div>
          ) : (
            <>
              {topAnimes.length > 0 && (
                <AnimeRow title="⭐ Mais Bem Avaliados" animes={topAnimes} />
              )}
              {lancamentos.length > 0 && (
                <AnimeRow title="🔥 Em Lançamento" animes={lancamentos} subtitle="Novos episódios toda semana" />
              )}
              {acaoAnimes.length > 0 && (
                <AnimeRow title="⚔️ Ação & Aventura" animes={acaoAnimes} />
              )}
              {isekaiAnimes.length > 0 && (
                <AnimeRow title="🌍 Isekai" animes={isekaiAnimes} />
              )}
              {romanceAnimes.length > 0 && (
                <AnimeRow title="💕 Romance" animes={romanceAnimes} />
              )}
              {completos.length > 0 && (
                <AnimeRow title="✅ Completos" animes={completos} />
              )}
              <AnimeRow title="📚 Todos os Animes" animes={animes} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
