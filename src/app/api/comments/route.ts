import { NextRequest, NextResponse } from 'next/server'
import { readDB, updateDB } from '@/lib/github'
import { generateId } from '@/lib/utils'
import { Comment } from '@/types'

// GET /api/comments?animeId=xxx&episodeNumber=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const animeId = searchParams.get('animeId')
    const episodeNumber = searchParams.get('episodeNumber')

    const { data } = await readDB()
    let comments = data.comments || []

    if (animeId) comments = comments.filter(c => c.animeId === animeId)
    if (episodeNumber) comments = comments.filter(c => c.episodeNumber === parseInt(episodeNumber))

    // Mais recentes primeiro
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ comments })
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 })
  }
}

// POST /api/comments - Cria comentário (público, sem auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { animeId, episodeNumber, autor, texto } = body

    if (!animeId || !autor?.trim() || !texto?.trim()) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    if (texto.length > 500) {
      return NextResponse.json({ error: 'Comentário muito longo (máx 500 chars)' }, { status: 400 })
    }

    const newComment: Comment = {
      id: generateId(),
      animeId,
      episodeNumber: episodeNumber || undefined,
      autor: autor.slice(0, 30),
      texto: texto.slice(0, 500),
      createdAt: new Date().toISOString(),
    }

    await updateDB(
      (db) => ({
        ...db,
        comments: [...(db.comments || []), newComment],
      }),
      `💬 Novo comentário em ${animeId}`
    )

    return NextResponse.json({ comment: newComment }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar comentário' }, { status: 500 })
  }
}
