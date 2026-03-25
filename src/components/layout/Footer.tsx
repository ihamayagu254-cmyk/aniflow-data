import Link from 'next/link'
import { Play, Github, Heart } from 'lucide-react'

export default function Footer() {
  const generos = ['Ação', 'Romance', 'Isekai', 'Comédia', 'Fantasia', 'Horror', 'Shounen']

  return (
    <footer className="bg-bg-secondary border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-glow flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">AniFlow</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Plataforma gratuita de streaming de animes. Sem anúncios, sem assinatura.
              Dados persistidos via GitHub API.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all text-sm"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          {/* Gêneros */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Gêneros</h3>
            <ul className="space-y-2">
              {generos.map(g => (
                <li key={g}>
                  <Link
                    href={`/search?genero=${g.toLowerCase()}`}
                    className="text-text-muted hover:text-accent-purple text-sm transition-colors"
                  >
                    {g}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Navegação</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Início' },
                { href: '/search', label: 'Todos os Animes' },
                { href: '/favorites', label: 'Favoritos' },
                { href: '/admin/login', label: 'Área Admin' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent-purple text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} AniFlow. Todos os vídeos são externos e de responsabilidade dos respectivos donos.
          </p>
          <p className="text-text-muted text-xs flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> e GitHub API
          </p>
        </div>
      </div>
    </footer>
  )
}
