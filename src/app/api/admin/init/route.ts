import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/auth'
import { writeDB, readDB } from '@/lib/github'

// POST /api/admin/init - Inicializa o arquivo JSON no GitHub
// Use este endpoint se o arquivo ainda não existe no repositório
export async function POST() {
  if (!await isAdminRequest()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { data, sha } = await readDB()

    // Se já existe, não sobrescreve
    if (sha && data.animes.length > 0) {
      return NextResponse.json({
        message: 'Arquivo já existe e tem dados',
        animes: data.animes.length,
      })
    }

    // Inicializa com estrutura vazia
    await writeDB(
      { animes: [], comments: [] },
      sha,
      '🚀 Inicializa banco de dados AniFlow'
    )

    return NextResponse.json({ success: true, message: 'Arquivo criado no GitHub!' })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
