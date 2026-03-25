'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, Loader2 } from 'lucide-react'
import { Comment } from '@/types'
import { formatDate } from '@/lib/utils'

interface Props {
  animeId: string
  episodeNumber?: number
}

export default function CommentsSection({ animeId, episodeNumber }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [autor, setAutor] = useState('')
  const [texto, setTexto] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchComments = async () => {
    try {
      const params = new URLSearchParams({ animeId })
      if (episodeNumber) params.set('episodeNumber', String(episodeNumber))
      const res = await fetch(`/api/comments?${params}`)
      const data = await res.json()
      setComments(data.comments || [])
    } catch {
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchComments() }, [animeId, episodeNumber])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!autor.trim() || !texto.trim()) {
      setError('Preencha seu nome e comentário.')
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animeId, episodeNumber, autor: autor.trim(), texto: texto.trim() }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Erro ao enviar')
        return
      }
      setTexto('')
      setSuccess('Comentário enviado!')
      setTimeout(() => setSuccess(''), 3000)
      await fetchComments()
    } catch {
      setError('Erro de conexão')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-text-primary mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-accent-purple" />
        Comentários
        {!loading && <span className="text-text-muted font-normal text-lg">({comments.length})</span>}
      </h2>

      {/* Form */}
      <div className="bg-bg-card border border-white/5 rounded-2xl p-6 mb-6">
        <h3 className="text-text-primary font-medium mb-4">Deixe seu comentário</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={autor}
            onChange={e => setAutor(e.target.value)}
            placeholder="Seu nome"
            maxLength={30}
            className="input-dark w-full px-4 py-3 rounded-xl text-sm"
          />
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="O que você achou? (máx. 500 caracteres)"
            maxLength={500}
            rows={3}
            className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-xs">{texto.length}/500</span>
            <button
              type="submit"
              disabled={sending}
              className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-text-muted">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <div key={comment.id} className="bg-bg-card border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-glow flex items-center justify-center text-white text-xs font-bold">
                    {comment.autor[0]?.toUpperCase()}
                  </div>
                  <span className="text-text-primary font-medium text-sm">{comment.autor}</span>
                </div>
                <span className="text-text-muted text-xs">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{comment.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
