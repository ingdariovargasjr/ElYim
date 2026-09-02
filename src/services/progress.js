const PROGRESS_KEY = 'gymapp.prototype.progress'

import { queueSyncOperation } from './sync'

function asNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : null
}

function baselineFromProfile(profile) {
  if (!profile) return null
  const weightKg = asNumber(profile.weightKg)
  if (!weightKg) return null
  return {
    id: `baseline-${profile.capturedAt || 'initial'}`,
    date: profile.trainingStartDate || new Date().toISOString().slice(0, 10),
    weightKg,
    bodyFatPercent: asNumber(profile.metrics?.bodyFat),
    waistCm: asNumber(profile.waistCm),
    hipCm: asNumber(profile.hipCm),
    nutritionProgress: 0,
    workoutProgress: 0,
    sleepDuration: null,
    supplementsCompleted: 0,
    cheatMeal: false,
    extraExercise: '',
    notes: 'Línea base de la evaluación inicial.',
    source: 'baseline',
    createdAt: new Date().toISOString(),
  }
}

export function getDefaultProgress(profile) {
  const baseline = baselineFromProfile(profile)
  return { records: baseline ? [baseline] : [] }
}

export function getStoredProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null') } catch { return null }
}

export function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  queueSyncOperation('progress')
  return progress
}

export function upsertProgressRecord(progress, record) {
  const records = [...(progress?.records || [])]
  const existingIndex = records.findIndex((item) => item.date === record.date)
  if (existingIndex >= 0) records.splice(existingIndex, 1, { ...records[existingIndex], ...record })
  else records.push(record)
  records.sort((a, b) => a.date.localeCompare(b.date))
  return { records }
}

export function createProgressRecord(form, context = {}) {
  return {
    id: `check-in-${form.date}-${Date.now()}`,
    date: form.date,
    weightKg: asNumber(form.weightKg),
    bodyFatPercent: asNumber(form.bodyFatPercent),
    waistCm: asNumber(form.waistCm),
    hipCm: asNumber(form.hipCm),
    nutritionProgress: context.nutritionProgress ?? 0,
    workoutProgress: context.workoutProgress ?? 0,
    sleepDuration: context.sleepDuration ?? null,
    supplementsCompleted: context.supplementsCompleted ?? 0,
    cheatMeal: Boolean(form.cheatMeal),
    extraExercise: String(form.extraExercise || '').trim(),
    notes: String(form.notes || '').trim(),
    source: 'manual',
    createdAt: new Date().toISOString(),
  }
}
