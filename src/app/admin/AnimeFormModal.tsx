'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Loader2, Save, Film, Link as LinkIcon, Image as ImageIcon, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { Anime, Episode, GENEROS } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  anime?: Anime
  onSave: (anime: Anime, isNew: boolean) => void
  onClose: () => void
}

const emptyEp = (): Episode => ({ numero: 1, titulo: '', video_url: '', duracao: '', thumbnail: '' })

export default function AnimeFormModal({ anime, onSave, onClose }: Props) {
  const isNew = !anime

  const [form, setForm] = useState({
    titulo: anime?.titulo || '',
    descricao: anime?.descricao || '',
    capa: anime?.capa || '',
    banner: anime?.banner || '',
    generos: anime?.generos || [] as string[],
    status: anime?.status || 'Em lançamento' as Anime['status'],
    ano: anime?.ano || new Date().getFullYear(),
    nota: anime?.nota || 0,
  })

  const [episodios, setEpisodios] = useState<Episode[]>(
    anime?.episodios || []
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [expandedEp, setExpandedEp] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'episodes'>('info')

  const toggleGenero = (g: string) => {
    setForm(prev => ({
      ...prev,
      generos: prev.generos.includes(g)
        ? prev.generos.filter(x => x !== g)
        : [...prev.generos, g]
    }))
  }

  const addEpisodio = () => {
    const nextNum = episodios.length > 0
      ? Math.max(...episodios.map(e => e.numero)) + 1
      : 1
    const newEp = { ...emptyEp(), numero: nextNum }
    setEpisodios(prev => [...prev, newEp])
    setExpandedEp(nextNum)
  }

  const removeEpisodio = (numero: number) => {
    setEpisodios(prev => prev.filter(e => e.numero !== numero))
    if (expandedEp === numero) setExpandedEp(null)
  }

  const updateEpisodio = (numero: number, field: keyof Episode, value: string | number) => {
    setEpisodios(prev => prev.map(e => e.numero === numero ? { ...e, [field]: value } : e))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validações
    if (!form.titulo.trim()) return setError('Título é obrigatório')
    if (!form.descricao.trim()) return setError('Descrição é obrigatória')
    if (!form.capa.trim()) return setError('URL da capa é obrigatória')
    if (form.generos.length === 0) return setError('Selecione pelo menos um gênero')

    // Valida episódios
    for (const ep of episodios) {
      if (!ep.titulo.trim()) return setError(`EP ${ep.numero}: título é obrigatório`)
      if (!ep.video_url.trim()) return setError(`EP ${ep.numero}: URL do vídeo é obrigatória`)
    }

    setSaving(true)
    try {
      const payload = {
        ...(anime?.id ? { id: anime.id } : {}),
        ...form,
        episodios,
      }

      const res = await fetch('/api/animes/crud', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar')

      onSave(data.anime, isNew)
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-bg-secondary border border-white/10 rounded-2xl shadow-2xl shadow-black/50 animate-slide-up mb-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-glow flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-text-primary">
                {isNew ? 'Adicionar Novo Anime' : `Editar: ${anime.titulo}`}
              </h2>
              <p className="text-text-muted text-xs mt-0.5">
                {isNew ? 'Cria um commit no GitHub ao salvar' : 'Atualiza o JSON e faz commit no GitHub'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-text-primary transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {(['info', 'episodes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-3.5 text-sm font-medium transition-all border-b-2',
                activeTab === tab
                  ? 'border-accent-purple text-accent-purple'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              )}
            >
              {tab === 'info' ? '📋 Informações' : `🎬 Episódios (${episodios.length})`}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div className="space-y-5">
                {/* Título */}
                <Field label="Título" required>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
                    placeholder="ex: Naruto Shippuden"
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                  />
                </Field>

                {/* Descrição */}
                <Field label="Descrição" required>
                  <textarea
                    value={form.descricao}
                    onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                    placeholder="Sinopse do anime..."
                    rows={3}
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"
                  />
                </Field>

                {/* Imagens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="URL da Capa" required hint="Imagem vertical (poster)">
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="url"
                        value={form.capa}
                        onChange={e => setForm(p => ({ ...p, capa: e.target.value }))}
                        placeholder="https://..."
                        className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      />
                    </div>
                  </Field>
                  <Field label="URL do Banner" hint="Imagem horizontal (opcional)">
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="url"
                        value={form.banner}
                        onChange={e => setForm(p => ({ ...p, banner: e.target.value }))}
                        placeholder="https://... (usa capa se vazio)"
                        className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      />
                    </div>
                  </Field>
                </div>

                {/* Preview da capa */}
                {form.capa && (
                  <div className="flex items-center gap-4 p-3 bg-bg-hover rounded-xl border border-white/5">
                    <img src={form.capa} alt="Preview" className="w-12 h-16 object-cover rounded-lg" onError={e => (e.currentTarget.style.display='none')} />
                    <p className="text-text-muted text-xs">Preview da capa</p>
                  </div>
                )}

                {/* Meta */}
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={e => setForm(p => ({ ...p, status: e.target.value as Anime['status'] }))}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    >
                      <option value="Em lançamento">Em lançamento</option>
                      <option value="Completo">Completo</option>
                      <option value="Em breve">Em breve</option>
                    </select>
                  </Field>
                  <Field label="Ano">
                    <input
                      type="number"
                      value={form.ano}
                      onChange={e => setForm(p => ({ ...p, ano: parseInt(e.target.value) || p.ano }))}
                      min={1990}
                      max={2030}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </Field>
                  <Field label="Nota (0-10)">
                    <input
                      type="number"
                      value={form.nota}
                      onChange={e => setForm(p => ({ ...p, nota: parseFloat(e.target.value) || 0 }))}
                      min={0}
                      max={10}
                      step={0.1}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </Field>
                </div>

                {/* Gêneros */}
                <Field label="Gêneros" required hint="Selecione um ou mais">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {GENEROS.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGenero(g)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize',
                          form.generos.includes(g)
                            ? 'bg-purple-500/30 border-purple-500/50 text-purple-300'
                            : 'bg-white/5 border-white/10 text-text-muted hover:text-text-secondary'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* EPISODES TAB */}
            {activeTab === 'episodes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-text-muted text-sm">
                    {episodios.length === 0
                      ? 'Nenhum episódio adicionado'
                      : `${episodios.length} episódio${episodios.length !== 1 ? 's' : ''} cadastrado${episodios.length !== 1 ? 's' : ''}`}
                  </p>
                  <button
                    type="button"
                    onClick={addEpisodio}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Episódio
                  </button>
                </div>

                {/* Video URL tip */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300/80">
                  <strong>💡 URLs suportadas:</strong> YouTube, Google Drive, MP4 direto, ou qualquer iframe embed.
                </div>

                {episodios.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                    <Film className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
                    <p className="text-text-muted text-sm">Clique em "Adicionar Episódio" para começar</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                    {episodios
                      .sort((a, b) => a.numero - b.numero)
                      .map(ep => (
                        <div key={ep.numero} className="bg-bg-card border border-white/5 rounded-xl overflow-hidden">
                          {/* Episode Header */}
                          <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-7 h-7 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-xs font-mono text-purple-400 flex-shrink-0">
                              {ep.numero}
                            </div>
                            <span className="flex-1 text-text-secondary text-sm truncate">
                              {ep.titulo || <span className="text-text-muted italic">Sem título</span>}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setExpandedEp(expandedEp === ep.numero ? null : ep.numero)}
                                className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-all"
                              >
                                {expandedEp === ep.numero ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeEpisodio(ep.numero)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Episode Form */}
                          {expandedEp === ep.numero && (
                            <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <Field label="Nº do Episódio">
                                  <input
                                    type="number"
                                    value={ep.numero}
                                    onChange={e => updateEpisodio(ep.numero, 'numero', parseInt(e.target.value) || ep.numero)}
                                    min={1}
                                    className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
                                  />
                                </Field>
                                <Field label="Duração">
                                  <input
                                    type="text"
                                    value={ep.duracao || ''}
                                    onChange={e => updateEpisodio(ep.numero, 'duracao', e.target.value)}
                                    placeholder="ex: 24 min"
                                    className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
                                  />
                                </Field>
                              </div>
                              <Field label="Título do Episódio" required>
                                <input
                                  type="text"
                                  value={ep.titulo}
                                  onChange={e => updateEpisodio(ep.numero, 'titulo', e.target.value)}
                                  placeholder="ex: O Início de Tudo"
                                  className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
                                />
                              </Field>
                              <Field label="URL do Vídeo" required>
                                <div className="relative">
                                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                  <input
                                    type="url"
                                    value={ep.video_url}
                                    onChange={e => updateEpisodio(ep.numero, 'video_url', e.target.value)}
                                    placeholder="https://youtube.com/watch?v=... ou link direto"
                                    className="input-dark w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                                  />
                                </div>
                              </Field>
                              <Field label="Thumbnail (opcional)">
                                <input
                                  type="url"
                                  value={ep.thumbnail || ''}
                                  onChange={e => updateEpisodio(ep.numero, 'thumbnail', e.target.value)}
                                  placeholder="https://..."
                                  className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
                                />
                              </Field>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/5">
            <div className="flex-1">
              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  ⚠️ {error}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-glow flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                  : <><Save className="w-4 h-4" /> {isNew ? 'Criar Anime' : 'Salvar Alterações'}</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label, required, hint, children
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label}
        {required && <span className="text-accent-purple ml-1">*</span>}
        {hint && <span className="text-text-muted normal-case tracking-normal font-normal ml-2">— {hint}</span>}
      </label>
      {children}
    </div>
  )
}
