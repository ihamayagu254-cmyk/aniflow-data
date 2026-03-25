import { isAdminRequest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { readDB } from '@/lib/github'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const admin = await isAdminRequest()
  if (!admin) redirect('/admin/login')

  let animes = []
  let dbStatus = { ok: false, error: 'Não verificado' }

  try {
    const { data } = await readDB()
    animes = data.animes
    dbStatus = { ok: true, error: '' }
  } catch (e) {
    dbStatus = { ok: false, error: String(e) }
  }

  return <AdminDashboard initialAnimes={animes} dbStatus={dbStatus} />
}
