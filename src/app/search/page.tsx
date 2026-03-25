import { readDB } from '@/lib/github'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SearchClient from './SearchClient'
import { GENEROS } from '@/types'

export const revalidate = 60

interface Props {
  searchParams: { q?: string; genero?: string; page?: string }
}

export default async function SearchPage({ searchParams }: Props) {
  const { data } = await readDB()
  const animes = data.animes

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-2">
              {searchParams.q ? `Resultados para "${searchParams.q}"` :
               searchParams.genero ? `Gênero: ${searchParams.genero}` :
               'Todos os Animes'}
            </h1>
            <p className="text-text-muted">{animes.length} animes disponíveis</p>
          </div>

          <SearchClient
            animes={animes}
            generos={GENEROS}
            initialSearch={searchParams.q || ''}
            initialGenero={searchParams.genero || ''}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
