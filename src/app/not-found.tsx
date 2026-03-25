import Link from 'next/link'
import { Play, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="text-center animate-fade-in">
        <div className="relative mb-8 inline-block">
          <p className="font-display text-[120px] sm:text-[180px] font-black leading-none gradient-text select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-glow flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-3">
          Página não encontrada
        </h1>
        <p className="text-text-muted text-base mb-8 max-w-sm mx-auto">
          O anime ou episódio que você procura não existe ou foi removido.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-glow flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
          >
            <Home className="w-4 h-4" /> Voltar ao Início
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-text-primary transition-all font-semibold"
          >
            <Search className="w-4 h-4" /> Buscar Animes
          </Link>
        </div>
      </div>
    </div>
  )
}
