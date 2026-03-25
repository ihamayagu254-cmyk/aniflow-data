import { NextRequest, NextResponse } from 'next/server'
import { readDB } from '@/lib/github'

// GET /api/animes - Lista todos os animes
// Suporta query params: ?search=&genero=&page=&limit=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.toLowerCase()
    const genero = searchParams.get('genero')?.toLowerCase()
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const { data } = await readDB()
    let animes = data.animes

    // Filtro de busca por título
    if (search) {
      animes = animes.filter(a =>
        a.titulo.toLowerCase().includes(search) ||
        a.descricao.toLowerCase().includes(search)
      )
    }

    // Filtro por gênero
    if (genero) {
      animes = animes.filter(a =>
        a.generos.some(g => g.toLowerCase() === genero)
      )
    }

    // Paginação
    const total = animes.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedAnimes = animes.slice(offset, offset + limit)

    return NextResponse.json({
      animes: paginatedAnimes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }, {
      // Cache de 60s com revalidação em background (ISR)
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' }
    })
  } catch (error) {
    console.error('Error fetching animes:', error)
    return NextResponse.json({ error: 'Erro ao buscar animes' }, { status: 500 })
  }
}
