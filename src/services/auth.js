const USER_KEY = 'gymapp.prototype.user'
const SESSION_KEY = 'gymapp.prototype.session'

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

export function getStoredUser() { return read(USER_KEY) }
export function getSessionUser() { return read(SESSION_KEY) }

export function registerLocalUser({ name, email }) {
  const user = { name: name.trim(), email: email.trim().toLowerCase() }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function loginLocalUser(email) {
  const user = getStoredUser()
  if (!user || user.email !== email.trim().toLowerCase()) return null
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function logoutLocalUser() { localStorage.removeItem(SESSION_KEY) }

