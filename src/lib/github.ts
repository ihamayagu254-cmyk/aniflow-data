/**
 * 🗄️ GITHUB COMO BANCO DE DADOS
 *
 * Este arquivo implementa todas as operações de leitura/escrita
 * usando a API REST do GitHub como se fosse um banco de dados.
 *
 * Como funciona:
 * 1. Os dados ficam em /data/animes.json no repositório
 * 2. Para LER: GET /repos/{owner}/{repo}/contents/{path}
 * 3. Para ESCREVER: PUT /repos/{owner}/{repo}/contents/{path}
 *    - O conteúdo deve ser enviado em Base64
 *    - É necessário o SHA do arquivo atual para fazer update
 * 4. Cada escrita gera um COMMIT automático no repo
 */

import { AnimeDB } from '@/types'

const GITHUB_API = 'https://api.github.com'
const FILE_PATH = 'data/animes.json'

// Configuração lida das variáveis de ambiente
function getConfig() {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token || !owner || !repo) {
    throw new Error('Variáveis do GitHub não configuradas')
  }

  return { token, owner, repo, branch }
}

// Headers padrão para todas as requisições
function getHeaders() {
  return {
    'Authorization': `Bearer ${config.token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

interface GitHubFileResponse {
  content: string    // Conteúdo em Base64
  sha: string        // SHA necessário para updates
  encoding: string
  name: string
  path: string
}

/**
 * 📖 Lê o arquivo JSON do GitHub
 * Retorna o conteúdo parseado + o SHA do arquivo
 */
export async function readDB(): Promise<{ data: AnimeDB; sha: string }> {
  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${FILE_PATH}?ref=${config.branch}`

  const response = await fetch(url, {
    headers: getHeaders(),
    // Não cachear para sempre ter dados frescos
    cache: 'no-store',
  })

  if (!response.ok) {
    // Se o arquivo não existe, retorna estrutura vazia
    if (response.status === 404) {
      return {
        data: { animes: [], comments: [] },
        sha: '',
      }
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const fileData: GitHubFileResponse = await response.json()

  // O GitHub retorna o conteúdo em Base64
  // Precisamos decodificar para obter o JSON
  const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8')
  const data: AnimeDB = JSON.parse(decodedContent)

  return { data, sha: fileData.sha }
}

/**
 * 💾 Escreve dados no arquivo JSON via GitHub
 * Cada chamada gera um COMMIT no repositório!
 */
export async function writeDB(data: AnimeDB, sha: string, commitMessage: string): Promise<void> {
  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${FILE_PATH}`

  // Converte o JSON para string formatada, depois para Base64
  // O GitHub EXIGE que o conteúdo esteja em Base64
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64')

  const body = {
    message: commitMessage,           // Mensagem do commit
    content,                          // Conteúdo em Base64
    sha: sha || undefined,            // SHA do arquivo atual (necessário para update)
    branch: config.branch,
    committer: {
      name: 'AniFlow Bot',
      email: 'bot@aniflow.app',
    },
  }

  const response = await fetch(url, {
    method: 'PUT',                    // PUT cria ou atualiza o arquivo
    headers: getHeaders(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub write error: ${JSON.stringify(error)}`)
  }
}

/**
 * 🔄 Helper: Lê, modifica e salva o banco
 * Use este wrapper para todas as operações de escrita
 */
export async function updateDB(
  mutate: (data: AnimeDB) => AnimeDB,
  commitMessage: string
): Promise<AnimeDB> {
  const { data, sha } = await readDB()
  const newData = mutate(data)
  await writeDB(newData, sha, commitMessage)
  return newData
}

/**
 * ✅ Verifica se o GitHub está configurado corretamente
 */
export async function checkGitHubConfig(): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!config.token || !config.owner || !config.repo) {
      return { ok: false, error: 'Variáveis de ambiente não configuradas' }
    }

    const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}`
    const response = await fetch(url, { headers: getHeaders() })

    if (!response.ok) {
      return { ok: false, error: `Repositório não encontrado: ${response.status}` }
    }

    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
