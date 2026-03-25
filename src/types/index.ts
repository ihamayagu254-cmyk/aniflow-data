export interface Episode {
  numero: number
  titulo: string
  video_url: string
  duracao?: string
  thumbnail?: string
}

export interface Anime {
  id: string
  titulo: string
  descricao: string
  capa: string
  banner?: string
  generos: string[]
  status?: 'Em lançamento' | 'Completo' | 'Em breve'
  ano?: number
  nota?: number
  episodios: Episode[]
  createdAt?: string
  updatedAt?: string
}

export interface Comment {
  id: string
  animeId: string
  episodeNumber?: number
  autor: string
  texto: string
  createdAt: string
}

export interface AnimeDB {
  animes: Anime[]
  comments: Comment[]
}

export interface AdminSession {
  isAdmin: boolean
  token: string
}

export type GeneroType =
  | 'ação'
  | 'aventura'
  | 'comédia'
  | 'drama'
  | 'fantasia'
  | 'ficção científica'
  | 'horror'
  | 'mistério'
  | 'romance'
  | 'slice of life'
  | 'sobrenatural'
  | 'esportes'
  | 'psicológico'
  | 'mecha'
  | 'shounen'
  | 'shoujo'
  | 'seinen'
  | 'isekai'

export const GENEROS: GeneroType[] = [
  'ação', 'aventura', 'comédia', 'drama', 'fantasia',
  'ficção científica', 'horror', 'mistério', 'romance',
  'slice of life', 'sobrenatural', 'esportes', 'psicológico',
  'mecha', 'shounen', 'shoujo', 'seinen', 'isekai',
]
