import { queueSyncOperation } from './sync'

const PROVIDER_KEY = 'gymapp.prototype.ai-provider'

const DEFAULT_PROVIDER = {
  providerName: 'OpenAI',
  endpoint: 'https://api.openai.com/v1/responses',
  model: 'gpt-5',
  maxFileSizeMb: 10,
  acceptedFormats: ['application/pdf'],
  configured: false,
  status: 'not-configured',
  updatedAt: null,
}

function cloneProvider(provider) {
  return { ...provider, acceptedFormats: [...(provider.acceptedFormats || DEFAULT_PROVIDER.acceptedFormats)] }
}

export function getDefaultAiProvider() {
  return cloneProvider(DEFAULT_PROVIDER)
}

export function getStoredAiProvider() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROVIDER_KEY) || 'null')
    return stored ? cloneProvider({ ...DEFAULT_PROVIDER, ...stored }) : null
  } catch {
    return null
  }
}

export function validateAiProviderConfig(config) {
  if (!String(config.providerName || '').trim()) return 'Escribe el nombre del proveedor.'
  if (!String(config.model || '').trim()) return 'Escribe el identificador del modelo.'
  if (!Number.isFinite(Number(config.maxFileSizeMb)) || Number(config.maxFileSizeMb) < 1 || Number(config.maxFileSizeMb) > 50) return 'El límite del PDF debe estar entre 1 y 50 MB.'

  try {
    const url = new URL(config.endpoint)
    if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) return 'El endpoint debe usar HTTPS.'
  } catch {
    return 'Escribe una URL de endpoint válida.'
  }

  return ''
}

export function saveAiProvider(config) {
  const normalized = {
    ...DEFAULT_PROVIDER,
    ...config,
    providerName: String(config.providerName).trim(),
    endpoint: String(config.endpoint).trim().replace(/\/$/, ''),
    model: String(config.model).trim(),
    maxFileSizeMb: Number(config.maxFileSizeMb),
    acceptedFormats: ['application/pdf'],
    configured: true,
    status: 'saved-local',
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(PROVIDER_KEY, JSON.stringify(normalized))
  queueSyncOperation('ai-provider', 'upsert')
  return cloneProvider(normalized)
}

export function clearAiProvider() {
  localStorage.removeItem(PROVIDER_KEY)
  queueSyncOperation('ai-provider', 'delete')
  return getDefaultAiProvider()
}

// Prototype-safe test: a real request is only allowed from the future backend.
// This avoids sending credentials or document data directly from the client.
export async function testAiProviderConnection() {
  await new Promise((resolve) => setTimeout(resolve, 650))
  return {
    status: 'backend-required',
    message: 'Configuración guardada. La conexión real se habilitará desde un backend seguro.',
  }
}
