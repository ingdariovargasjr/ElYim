const SCHEDULE_KEY = 'gymapp.prototype.schedule'
import { queueSyncOperation } from './sync'

const defaultSchedule = {
  trainingTime: '18:00',
  sleepTime: '22:30',
  wakeTime: '06:30',
  reminders: {
    meals: true,
    training: true,
    supplements: true,
    sleep: true,
  },
}

export function getDefaultSchedule() { return { ...defaultSchedule, reminders: { ...defaultSchedule.reminders } } }

export function getStoredSchedule() {
  try { return JSON.parse(localStorage.getItem(SCHEDULE_KEY) || 'null') } catch { return null }
}

export function saveSchedule(schedule) {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule))
  queueSyncOperation('schedule')
  return schedule
}
