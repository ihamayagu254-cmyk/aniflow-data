import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken, checkAdminPassword, verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import { cookies } from 'next/headers'

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
    }

    const token = await createAdminToken()
    const cookieStore = cookies()

    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// DELETE /api/auth/login - Logout
export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
  return NextResponse.json({ success: true })
}

// GET /api/auth/login - Verifica se está logado
export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return NextResponse.json({ isAdmin: false })

  const isAdmin = await verifyAdminToken(token)
  return NextResponse.json({ isAdmin })
}
