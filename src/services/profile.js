const PROFILE_KEY = 'gymapp.prototype.profile'
import { queueSyncOperation } from './sync'

export function getStoredProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null')
  } catch {
    return null
  }
}

export function saveProfile(profile) {
  const savedProfile = { ...profile, capturedAt: new Date().toISOString() }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(savedProfile))
  queueSyncOperation('profile')
  return savedProfile
}
