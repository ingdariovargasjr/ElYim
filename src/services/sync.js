const QUEUE_KEY = 'gymapp.prototype.sync-queue'

function readQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch { return [] }
}

export function getPendingSyncCount() { return readQueue().length }

export function queueSyncOperation(entity, operation = 'upsert') {
  const queue = readQueue()
  queue.push({ id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, entity, operation, queuedAt: new Date().toISOString() })
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  return queue.length
}

export async function syncPendingChanges(isOnline = navigator.onLine) {
  const pending = readQueue()
  if (!isOnline) return { synced: 0, pending: pending.length, offline: true }
  await new Promise((resolve) => setTimeout(resolve, 350))
  localStorage.setItem(QUEUE_KEY, '[]')
  return { synced: pending.length, pending: 0, offline: false }
}

