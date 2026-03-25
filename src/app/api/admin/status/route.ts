import { NextResponse } from 'next/server'
import { checkGitHubConfig } from '@/lib/github'

// GET /api/admin/status - Verifica configuração do sistema
export async function GET() {
  const github = await checkGitHubConfig()

  return NextResponse.json({
    github,
    env: {
      hasToken: !!process.env.GITHUB_TOKEN,
      hasOwner: !!process.env.GITHUB_OWNER,
      hasRepo: !!process.env.GITHUB_REPO,
      hasAdminPassword: !!process.env.ADMIN_PASSWORD,
      hasJwtSecret: !!process.env.JWT_SECRET,
    },
  })
}
