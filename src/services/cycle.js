const CYCLE_KEY = 'gymapp.prototype.menstrual-cycle'

import { queueSyncOperation } from './sync'

const defaultCycle = {
  lastPeriodStart: '',
  cycleLength: 28,
  periodLength: 5,
  notes: '',
  updatedAt: null,
}

export function getDefaultCycle() { return { ...defaultCycle } }

export function getStoredCycle() {
  try { return JSON.parse(localStorage.getItem(CYCLE_KEY) || 'null') } catch { return null }
}

export function saveCycle(cycle) {
  const savedCycle = { ...cycle, updatedAt: new Date().toISOString() }
  localStorage.setItem(CYCLE_KEY, JSON.stringify(savedCycle))
  queueSyncOperation('menstrual-cycle')
  return savedCycle
}

function dateAtNoon(date) { return new Date(`${date}T12:00:00`) }

function formatDateValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function getCycleSummary(cycle, referenceDate = new Date()) {
  if (!cycle?.lastPeriodStart) return null
  const start = dateAtNoon(cycle.lastPeriodStart)
  if (Number.isNaN(start.getTime())) return null
  const cycleLength = Number(cycle.cycleLength) || 28
  const periodLength = Number(cycle.periodLength) || 5
  const elapsedDays = Math.max(0, Math.floor((dateAtNoon(formatDateValue(referenceDate)) - start) / 86400000))
  const cycleDay = (elapsedDays % cycleLength) + 1
  const ovulationDay = Math.max(periodLength + 2, cycleLength - 14)
  const phase = cycleDay <= periodLength
    ? { key: 'menstruation', label: 'Menstruación', detail: 'Prioriza escuchar tu energía y registrar síntomas.' }
    : cycleDay < ovulationDay - 2
      ? { key: 'follicular', label: 'Fase folicular', detail: 'La energía puede ir aumentando de forma gradual.' }
      : cycleDay <= ovulationDay + 1
        ? { key: 'ovulation', label: 'Ventana estimada de ovulación', detail: 'Observa tu respuesta y mantén el plan profesional.' }
        : { key: 'luteal', label: 'Fase lútea', detail: 'Cuida el descanso, la hidratación y las señales de fatiga.' }
  return {
    cycleDay,
    cycleLength,
    periodLength,
    phase,
    ovulationDay,
    expectedNextPeriod: formatDateValue(addDays(start, cycleLength)),
  }
}

export function getCycleCalendar(cycle, referenceDate = new Date()) {
  const summary = getCycleSummary(cycle, referenceDate)
  if (!summary) return []
  return Array.from({ length: summary.cycleLength }, (_, index) => {
    const day = index + 1
    return {
      day,
      isPeriod: day <= summary.periodLength,
      isFertileEstimate: day >= summary.ovulationDay - 2 && day <= summary.ovulationDay + 1,
      isCurrent: day === summary.cycleDay,
    }
  })
}
