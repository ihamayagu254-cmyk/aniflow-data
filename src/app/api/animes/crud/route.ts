import { NextRequest, NextResponse } from 'next/server'
import { readDB, updateDB } from '@/lib/github'
import { isAdminRequest } from '@/lib/auth'
import { generateId } from '@/lib/utils'
import { Anime } from '@/types'

// POST /api/animes/crud - Cria novo anime
export async function POST(request: NextRequest) {
  if (!await isAdminRequest()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { titulo, descricao, capa, banner, generos, status, ano, nota, episodios } = body

    if (!titulo || !descricao || !capa || !generos?.length) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const newAnime: Anime = {
      id: generateId(),
      titulo,
      descricao,
      capa,
      banner: banner || capa,
      generos,
      status: status || 'Em lançamento',
      ano: ano || new Date().getFullYear(),
      nota: nota || 0,
      episodios: episodios || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await updateDB(
      (db) => ({ ...db, animes: [...db.animes, newAnime] }),
      `✨ Adiciona anime: ${titulo}`
    )

    return NextResponse.json({ anime: newAnime }, { status: 201 })
  } catch (error) {
    console.error('Error creating anime:', error)
    return NextResponse.json({ error: 'Erro ao criar anime' }, { status: 500 })
  }
}

// PUT /api/animes/crud - Atualiza anime existente
export async function PUT(request: NextRequest) {
  if (!await isAdminRequest()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
    }

    let updated: Anime | null = null

    await updateDB(
      (db) => {
        const index = db.animes.findIndex(a => a.id === id)
        if (index === -1) return db

        updated = {
          ...db.animes[index],
          ...updates,
          id, // Garante que o ID não muda
          updatedAt: new Date().toISOString(),
        }

        const newAnimes = [...db.animes]
        newAnimes[index] = updated
        return { ...db, animes: newAnimes }
      },
      `✏️ Atualiza anime: ${updates.titulo || id}`
    )

    if (!updated) {
      return NextResponse.json({ error: 'Anime não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ anime: updated })
  } catch (error) {
    console.error('Error updating anime:', error)
    return NextResponse.json({ error: 'Erro ao atualizar anime' }, { status: 500 })
  }
}

// DELETE /api/animes/crud - Remove anime
export async function DELETE(request: NextRequest) {
  if (!await isAdminRequest()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
    }

    const { data } = await readDB()
    const anime = data.animes.find(a => a.id === id)

    if (!anime) {
      return NextResponse.json({ error: 'Anime não encontrado' }, { status: 404 })
    }

    await updateDB(
      (db) => ({ ...db, animes: db.animes.filter(a => a.id !== id) }),
      `🗑️ Remove anime: ${anime.titulo}`
    )

    return NextResponse.json({ success: true, message: `"${anime.titulo}" removido` })
  } catch (error) {
    console.error('Error deleting anime:', error)
    return NextResponse.json({ error: 'Erro ao deletar anime' }, { status: 500 })
  }
}

// GET /api/animes/crud?id=xxx - Busca anime por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const { data } = await readDB()

    if (id) {
      const anime = data.animes.find(a => a.id === id)
      if (!anime) return NextResponse.json({ error: 'Anime não encontrado' }, { status: 404 })
      return NextResponse.json({ anime })
    }

    return NextResponse.json({ animes: data.animes })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar anime' }, { status: 500 })
  }
}
