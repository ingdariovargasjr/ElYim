const SLEEP_KEY = 'gymapp.prototype.sleep'
import { queueSyncOperation } from './sync'

const defaultSleep = {
  date: new Date().toISOString().slice(0, 10),
  bedtime: '22:30',
  wakeTime: '06:30',
  interruptions: 0,
  quality: 3,
  energy: 3,
  notes: '',
  source: 'manual',
}

export function getDefaultSleep() { return { ...defaultSleep } }

export function getStoredSleep() {
  try { return JSON.parse(localStorage.getItem(SLEEP_KEY) || 'null') } catch { return null }
}

export function saveSleep(sleep) {
  localStorage.setItem(SLEEP_KEY, JSON.stringify(sleep))
  queueSyncOperation('sleep')
  return sleep
}
