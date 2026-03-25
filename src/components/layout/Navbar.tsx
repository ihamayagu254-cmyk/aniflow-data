'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Menu, X, Play, Shield, LogOut, Heart } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/auth/login')
      .then(r => r.json())
      .then(d => setIsAdmin(d.isAdmin))
      .catch(() => {})
  }, [pathname])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' })
    setIsAdmin(false)
    router.push('/')
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg-primary/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-black/60 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-glow flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-wide gradient-text">
                AniFlow
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/">Início</NavLink>
              <NavLink href="/search">Animes</NavLink>
              <NavLink href="/search?genero=ação">Ação</NavLink>
              <NavLink href="/search?genero=romance">Romance</NavLink>
              <NavLink href="/search?genero=isekai">Isekai</NavLink>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favorites */}
              <Link
                href="/favorites"
                className="p-2 rounded-lg text-text-secondary hover:text-pink-400 hover:bg-white/5 transition-all hidden sm:flex"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Admin */}
              {isAdmin ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-all text-sm font-medium"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-white/5 transition-all"
                    title="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-text-muted hover:text-text-secondary transition-all text-sm"
                >
                  <Shield className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-bg-secondary/95 backdrop-blur-xl border-t border-white/5 animate-slide-up">
            <div className="px-4 py-4 space-y-1">
              <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>Início</MobileNavLink>
              <MobileNavLink href="/search" onClick={() => setMenuOpen(false)}>Todos os Animes</MobileNavLink>
              <MobileNavLink href="/search?genero=ação" onClick={() => setMenuOpen(false)}>Ação</MobileNavLink>
              <MobileNavLink href="/search?genero=romance" onClick={() => setMenuOpen(false)}>Romance</MobileNavLink>
              <MobileNavLink href="/favorites" onClick={() => setMenuOpen(false)}>❤️ Favoritos</MobileNavLink>
              {isAdmin && (
                <MobileNavLink href="/admin" onClick={() => setMenuOpen(false)}>🛡️ Painel Admin</MobileNavLink>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false) }}
        >
          <div className="w-full max-w-2xl animate-slide-up">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar animes..."
                className="w-full pl-12 pr-16 py-4 bg-bg-card border border-white/10 rounded-2xl text-text-primary text-lg focus:outline-none focus:border-accent-purple/50 focus:shadow-lg focus:shadow-purple-500/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <p className="mt-3 text-center text-text-muted text-sm">
              Pressione <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Enter</kbd> para buscar
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-glow rounded-full transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-sm font-medium"
    >
      {children}
    </Link>
  )
}
