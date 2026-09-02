<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { getSessionUser, loginLocalUser, logoutLocalUser, registerLocalUser } from './services/auth'
import { calculateBodyMetrics } from './services/body-composition'
import { getStoredProfile, saveProfile } from './services/profile'
import { getDefaultDiet, getStoredDiet, saveDiet } from './services/nutrition'
import { getDefaultWorkouts, getStoredWorkouts, saveWorkouts } from './services/workouts'
import { getDefaultSchedule, getStoredSchedule, saveSchedule } from './services/schedule'
import { getDefaultSleep, getStoredSleep, saveSleep } from './services/sleep'
import { createProgressRecord, getDefaultProgress, getStoredProgress, saveProgress, upsertProgressRecord } from './services/progress'
import { getCycleCalendar, getCycleSummary, getDefaultCycle, getStoredCycle, saveCycle } from './services/cycle'
import { analyzeDocumentPrototype, discardDocumentReview, getStoredDocument, saveDocumentReview } from './services/documents'
import { getPendingSyncCount, syncPendingChanges } from './services/sync'
import { getDefaultAiProvider, getStoredAiProvider, saveAiProvider, testAiProviderConnection, validateAiProviderConfig } from './services/ai-provider'
import BrandSplash from './components/BrandSplash.vue'
import SkeletonLoader from './components/SkeletonLoader.vue'
import ProgressCheckinView from './components/ProgressCheckinView.vue'

const storedSession = getSessionUser()
const storedProfile = getStoredProfile()
const view = ref(storedSession ? (storedProfile ? 'dashboard' : 'evaluation') : 'welcome')
const activeTab = ref('overview')
const focusedPanel = ref('overview')
const storedTheme = typeof localStorage === 'undefined' ? null : localStorage.getItem('gymapp.prototype.theme')
const theme = ref(storedTheme === 'light' ? 'light' : 'dark')
const pdfModalOpen = ref(false)
const syncModalOpen = ref(false)
const providerModalOpen = ref(false)
const scheduleCloseButton = ref(null)
const pdfCloseButton = ref(null)
const syncCloseButton = ref(null)
const providerCloseButton = ref(null)
const documentProgress = ref(0)
let documentProgressTimer
const formError = ref('')
const sessionUser = ref(storedSession)
const profile = ref(storedProfile)
const dietPlan = ref(getStoredDiet() || getDefaultDiet())
const routinePlan = ref(getStoredWorkouts() || getDefaultWorkouts())
const schedule = ref(getStoredSchedule() || getDefaultSchedule())
const scheduleSaved = ref(false)
const sleepLog = ref(getStoredSleep() || getDefaultSleep())
const sleepSaved = ref(false)
const storedProgress = getStoredProgress()
const progressData = ref(storedProgress || getDefaultProgress(storedProfile))
const progressSaved = ref(false)
const progressError = ref('')
const cycleData = ref(getStoredCycle() || getDefaultCycle())
const cycleSaved = ref(false)
const cycleError = ref('')
const storedDocument = getStoredDocument()
const documentState = ref(storedDocument ? 'approved' : 'idle')
const uploadedDocument = ref(storedDocument ? { name: storedDocument.documentName, size: 0 } : null)
const extractedReview = ref(storedDocument)
const documentError = ref('')
const isOnline = ref(typeof navigator === 'undefined' ? true : navigator.onLine)
const syncState = ref('idle')
const syncMessage = ref('')
const syncRevision = ref(0)
const lastSyncAt = ref(localStorage.getItem('gymapp.prototype.last-sync') || '')
const storedAiProvider = getStoredAiProvider()
const aiProvider = ref(storedAiProvider || getDefaultAiProvider())
const providerForm = reactive({
  providerName: aiProvider.value.providerName,
  endpoint: aiProvider.value.endpoint,
  model: aiProvider.value.model,
  maxFileSizeMb: aiProvider.value.maxFileSizeMb,
})
const providerError = ref('')
const providerMessage = ref('')
const providerTesting = ref(false)
const splashVisible = ref(true)
const isViewLoading = ref(Boolean(sessionUser.value))
const chartAnimationKey = ref(0)
let viewLoadingTimer
let splashTimer

if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme.value

const registerForm = reactive({ name: '', email: '', password: '', confirmPassword: '', terms: false })
const loginForm = reactive({ email: '', password: '' })
const evaluationForm = reactive({
  name: storedSession?.name || '',
  age: '',
  heightCm: '',
  weightKg: '',
  sex: '',
  waistCm: '',
  hipCm: '',
  thighLeftCm: '',
  thighRightCm: '',
  bicepsLeftCm: '',
  torsoCm: '',
  neckCm: '',
  goal: 'Recomposición corporal',
  trainingStartDate: new Date().toISOString().slice(0, 10),
  dietStartDate: new Date().toISOString().slice(0, 10),
})
const progressForm = reactive({
  date: new Date().toISOString().slice(0, 10),
  weightKg: storedProfile?.weightKg || '',
  bodyFatPercent: storedProfile?.metrics?.bodyFat || '',
  waistCm: storedProfile?.waistCm || '',
  hipCm: storedProfile?.hipCm || '',
  cheatMeal: false,
  extraExercise: '',
  notes: '',
})
const firstName = computed(() => sessionUser.value?.name?.split(' ')[0] || 'Atleta')
const bodyMetrics = computed(() => calculateBodyMetrics(evaluationForm))
const goals = ['Recomposición corporal', 'Perder grasa', 'Ganar masa muscular', 'Mantener el peso', 'Mejorar fuerza y rendimiento', 'Mejorar condición física', 'Crear constancia y disciplina']
const completedIngredients = computed(() => dietPlan.value.meals.flatMap((meal) => meal.ingredients).filter((ingredient) => ingredient.completed).length)
const totalIngredients = computed(() => dietPlan.value.meals.flatMap((meal) => meal.ingredients).length)
const nutritionProgress = computed(() => totalIngredients.value ? Math.round((completedIngredients.value / totalIngredients.value) * 100) : 0)
const completedSupplements = computed(() => dietPlan.value.supplements.filter((supplement) => supplement.completed).length)
const dayOptions = [
  { key: 'monday', short: 'Lun' }, { key: 'tuesday', short: 'Mar' }, { key: 'wednesday', short: 'Mié' },
  { key: 'thursday', short: 'Jue' }, { key: 'friday', short: 'Vie' }, { key: 'saturday', short: 'Sáb' }, { key: 'sunday', short: 'Dom' },
]
const todayKey = dayOptions[(new Date().getDay() + 6) % 7]?.key || 'monday'
const selectedDay = ref(todayKey)
const selectedRoutine = computed(() => {
  const day = routinePlan.value.days[selectedDay.value]
  if (!day) return null
  if (routinePlan.value.restDay === selectedDay.value) return { ...day, routineId: null, name: 'Descanso', focus: 'Recuperación', duration: '—', exercises: [] }
  return day
})
const totalSets = computed(() => selectedRoutine.value?.exercises.reduce((total, exercise) => total + exercise.sets, 0) || 0)
const completedSets = computed(() => selectedRoutine.value?.exercises.reduce((total, exercise) => total + exercise.completedSets.length, 0) || 0)
const workoutProgress = computed(() => totalSets.value ? Math.round((completedSets.value / totalSets.value) * 100) : 0)
const upcomingEvents = computed(() => [
  { key: 'breakfast', label: 'Desayuno', time: dietPlan.value.meals[0]?.time || '08:00', enabled: schedule.value.reminders.meals },
  { key: 'training', label: 'Entrenamiento', time: schedule.value.trainingTime, enabled: schedule.value.reminders.training },
  { key: 'supplements', label: 'Suplementos', time: '09:00', enabled: schedule.value.reminders.supplements },
  { key: 'sleep', label: 'Prepararte para dormir', time: schedule.value.sleepTime, enabled: schedule.value.reminders.sleep },
].filter((event) => event.enabled))
const sleepDuration = computed(() => {
  if (!sleepLog.value.bedtime || !sleepLog.value.wakeTime) return null
  const toMinutes = (time) => { const [hours, minutes] = time.split(':').map(Number); return hours * 60 + minutes }
  const bedtime = toMinutes(sleepLog.value.bedtime)
  const wakeTime = toMinutes(sleepLog.value.wakeTime)
  let duration = wakeTime - bedtime
  if (duration <= 0) duration += 24 * 60
  return duration / 60
})
const recoveryLabel = computed(() => {
  if (sleepDuration.value === null || !sleepLog.value.quality || !sleepLog.value.energy) return 'Pendiente'
  return sleepDuration.value >= 7 && sleepLog.value.quality >= 3 && sleepLog.value.energy >= 3 ? 'Buena base' : 'A revisar'
})
const progressRecords = computed(() => [...(progressData.value.records || [])].sort((a, b) => a.date.localeCompare(b.date)))
const baselineProgress = computed(() => progressRecords.value[0] || null)
const latestProgress = computed(() => progressRecords.value[progressRecords.value.length - 1] || null)
const weightChange = computed(() => baselineProgress.value && latestProgress.value ? Number(latestProgress.value.weightKg) - Number(baselineProgress.value.weightKg) : null)
const weightChangePercent = computed(() => baselineProgress.value?.weightKg && weightChange.value !== null ? (weightChange.value / Number(baselineProgress.value.weightKg)) * 100 : null)
const bodyFatRecords = computed(() => progressRecords.value.filter((record) => Number.isFinite(Number(record.bodyFatPercent)) && Number(record.bodyFatPercent) > 0))
const latestBodyFat = computed(() => bodyFatRecords.value[bodyFatRecords.value.length - 1]?.bodyFatPercent ?? null)
const bodyFatChange = computed(() => bodyFatRecords.value.length >= 2 ? Number(latestBodyFat.value) - Number(bodyFatRecords.value[0].bodyFatPercent) : null)
const latestLeanMass = computed(() => latestProgress.value?.bodyFatPercent ? Number(latestProgress.value.weightKg) * (1 - (Number(latestProgress.value.bodyFatPercent) / 100)) : null)
const averageAdherence = computed(() => {
  if (!progressRecords.value.length) return 0
  const values = progressRecords.value.map((record) => (Number(record.nutritionProgress || 0) + Number(record.workoutProgress || 0)) / 2)
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length)
})
const weightChart = computed(() => chartCoordinates(progressRecords.value, 'weightKg'))
const bodyFatChart = computed(() => chartCoordinates(bodyFatRecords.value, 'bodyFatPercent'))
const isFemaleProfile = computed(() => profile.value?.sex === 'female')
const cycleSummary = computed(() => getCycleSummary(cycleData.value))
const cycleCalendar = computed(() => getCycleCalendar(cycleData.value))
const progressInsight = computed(() => {
  if (progressRecords.value.length < 2) return 'Agrega otro check-in para convertir tu línea base en una tendencia.'
  if (weightChange.value < -0.2) return 'Tu peso muestra una tendencia descendente. Observa también energía, rendimiento y medidas.'
  if (weightChange.value > 0.2) return 'Tu peso muestra una tendencia ascendente. Relaciónalo con tus medidas y tu rendimiento.'
  return 'Tu peso se mantiene estable. En recomposición, revisa también cintura, rendimiento y fotografías con tu profesional.'
})
const pendingSyncCount = computed(() => { syncRevision.value; return getPendingSyncCount() })
const providerStatusLabel = computed(() => ({
  'not-configured': 'Pendiente de configurar',
  'saved-local': 'Guardado localmente',
  'backend-required': 'Backend seguro pendiente',
}[aiProvider.value.status] || 'Estado pendiente'))

function finishViewLoading() {
  isViewLoading.value = false
  chartAnimationKey.value += 1
}

if (isViewLoading.value) setTimeout(finishViewLoading, 1200)

const benefits = [
  { icon: '✦', title: 'Tu plan, organizado', text: 'Dieta, rutinas y recomendaciones en un solo lugar.' },
  { icon: '↗', title: 'Progreso visible', text: 'Registra tus avances y observa tus tendencias.' },
  { icon: '◷', title: 'Recordatorios útiles', text: 'Recibe avisos de tus comidas, entrenamiento y descanso.' },
]
const tabs = [
  { key: 'overview', label: 'Overview', icon: '◌' },
  { key: 'routines', label: 'Rutinas', icon: '✦' },
  { key: 'nutrition', label: 'Régimen', icon: '◒' },
  { key: 'rest', label: 'Descanso', icon: '☾' },
]

function openView(nextView) {
  if (viewLoadingTimer) clearTimeout(viewLoadingTimer)
  view.value = nextView
  formError.value = ''
  isViewLoading.value = true
  viewLoadingTimer = setTimeout(finishViewLoading, 1000)
}

function selectTab(nextTab) {
  if (activeTab.value === nextTab && focusedPanel.value === 'overview') return
  activeTab.value = nextTab
  focusedPanel.value = 'overview'
}

function focusDialog(closeButton) {
  nextTick(() => closeButton.value?.focus())
}

function openFocusedPanel(panel) {
  activeTab.value = 'overview'
  focusedPanel.value = panel
}

function openScheduleModal() {
  activeTab.value = 'overview'
  focusedPanel.value = 'schedule'
  focusDialog(scheduleCloseButton)
}

function closeScheduleModal() { focusedPanel.value = 'overview' }

function openPdfModal() {
  providerModalOpen.value = false
  pdfModalOpen.value = true
  focusDialog(pdfCloseButton)
}
function closePdfModal() { pdfModalOpen.value = false }
function openProviderModal() {
  pdfModalOpen.value = false
  providerForm.providerName = aiProvider.value.providerName
  providerForm.endpoint = aiProvider.value.endpoint
  providerForm.model = aiProvider.value.model
  providerForm.maxFileSizeMb = aiProvider.value.maxFileSizeMb
  providerError.value = ''
  providerMessage.value = ''
  providerModalOpen.value = true
  focusDialog(providerCloseButton)
}
function closeProviderModal() {
  if (providerTesting.value) return
  providerModalOpen.value = false
}
function saveProviderConfiguration() {
  providerError.value = validateAiProviderConfig(providerForm)
  providerMessage.value = ''
  if (providerError.value) return
  aiProvider.value = saveAiProvider(providerForm)
  providerMessage.value = 'Configuración guardada en este dispositivo. La clave seguirá fuera de la app.'
}
async function testProviderConfiguration() {
  providerError.value = validateAiProviderConfig(providerForm)
  providerMessage.value = ''
  if (providerError.value) return
  providerTesting.value = true
  const result = await testAiProviderConnection()
  aiProvider.value = { ...aiProvider.value, status: result.status }
  providerMessage.value = result.message
  providerTesting.value = false
}
function openSyncModal() {
  syncModalOpen.value = true
  focusDialog(syncCloseButton)
  if (syncState.value !== 'syncing') void syncNow()
}
function closeSyncModal() {
  if (syncState.value === 'syncing') return
  syncModalOpen.value = false
}

function setTheme(nextTheme) {
  theme.value = nextTheme === 'light' ? 'light' : 'dark'
  if (typeof localStorage !== 'undefined') localStorage.setItem('gymapp.prototype.theme', theme.value)
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme.value
}

function toggleTheme() { setTheme(theme.value === 'dark' ? 'light' : 'dark') }

function handleEscape(event) {
  if (event.key !== 'Escape') return
  if (providerModalOpen.value) return closeProviderModal()
  if (pdfModalOpen.value) return closePdfModal()
  if (syncModalOpen.value) return closeSyncModal()
  if (focusedPanel.value === 'schedule') closeScheduleModal()
}

function submitRegister() {
  formError.value = ''
  if (registerForm.name.trim().length < 2) return (formError.value = 'Escribe tu nombre completo.')
  if (!/^\S+@\S+\.\S+$/.test(registerForm.email)) return (formError.value = 'Introduce un correo válido.')
  if (registerForm.password.length < 8) return (formError.value = 'La contraseña debe tener al menos 8 caracteres.')
  if (registerForm.password !== registerForm.confirmPassword) return (formError.value = 'Las contraseñas no coinciden.')
  if (!registerForm.terms) return (formError.value = 'Acepta los términos para continuar.')

  sessionUser.value = registerLocalUser(registerForm)
  evaluationForm.name = sessionUser.value.name
  view.value = 'evaluation'
  isViewLoading.value = false
}

function submitLogin() {
  formError.value = ''
  if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) return (formError.value = 'Introduce un correo válido.')
  if (!loginForm.password) return (formError.value = 'Introduce tu contraseña.')

  const user = loginLocalUser(loginForm.email)
  if (!user) return (formError.value = 'No encontramos una cuenta local con ese correo. Regístrate primero.')

  sessionUser.value = user
  profile.value = getStoredProfile()
  view.value = profile.value ? 'dashboard' : 'evaluation'
  isViewLoading.value = false
}

function formatMetric(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : '—'
}

function formatLastSync(value) {
  if (!value) return 'Nunca sincronizado'
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

function formatDate(date) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`))
}

function formatSignedMetric(value, suffix = '') {
  if (value === null || !Number.isFinite(Number(value))) return '—'
  const numericValue = Number(value)
  return `${numericValue > 0 ? '+' : ''}${numericValue.toFixed(1)}${suffix}`
}

function chartCoordinates(records, field) {
  const values = records.map((record) => Number(record[field])).filter((value) => Number.isFinite(value))
  if (!values.length) return { polyline: '', dots: [] }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = Math.max(max - min, 1)
  const dots = records.map((record, index) => {
    const value = Number(record[field])
    const x = records.length === 1 ? 140 : 12 + (index / (records.length - 1)) * 256
    const y = 106 - ((value - min) / spread) * 82
    return { x, y, value, date: record.date }
  })
  return { polyline: dots.map((point) => `${point.x},${point.y}`).join(' '), dots }
}

function submitEvaluation() {
  formError.value = ''
  const requiredText = [evaluationForm.name, evaluationForm.sex, evaluationForm.goal, evaluationForm.trainingStartDate, evaluationForm.dietStartDate]
  if (requiredText.some((value) => !String(value).trim())) return (formError.value = 'Completa los campos obligatorios.')

  const numericFields = ['age', 'heightCm', 'weightKg', 'waistCm', 'hipCm', 'thighLeftCm', 'thighRightCm', 'bicepsLeftCm', 'torsoCm', 'neckCm']
  if (numericFields.some((field) => !Number.isFinite(Number(evaluationForm[field])) || Number(evaluationForm[field]) <= 0)) return (formError.value = 'Revisa que todas las medidas tengan valores mayores que cero.')
  if (Number(evaluationForm.age) < 13 || Number(evaluationForm.age) > 100) return (formError.value = 'La edad debe estar entre 13 y 100 años.')
  if (Number(evaluationForm.heightCm) < 100 || Number(evaluationForm.heightCm) > 250) return (formError.value = 'La estatura debe estar entre 100 y 250 cm.')
  if (Number(evaluationForm.weightKg) < 30 || Number(evaluationForm.weightKg) > 400) return (formError.value = 'El peso debe estar entre 30 y 400 kg.')
  if (!bodyMetrics.value || bodyMetrics.value.bodyFat === null) return (formError.value = 'Faltan medidas válidas para estimar el porcentaje de grasa.')

  profile.value = saveProfile({ ...evaluationForm, metrics: bodyMetrics.value })
  if (!progressData.value.records.length) progressData.value = saveProgress(getDefaultProgress(profile.value))
  progressForm.weightKg = evaluationForm.weightKg
  progressForm.bodyFatPercent = bodyMetrics.value.bodyFat
  progressForm.waistCm = evaluationForm.waistCm
  progressForm.hipCm = evaluationForm.hipCm
  refreshSyncStatus()
  view.value = 'dashboard'
  isViewLoading.value = true
  if (viewLoadingTimer) clearTimeout(viewLoadingTimer)
  viewLoadingTimer = setTimeout(finishViewLoading, 1200)
}

function saveProgressCheckin() {
  progressError.value = ''
  const today = new Date().toISOString().slice(0, 10)
  if (!progressForm.date || progressForm.date > today) return (progressError.value = 'El check-in no puede tener una fecha futura.')
  if (!Number.isFinite(Number(progressForm.weightKg)) || Number(progressForm.weightKg) <= 0) return (progressError.value = 'Registra un peso mayor que cero.')
  if (progressForm.bodyFatPercent && (Number(progressForm.bodyFatPercent) <= 0 || Number(progressForm.bodyFatPercent) >= 100)) return (progressError.value = 'El porcentaje de grasa debe estar entre 0 y 100.')
  const record = createProgressRecord(progressForm, {
    nutritionProgress: nutritionProgress.value,
    workoutProgress: workoutProgress.value,
    sleepDuration: sleepDuration.value,
    supplementsCompleted: completedSupplements.value,
  })
  progressData.value = saveProgress(upsertProgressRecord(progressData.value, record))
  progressSaved.value = true
  chartAnimationKey.value += 1
}

function saveCycleSettings() {
  cycleError.value = ''
  const today = new Date().toISOString().slice(0, 10)
  if (!cycleData.value.lastPeriodStart) return (cycleError.value = 'Indica el primer día de tu último periodo o usa “Borrar datos”.')
  if (cycleData.value.lastPeriodStart > today) return (cycleError.value = 'La fecha de inicio no puede ser futura.')
  if (Number(cycleData.value.cycleLength) < 21 || Number(cycleData.value.cycleLength) > 40) return (cycleError.value = 'La duración promedio del ciclo debe estar entre 21 y 40 días.')
  if (Number(cycleData.value.periodLength) < 2 || Number(cycleData.value.periodLength) > 10 || Number(cycleData.value.periodLength) >= Number(cycleData.value.cycleLength)) return (cycleError.value = 'La duración del periodo debe estar entre 2 y 10 días y ser menor que el ciclo.')
  cycleData.value = saveCycle(cycleData.value)
  cycleSaved.value = true
}

function clearCycleSettings() {
  cycleData.value = getDefaultCycle()
  saveCycle(cycleData.value)
  cycleSaved.value = true
  cycleError.value = ''
}

function toggleIngredient(mealId, ingredientId) {
  const meal = dietPlan.value.meals.find((item) => item.id === mealId)
  const ingredient = meal?.ingredients.find((item) => item.id === ingredientId)
  if (!ingredient) return
  ingredient.completed = !ingredient.completed
  saveDiet(dietPlan.value)
  refreshSyncStatus()
}

function updateMealTime() { saveDiet(dietPlan.value); refreshSyncStatus() }

function toggleSupplement(supplement) {
  supplement.completed = !supplement.completed
  saveDiet(dietPlan.value)
  refreshSyncStatus()
}

function isRestDay(dayKey) { return routinePlan.value.restDay === dayKey }

function updateWeekLength() {
  if (routinePlan.value.weekLength === 6 && routinePlan.value.restDay === 'none') routinePlan.value.restDay = 'sunday'
  saveWorkouts(routinePlan.value)
  refreshSyncStatus()
}

function updateRestDay() { saveWorkouts(routinePlan.value); refreshSyncStatus() }

function toggleSet(exerciseId, setNumber) {
  const day = routinePlan.value.days[selectedDay.value]
  const exercise = day?.exercises.find((item) => item.id === exerciseId)
  if (!exercise) return
  exercise.completedSets = exercise.completedSets.includes(setNumber)
    ? exercise.completedSets.filter((set) => set !== setNumber)
    : [...exercise.completedSets, setNumber]
  saveWorkouts(routinePlan.value)
  refreshSyncStatus()
}

function updateExerciseWeight() { saveWorkouts(routinePlan.value); refreshSyncStatus() }

function saveSchedulePreferences() {
  saveSchedule(schedule.value)
  refreshSyncStatus()
  scheduleSaved.value = true
}

function saveSleepLog() {
  sleepLog.value.source = 'manual'
  saveSleep(sleepLog.value)
  refreshSyncStatus()
  sleepSaved.value = true
}

function refreshSyncStatus() { syncRevision.value += 1 }

function handleOnline() { isOnline.value = true; syncMessage.value = 'Conexión disponible. Tus cambios pueden sincronizarse.' }
function handleOffline() { isOnline.value = false; syncMessage.value = 'Sin conexión. Tus cambios se guardarán en este dispositivo.' }

async function syncNow() {
  if (syncState.value === 'syncing') return
  if (!isOnline.value) { syncState.value = 'offline'; syncMessage.value = 'No hay conexión. Inténtalo cuando vuelvas a estar online.'; return }
  syncState.value = 'syncing'
  const result = await syncPendingChanges(isOnline.value)
  syncState.value = 'idle'
  lastSyncAt.value = new Date().toISOString()
  localStorage.setItem('gymapp.prototype.last-sync', lastSyncAt.value)
  refreshSyncStatus()
  syncMessage.value = result.synced ? `${result.synced} cambio(s) sincronizado(s) correctamente.` : 'No hay cambios pendientes por sincronizar.'
}

async function handleDocumentUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  documentError.value = ''
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (!isPdf) { documentError.value = 'Selecciona un archivo PDF.'; event.target.value = ''; return }
  const maxFileSizeMb = Number(aiProvider.value.maxFileSizeMb) || 10
  if (file.size > maxFileSizeMb * 1024 * 1024) { documentError.value = `El PDF no debe superar los ${maxFileSizeMb} MB.`; event.target.value = ''; return }

  uploadedDocument.value = { name: file.name, size: file.size }
  documentState.value = 'processing'
  documentProgress.value = 8
  if (documentProgressTimer) clearInterval(documentProgressTimer)
  documentProgressTimer = setInterval(() => { documentProgress.value = Math.min(documentProgress.value + 9, 92) }, 120)
  extractedReview.value = await analyzeDocumentPrototype(file)
  if (documentProgressTimer) clearInterval(documentProgressTimer)
  documentProgress.value = 100
  documentState.value = 'review'
}

function approveDocumentReview() {
  if (!extractedReview.value) return
  saveDocumentReview(extractedReview.value)
  documentState.value = 'approved'
  refreshSyncStatus()
}

function discardDocument() {
  discardDocumentReview()
  uploadedDocument.value = null
  extractedReview.value = null
  documentProgress.value = 0
  documentState.value = 'idle'
}

function formatFileSize(bytes) {
  if (!bytes) return 'Guardado localmente'
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

onMounted(() => {
  document.documentElement.dataset.theme = theme.value
  splashTimer = setTimeout(() => { splashVisible.value = false }, 1500)
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
  window.removeEventListener('keydown', handleEscape)
  if (documentProgressTimer) clearInterval(documentProgressTimer)
  if (viewLoadingTimer) clearTimeout(viewLoadingTimer)
  if (splashTimer) clearTimeout(splashTimer)
})

function logout() {
  logoutLocalUser()
  sessionUser.value = null
  profile.value = null
  view.value = 'welcome'
  activeTab.value = 'overview'
  focusedPanel.value = 'overview'
  pdfModalOpen.value = false
  syncModalOpen.value = false
  providerModalOpen.value = false
  loginForm.password = ''
  isViewLoading.value = false
}
</script>

<template>
  <main :data-theme="theme" class="app-shell min-h-screen overflow-hidden px-5 pb-6 pt-3 text-white sm:px-8 sm:pt-4">
    <Transition name="brand-splash" appear>
      <BrandSplash v-if="splashVisible" />
    </Transition>
    <div class="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
      <header class="flex items-center justify-between">
        <div class="topbar-actions">
          <button type="button" class="theme-toggle" role="switch" :aria-checked="theme === 'dark'" :aria-label="theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'" @click="toggleTheme"><span :class="{ 'theme-label-active': theme === 'light' }">Claro</span><span class="theme-track"><span class="theme-thumb" :class="{ 'theme-thumb-light': theme === 'light' }"></span></span><span :class="{ 'theme-label-active': theme === 'dark' }">Oscuro</span></button>
          <button v-if="sessionUser" type="button" class="logout-button" @click="logout">Salir</button>
        </div>
      </header>

      <Transition name="view" mode="out-in">
      <section v-if="isViewLoading && view !== 'dashboard'" key="view-loader" class="flex flex-1 items-center justify-center py-12" aria-live="polite" aria-busy="true">
        <div class="route-loader"><span class="loader-orbit">◌</span><p class="mt-5 text-sm font-semibold">Cargando tu vista...</p><p class="mt-2 text-xs text-slate-500">Estamos preparando tu información.</p></div>
      </section>

      <section v-else-if="view === 'welcome'" key="welcome" class="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div>
          <p class="mb-5 inline-flex rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime-200">Bienvenido a tu Yim</p>
          <h1 class="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">Todo tu progreso, <span class="text-lime-300">en movimiento.</span></h1>
          <p class="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Haz de tu Yim el espacio para organizar tu alimentación, entrenamiento y recuperación con una guía diaria hecha para ti.</p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <button class="rounded-2xl bg-lime-300 px-5 py-3.5 font-bold text-slate-950 shadow-[0_12px_35px_rgba(7,176,242,0.2)] transition hover:bg-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-200 focus:ring-offset-2 focus:ring-offset-slate-950" @click="openView('register')">Crear mi cuenta</button>
            <button class="rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-slate-950" @click="openView('login')">Iniciar sesión</button>
          </div>
          <div class="mt-10 grid gap-3 sm:grid-cols-3">
            <article v-for="benefit in benefits" :key="benefit.title" class="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <span class="text-xl text-lime-300">{{ benefit.icon }}</span>
              <h2 class="mt-4 text-sm font-bold">{{ benefit.title }}</h2>
              <p class="mt-2 text-xs leading-5 text-slate-400">{{ benefit.text }}</p>
            </article>
          </div>
        </div>
        <div class="relative mx-auto w-full max-w-md">
          <div class="absolute -inset-8 rounded-full bg-lime-300/10 blur-3xl"></div>
          <div class="relative rounded-[2rem] border border-white/15 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-2xl">
            <div class="rounded-[1.5rem] bg-slate-950/70 p-5">
              <div class="flex items-center justify-between"><div><p class="text-xs text-slate-400">Resumen de hoy</p><h2 class="mt-1 text-xl font-bold">Tu día en equilibrio</h2></div><span class="grid size-10 place-items-center rounded-2xl bg-lime-300/15 text-lime-300">✦</span></div>
              <div class="mt-6 grid grid-cols-2 gap-3"><div class="rounded-2xl bg-white/[0.07] p-4"><p class="text-xs text-slate-400">Rutina</p><p class="mt-2 text-lg font-bold">Pendiente</p><p class="mt-1 text-xs text-lime-300">45 min · Tren superior</p></div><div class="rounded-2xl bg-white/[0.07] p-4"><p class="text-xs text-slate-400">Alimentación</p><p class="mt-2 text-lg font-bold">2 de 3</p><p class="mt-1 text-xs text-lime-300">comidas completadas</p></div></div>
              <div class="mt-3 rounded-2xl border border-lime-300/15 bg-lime-300/10 p-4"><div class="flex items-center justify-between"><span class="text-sm font-semibold">Progreso diario</span><span class="text-sm font-bold text-lime-300">67%</span></div><div class="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div class="h-full w-2/3 rounded-full bg-lime-300"></div></div><p class="mt-3 text-xs text-slate-300">Un paso constante cuenta más que un día perfecto.</p></div>
              <div class="mt-3 flex items-center gap-3 rounded-2xl bg-white/[0.05] p-4"><span class="grid size-9 place-items-center rounded-xl bg-sky-300/15 text-sky-200">◷</span><div><p class="text-sm font-semibold">Próximo recordatorio</p><p class="mt-1 text-xs text-slate-400">Registrar descanso · 22:00</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="view === 'register' || view === 'login'" key="auth" class="flex flex-1 items-center justify-center py-12">
        <div class="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <button class="mb-8 text-sm text-slate-400 transition hover:text-white" @click="openView('welcome')">← Volver</button>
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-lime-300">{{ view === 'register' ? 'Crear tu Yim' : 'Bienvenido de nuevo a tu Yim' }}</p>
          <h1 class="mt-3 text-3xl font-black tracking-tight">{{ view === 'register' ? 'Comencemos a construir tu Yim.' : 'Continúa con tu progreso.' }}</h1>
          <p class="mt-3 text-sm leading-6 text-slate-400">{{ view === 'register' ? 'Tus datos quedarán listos para personalizar tu Yim.' : 'Accede para consultar tus rutinas, comidas y registros.' }}</p>

          <form v-if="view === 'register'" class="mt-8 space-y-4" @submit.prevent="submitRegister">
            <label class="block text-sm font-medium" for="register-name">Nombre completo<input id="register-name" v-model="registerForm.name" type="text" autocomplete="name" class="form-input" placeholder="Ej. Alejandro García" /></label>
            <label class="block text-sm font-medium" for="register-email">Correo electrónico<input id="register-email" v-model="registerForm.email" type="email" autocomplete="email" class="form-input" placeholder="tu@correo.com" /></label>
            <label class="block text-sm font-medium" for="register-password">Contraseña<input id="register-password" v-model="registerForm.password" type="password" autocomplete="new-password" class="form-input" placeholder="Mínimo 8 caracteres" /></label>
            <label class="block text-sm font-medium" for="register-confirm">Confirmar contraseña<input id="register-confirm" v-model="registerForm.confirmPassword" type="password" autocomplete="new-password" class="form-input" placeholder="Repite tu contraseña" /></label>
            <label class="flex items-start gap-3 text-xs leading-5 text-slate-400"><input v-model="registerForm.terms" type="checkbox" class="mt-1 accent-lime-300" />Acepto los términos y el tratamiento de mis datos para usar El Yim.</label>
            <p v-if="formError" class="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100" role="alert">{{ formError }}</p>
            <button type="submit" class="w-full rounded-2xl bg-lime-300 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-lime-200">Crear cuenta</button>
          </form>

          <form v-else class="mt-8 space-y-4" @submit.prevent="submitLogin">
            <label class="block text-sm font-medium" for="login-email">Correo electrónico<input id="login-email" v-model="loginForm.email" type="email" autocomplete="email" class="form-input" placeholder="tu@correo.com" /></label>
            <label class="block text-sm font-medium" for="login-password">Contraseña<input id="login-password" v-model="loginForm.password" type="password" autocomplete="current-password" class="form-input" placeholder="Tu contraseña" /></label>
            <p v-if="formError" class="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100" role="alert">{{ formError }}</p>
            <button type="submit" class="w-full rounded-2xl bg-lime-300 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-lime-200">Iniciar sesión</button>
          </form>

          <p class="mt-6 text-center text-sm text-slate-400">{{ view === 'register' ? '¿Ya tienes una cuenta?' : '¿Todavía no tienes una cuenta?' }} <button class="font-semibold text-lime-300 hover:text-lime-200" @click="openView(view === 'register' ? 'login' : 'register')">{{ view === 'register' ? 'Inicia sesión' : 'Regístrate' }}</button></p>
          <p v-if="view === 'login'" class="mt-4 text-center text-[11px] text-slate-500">Prototipo local: la autenticación real se conectará en un incremento posterior.</p>
        </div>
      </section>

      <section v-else-if="view === 'evaluation'" key="evaluation" class="flex flex-1 items-center justify-center py-12">
        <div class="w-full max-w-5xl">
          <div class="mb-8 max-w-2xl">
            <p class="text-sm font-semibold uppercase tracking-[0.16em] text-lime-300">Evaluación inicial · 1 de 1</p>
            <h1 class="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Conozcamos tu punto de partida.</h1>
            <p class="mt-4 text-sm leading-6 text-slate-400">Registra tus datos y medidas actuales. Los cálculos son estimaciones orientativas para observar tu progreso.</p>
          </div>

          <form class="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]" @submit.prevent="submitEvaluation">
            <div class="space-y-5">
              <section class="glass-panel">
                <div class="mb-5"><h2 class="text-lg font-bold">Datos personales</h2><p class="mt-1 text-xs text-slate-400">Usaremos estos datos para personalizar tu plan.</p></div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <label class="block text-sm font-medium sm:col-span-2" for="evaluation-name">Nombre completo<input id="evaluation-name" v-model="evaluationForm.name" type="text" autocomplete="name" class="form-input" placeholder="Ej. Alejandro García" /></label>
                  <label class="block text-sm font-medium" for="evaluation-age">Edad<input id="evaluation-age" v-model="evaluationForm.age" type="number" min="13" max="100" class="form-input" placeholder="28" /></label>
                  <label class="block text-sm font-medium" for="evaluation-sex">Perfil para el cálculo<select id="evaluation-sex" v-model="evaluationForm.sex" class="form-input"><option disabled value="">Selecciona una opción</option><option value="male">Masculino</option><option value="female">Femenino</option></select></label>
                  <label class="block text-sm font-medium" for="evaluation-height">Estatura (cm)<input id="evaluation-height" v-model="evaluationForm.heightCm" type="number" min="100" max="250" step="0.1" class="form-input" placeholder="175" /></label>
                  <label class="block text-sm font-medium" for="evaluation-weight">Peso (kg)<input id="evaluation-weight" v-model="evaluationForm.weightKg" type="number" min="30" max="400" step="0.1" class="form-input" placeholder="78" /></label>
                </div>
              </section>

              <section class="glass-panel">
                <div class="mb-5"><h2 class="text-lg font-bold">Medidas corporales</h2><p class="mt-1 text-xs text-slate-400">Captúralas en centímetros, usando siempre el mismo método de medición.</p></div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <label class="block text-sm font-medium" for="evaluation-waist">Cintura (cm)<input id="evaluation-waist" v-model="evaluationForm.waistCm" type="number" min="1" step="0.1" class="form-input" placeholder="85" /></label>
                  <label class="block text-sm font-medium" for="evaluation-hip">Cadera (cm)<input id="evaluation-hip" v-model="evaluationForm.hipCm" type="number" min="1" step="0.1" class="form-input" placeholder="98" /></label>
                  <label class="block text-sm font-medium" for="evaluation-neck">Cuello (cm)<input id="evaluation-neck" v-model="evaluationForm.neckCm" type="number" min="1" step="0.1" class="form-input" placeholder="38" /></label>
                  <label class="block text-sm font-medium" for="evaluation-torso">Torso (cm)<input id="evaluation-torso" v-model="evaluationForm.torsoCm" type="number" min="1" step="0.1" class="form-input" placeholder="98" /></label>
                  <label class="block text-sm font-medium" for="evaluation-thigh-left">Muslo izquierdo (cm)<input id="evaluation-thigh-left" v-model="evaluationForm.thighLeftCm" type="number" min="1" step="0.1" class="form-input" placeholder="56" /></label>
                  <label class="block text-sm font-medium" for="evaluation-thigh-right">Muslo derecho (cm)<input id="evaluation-thigh-right" v-model="evaluationForm.thighRightCm" type="number" min="1" step="0.1" class="form-input" placeholder="56" /></label>
                  <label class="block text-sm font-medium sm:col-span-2" for="evaluation-biceps-left">Bíceps izquierdo (cm)<input id="evaluation-biceps-left" v-model="evaluationForm.bicepsLeftCm" type="number" min="1" step="0.1" class="form-input" placeholder="34" /></label>
                </div>
              </section>

              <section class="glass-panel">
                <div class="mb-5"><h2 class="text-lg font-bold">Objetivo y fechas</h2><p class="mt-1 text-xs text-slate-400">Estas fechas serán la referencia para tus gráficas.</p></div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <label class="block text-sm font-medium sm:col-span-2" for="evaluation-goal">Objetivo principal<select id="evaluation-goal" v-model="evaluationForm.goal" class="form-input"><option v-for="goal in goals" :key="goal" :value="goal">{{ goal }}</option></select></label>
                  <label class="block text-sm font-medium" for="training-start">Inicio del entrenamiento<input id="training-start" v-model="evaluationForm.trainingStartDate" type="date" class="form-input" /></label>
                  <label class="block text-sm font-medium" for="diet-start">Inicio de la dieta<input id="diet-start" v-model="evaluationForm.dietStartDate" type="date" class="form-input" /></label>
                </div>
              </section>
            </div>

            <aside class="space-y-5">
              <section class="glass-panel sticky top-6">
                <div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.15em] text-lime-300">Vista previa</p><h2 class="mt-2 text-xl font-bold">Tus indicadores</h2></div><span class="rounded-xl bg-lime-300/10 px-3 py-2 text-xs text-lime-200">En vivo</span></div>
                <div class="mt-6 grid gap-3">
                  <div class="metric-row"><span>IMC</span><strong>{{ bodyMetrics ? formatMetric(bodyMetrics.bmi) : '—' }}</strong></div>
                  <div class="metric-row"><span>Grasa corporal estimada</span><strong>{{ bodyMetrics && bodyMetrics.bodyFat !== null ? `${formatMetric(bodyMetrics.bodyFat)}%` : '—' }}</strong></div>
                  <div class="metric-row"><span>Masa grasa estimada</span><strong>{{ bodyMetrics && bodyMetrics.fatMassKg !== null ? `${formatMetric(bodyMetrics.fatMassKg)} kg` : '—' }}</strong></div>
                  <div class="metric-row"><span>Masa libre de grasa</span><strong>{{ bodyMetrics && bodyMetrics.leanMassKg !== null ? `${formatMetric(bodyMetrics.leanMassKg)} kg` : '—' }}</strong></div>
                </div>
                <p class="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">El porcentaje de grasa es una estimación antropométrica. No sustituye una medición profesional ni una evaluación médica.</p>
                <p v-if="formError" class="mt-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100" role="alert">{{ formError }}</p>
                <button type="submit" class="mt-5 w-full rounded-2xl bg-lime-300 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-lime-200">Guardar evaluación</button>
              </section>
            </aside>
          </form>
        </div>
      </section>

      <section v-else key="dashboard" class="flex flex-1 items-center justify-center py-12">
        <SkeletonLoader v-if="isViewLoading" :rows="3" />
        <div v-else class="w-full max-w-5xl pb-32">
          <div v-if="activeTab === 'overview' && focusedPanel === 'overview'" class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p class="text-sm font-semibold uppercase tracking-[0.16em] text-lime-300">Resumen de hoy</p><h1 class="mt-3 text-4xl font-black tracking-tight">Hola, {{ firstName }}.</h1><p class="mt-3 text-slate-400">Bienvenido a tu Yim. Avanza con constancia.</p></div><div class="overview-actions"><button type="button" class="overview-action overview-action-primary" @click="openFocusedPanel('checkin')"><span>✦</span><span><strong>Check in</strong><small>Registrar evolución</small></span></button><button type="button" class="overview-action" @click="openScheduleModal"><span>◷</span><span><strong>Horarios y recordatorios</strong><small>Organiza tu día</small></span></button><button type="button" class="overview-action" @click="openPdfModal"><span>↑</span><span><strong>Carga tu PDF de tu profesional</strong><small>Importa tu plan</small></span></button><button type="button" class="overview-action overview-action-sync" @click="openSyncModal"><span>↻</span><span><strong>Sincronización</strong><small>{{ formatLastSync(lastSyncAt) }}</small></span></button></div></div>
          <div v-if="activeTab === 'overview' && focusedPanel === 'overview'" class="grid gap-4 sm:grid-cols-3"><article class="glass-card"><p class="text-xs text-slate-400">Objetivo</p><p class="mt-3 text-base font-bold">{{ profile?.goal || 'Sin definir' }}</p><p class="mt-2 text-xs text-lime-300">Tu objetivo actual</p></article><article class="glass-card"><p class="text-xs text-slate-400">Grasa estimada</p><p class="mt-3 text-xl font-bold">{{ profile?.metrics?.bodyFat ? `${formatMetric(profile.metrics.bodyFat)}%` : '—' }}</p><p class="mt-2 text-xs text-slate-400">Línea base inicial</p></article><article class="glass-card"><p class="text-xs text-slate-400">Peso inicial</p><p class="mt-3 text-xl font-bold">{{ profile?.weightKg ? `${formatMetric(profile.weightKg)} kg` : '—' }}</p><p class="mt-2 text-xs text-slate-400">Registrado hoy</p></article></div>

          <ProgressCheckinView v-if="activeTab === 'overview' && focusedPanel === 'checkin'" :form="progressForm" :records="progressRecords" :error="progressError" :saved="progressSaved" @save="saveProgressCheckin" @back="focusedPanel = 'overview'" />
          <section v-if="activeTab === 'overview' && focusedPanel === 'overview'" :key="`progress-${chartAnimationKey}`" class="tab-section progress-section mt-5 rounded-[2rem] border border-lime-300/15 bg-lime-300/[0.06] p-5 backdrop-blur-xl sm:p-6" aria-labelledby="progress-title">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-lime-300">Progreso</p><h2 id="progress-title" class="mt-2 text-2xl font-black">Tu evolución corporal</h2><p class="mt-2 text-sm text-slate-400">Registra un check-in y observa tendencias, no solo números aislados.</p></div><span class="w-fit rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-100">{{ progressRecords.length }} registro{{ progressRecords.length === 1 ? '' : 's' }}</span></div>
            <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><article class="metric-row"><span>Peso actual</span><strong>{{ latestProgress ? `${formatMetric(latestProgress.weightKg)} kg` : '—' }}</strong></article><article class="metric-row"><span>Cambio desde inicio</span><strong>{{ formatSignedMetric(weightChange, ' kg') }}</strong></article><article class="metric-row"><span>Grasa corporal</span><strong>{{ latestBodyFat !== null ? `${formatMetric(latestBodyFat)}%` : '—' }}</strong></article><article class="metric-row"><span>Cumplimiento medio</span><strong>{{ averageAdherence }}%</strong></article></div>
            <div class="mt-5 grid gap-4 lg:grid-cols-2">
              <article class="progress-chart-card"><div class="flex items-center justify-between gap-3"><div><h3 class="font-bold">Tendencia de peso</h3><p class="mt-1 text-xs text-slate-500">{{ weightChangePercent !== null ? `${formatSignedMetric(weightChangePercent, '%')} vs. línea base` : 'Necesitas más registros' }}</p></div><span class="chart-legend chart-legend-lime"></span></div><div v-if="weightChart.dots.length" class="mt-4"><svg class="progress-chart" viewBox="0 0 280 130" role="img" aria-label="Gráfica de tendencia de peso"><line x1="12" y1="106" x2="268" y2="106" class="chart-axis" /><polyline v-if="weightChart.dots.length > 1" :points="weightChart.polyline" class="chart-line chart-line-lime" fill="none" /><circle v-for="(point, index) in weightChart.dots" :key="`weight-${point.date}`" :cx="point.x" :cy="point.y" r="4" class="chart-dot chart-dot-lime" :style="{ '--dot-delay': `${index * 90 + 420}ms` }"><title>{{ formatDate(point.date) }} · {{ formatMetric(point.value) }} kg</title></circle><circle v-if="weightChart.dots[0]" :cx="weightChart.dots[0].x" :cy="weightChart.dots[0].y" r="8" class="chart-baseline-ring chart-baseline-ring-lime"><title>Línea base · {{ formatMetric(weightChart.dots[0].value) }} kg</title></circle></svg><div class="chart-baseline-caption"><span><i class="chart-baseline-marker chart-baseline-marker-lime"></i>Línea base · {{ formatMetric(weightChart.dots[0].value) }} kg</span><span>{{ formatDate(progressRecords[progressRecords.length - 1].date) }}</span></div></div><p v-else class="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-500">Registra tu primer peso para iniciar la gráfica.</p></article>
              <article class="progress-chart-card"><div class="flex items-center justify-between gap-3"><div><h3 class="font-bold">Tendencia de grasa</h3><p class="mt-1 text-xs text-slate-500">{{ bodyFatChange !== null ? `${formatSignedMetric(bodyFatChange, '%') } vs. línea base` : 'Agrega % de grasa a dos check-ins' }}</p></div><span class="chart-legend chart-legend-sky"></span></div><div v-if="bodyFatChart.dots.length" class="mt-4"><svg class="progress-chart" viewBox="0 0 280 130" role="img" aria-label="Gráfica de tendencia de grasa corporal"><line x1="12" y1="106" x2="268" y2="106" class="chart-axis" /><polyline v-if="bodyFatChart.dots.length > 1" :points="bodyFatChart.polyline" class="chart-line chart-line-sky" fill="none" /><circle v-for="(point, index) in bodyFatChart.dots" :key="`fat-${point.date}`" :cx="point.x" :cy="point.y" r="4" class="chart-dot chart-dot-sky" :style="{ '--dot-delay': `${index * 90 + 420}ms` }"><title>{{ formatDate(point.date) }} · {{ formatMetric(point.value) }}%</title></circle><circle v-if="bodyFatChart.dots[0]" :cx="bodyFatChart.dots[0].x" :cy="bodyFatChart.dots[0].y" r="8" class="chart-baseline-ring chart-baseline-ring-sky"><title>Línea base · {{ formatMetric(bodyFatChart.dots[0].value) }}%</title></circle></svg><div class="chart-baseline-caption"><span><i class="chart-baseline-marker chart-baseline-marker-sky"></i>Línea base · {{ formatMetric(bodyFatChart.dots[0].value) }}%</span><span>{{ formatDate(bodyFatRecords[bodyFatRecords.length - 1].date) }}</span></div></div><p v-else class="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-500">El porcentaje de grasa aparecerá cuando lo captures en tus check-ins.</p></article>
            </div>
            <div class="mt-4 rounded-2xl border border-sky-300/15 bg-sky-300/[0.07] p-4"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-sky-200">Lectura orientativa</p><p class="mt-2 text-sm leading-6 text-slate-300">{{ progressInsight }}</p><p class="mt-3 text-[11px] leading-5 text-slate-500">Masa libre de grasa estimada: {{ latestLeanMass !== null ? `${formatMetric(latestLeanMass)} kg` : "requiere % de grasa" }}. No equivale a masa muscular medida.</p></div>
            <div v-if="progressRecords.length" class="mt-4 overflow-x-auto rounded-2xl border border-white/10"><table class="progress-table"><thead><tr><th>Fecha</th><th>Peso</th><th>Grasa</th><th>Comidas</th><th>Rutina</th><th>Sueño</th></tr></thead><tbody><tr v-for="record in [...progressRecords].reverse().slice(0, 5)" :key="record.id"><td>{{ formatDate(record.date) }}<span v-if="record.source === 'baseline'" class="baseline-tag">Base</span></td><td>{{ formatMetric(record.weightKg) }} kg</td><td>{{ record.bodyFatPercent ? `${formatMetric(record.bodyFatPercent)}%` : '—' }}</td><td>{{ record.nutritionProgress }}%</td><td>{{ record.workoutProgress }}%</td><td>{{ record.sleepDuration ? `${formatMetric(record.sleepDuration)} h` : '—' }}</td></tr></tbody></table></div>
            <p class="mt-4 text-[11px] leading-5 text-slate-500">Las tendencias son orientativas. El peso diario puede variar por hidratación, horario y otros factores; consulta a tus profesionales antes de modificar tu plan.</p>
          </section>
          <section v-if="isFemaleProfile && activeTab === 'overview' && focusedPanel === 'overview'" class="tab-section mt-5 rounded-[2rem] border border-fuchsia-300/15 bg-fuchsia-300/[0.05] p-5 backdrop-blur-xl sm:p-6" aria-labelledby="cycle-title">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-fuchsia-200">Ciclo menstrual</p><h2 id="cycle-title" class="mt-2 text-2xl font-black">Un contexto más para cuidarte</h2><p class="mt-2 text-sm text-slate-400">Registra tus fechas para orientar el seguimiento de energía, descanso y entrenamiento.</p></div><span class="w-fit rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-xs text-fuchsia-100">Privado en este dispositivo</span></div>
            <div v-if="cycleSummary" class="mt-5 grid gap-3 sm:grid-cols-3"><article class="cycle-metric"><span>Día del ciclo</span><strong>Día {{ cycleSummary.cycleDay }}</strong><small>de {{ cycleSummary.cycleLength }} estimados</small></article><article class="cycle-metric"><span>Fase orientativa</span><strong>{{ cycleSummary.phase.label }}</strong><small>{{ cycleSummary.phase.detail }}</small></article><article class="cycle-metric"><span>Próximo periodo estimado</span><strong>{{ formatDate(cycleSummary.expectedNextPeriod) }}</strong><small>Puede variar cada ciclo</small></article></div>
            <div v-if="cycleSummary" class="mt-5 rounded-3xl border border-white/10 bg-slate-950/25 p-4"><div class="flex items-center justify-between gap-3"><div><h3 class="font-bold">Calendario del ciclo</h3><p class="mt-1 text-xs text-slate-500">Inicio registrado: {{ formatDate(cycleData.lastPeriodStart) }}</p></div><span class="rounded-full bg-fuchsia-300/10 px-3 py-1 text-xs text-fuchsia-100">{{ cycleSummary.phase.label }}</span></div><div class="cycle-calendar mt-4"><div v-for="day in cycleCalendar" :key="day.day" class="cycle-day" :class="{ 'cycle-day-period': day.isPeriod, 'cycle-day-fertile': day.isFertileEstimate, 'cycle-day-current': day.isCurrent }"><span>Día</span><strong>{{ day.day }}</strong></div></div><div class="mt-4 flex flex-wrap gap-3 text-[11px] text-slate-400"><span class="cycle-legend"><i class="cycle-dot cycle-dot-period"></i>Periodo registrado</span><span class="cycle-legend"><i class="cycle-dot cycle-dot-fertile"></i>Ventana estimada</span><span class="cycle-legend"><i class="cycle-dot cycle-dot-current"></i>Día actual</span></div></div>
            <div v-else class="mt-5 rounded-3xl border border-fuchsia-300/15 bg-fuchsia-300/[0.07] p-5"><p class="text-sm font-semibold text-fuchsia-100">Configura tu primer registro</p><p class="mt-2 text-sm leading-6 text-slate-300">Cuando indiques el primer día de tu último periodo, mostraremos un calendario estimado para darte contexto, sin cambiar automáticamente tu dieta o rutina.</p></div>
            <div class="mt-5 rounded-3xl border border-white/10 bg-slate-950/25 p-4"><div class="flex items-center justify-between gap-3"><h3 class="font-bold">Configuración del ciclo</h3><span class="text-xs text-slate-500">Tú decides qué registrar</span></div><div class="mt-4 grid gap-3 sm:grid-cols-3"><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Último periodo<input v-model="cycleData.lastPeriodStart" type="date" class="form-input mt-2 text-sm normal-case tracking-normal" /></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Duración del ciclo<input v-model.number="cycleData.cycleLength" type="number" min="21" max="40" class="form-input mt-2 text-sm normal-case tracking-normal" /><small class="mt-1 block normal-case tracking-normal text-slate-500">21–40 días</small></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Duración del periodo<input v-model.number="cycleData.periodLength" type="number" min="2" max="10" class="form-input mt-2 text-sm normal-case tracking-normal" /><small class="mt-1 block normal-case tracking-normal text-slate-500">2–10 días</small></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 sm:col-span-3">Notas, síntomas o energía<textarea v-model="cycleData.notes" rows="2" class="form-input mt-2 resize-none text-sm normal-case tracking-normal" placeholder="Información para comentarla con tu profesional (opcional)"></textarea></label></div><div class="mt-4 flex flex-col gap-3 sm:flex-row"><button class="rounded-2xl bg-fuchsia-200 px-5 py-3 font-bold text-slate-950 transition hover:bg-fuchsia-100" @click="saveCycleSettings">Guardar ciclo</button><button class="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10" @click="clearCycleSettings">Borrar datos del ciclo</button></div><p v-if="cycleError" class="mt-3 text-xs text-rose-200" role="alert">{{ cycleError }}</p><p v-if="cycleSaved" class="mt-3 text-xs text-fuchsia-100" role="status">Configuración del ciclo guardada localmente.</p></div>
            <p class="mt-4 text-[11px] leading-5 text-slate-500">Este calendario es una estimación y no confirma ovulación, fertilidad, embarazo ni diagnósticos. Si tienes dolor intenso, cambios importantes o dudas, consulta a un profesional de salud.</p>
          </section>
          <section v-if="activeTab === 'nutrition'" class="tab-section mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl sm:p-6" aria-labelledby="nutrition-title">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-lime-300">Régimen alimenticio</p><h2 id="nutrition-title" class="mt-2 text-2xl font-black">Lo que toca hoy</h2></div><span class="w-fit rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">Plan de demostración</span></div>
            <div class="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div class="space-y-3">
                <details v-for="meal in dietPlan.meals" :key="meal.id" class="meal-card" :open="meal.id === 'breakfast'">
                  <summary class="flex cursor-pointer list-none items-center justify-between gap-3"><div class="flex items-center gap-3"><span class="grid size-10 place-items-center rounded-2xl bg-lime-300/10 text-lime-300">{{ meal.id === 'breakfast' ? '☀' : meal.id === 'lunch' ? '◒' : '☾' }}</span><div><h3 class="font-bold">{{ meal.name }}</h3><p class="mt-1 text-xs text-slate-400">{{ meal.ingredients.filter((ingredient) => ingredient.completed).length }}/{{ meal.ingredients.length }} ingredientes completados</p></div></div><span class="rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-200">{{ meal.time }}</span></summary>
                  <div class="mt-4 border-t border-white/10 pt-4"><label class="mb-3 flex items-center justify-between gap-3 text-xs text-slate-400">Horario<input v-model="meal.time" type="time" class="time-input" @change="updateMealTime" /></label><p class="mb-3 text-xs leading-5 text-slate-400">{{ meal.note }}</p><label v-for="ingredient in meal.ingredients" :key="ingredient.id" class="ingredient-row"><span class="flex items-center gap-3"><input type="checkbox" :checked="ingredient.completed" class="accent-lime-300" @change="toggleIngredient(meal.id, ingredient.id)" /><span :class="ingredient.completed ? 'text-slate-500 line-through' : 'text-slate-200'">{{ ingredient.name }}</span></span><span class="text-xs text-lime-300">{{ ingredient.quantity }}</span></label></div>
                </details>
                <div class="rounded-2xl border border-white/10 bg-slate-950/25 p-4"><div class="flex items-center justify-between text-sm"><span class="font-semibold">Cumplimiento de comidas</span><strong class="text-lime-300">{{ nutritionProgress }}%</strong></div><div class="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-lime-300 transition-all" :style="{ width: `${nutritionProgress}%` }"></div></div></div>
              </div>

              <div class="space-y-3">
                <section class="sub-panel"><div class="flex items-center justify-between"><h3 class="font-bold">Suplementación</h3><span class="text-xs text-slate-500">{{ completedSupplements }}/{{ dietPlan.supplements.length }}</span></div><label v-for="supplement in dietPlan.supplements" :key="supplement.id" class="ingredient-row"><span class="flex items-center gap-3"><input type="checkbox" :checked="supplement.completed" class="accent-lime-300" @change="toggleSupplement(supplement)" /><span :class="supplement.completed ? 'text-slate-500 line-through' : 'text-slate-200'">{{ supplement.name }}</span></span><span class="max-w-[9rem] text-right text-[11px] text-slate-500">{{ supplement.detail }}</span></label></section>
                <section class="sub-panel"><h3 class="font-bold">Recomendaciones</h3><ul class="mt-3 space-y-2 text-xs leading-5 text-slate-400"><li v-for="recommendation in dietPlan.recommendations" :key="recommendation" class="flex gap-2"><span class="text-lime-300">•</span><span>{{ recommendation }}</span></li></ul></section>
                <section class="sub-panel"><h3 class="font-bold">Grasas permitidas</h3><div class="mt-3 space-y-2"><div v-for="fat in dietPlan.fats" :key="fat.name" class="flex items-center justify-between gap-3 text-xs"><span class="text-slate-300">{{ fat.name }}</span><span class="text-right text-lime-300">{{ fat.detail }}</span></div></div></section>
              </div>
            </div>
          </section>

          <section v-if="activeTab === 'nutrition'" class="tab-section mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl sm:p-6"><div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-lime-300">Catálogo de alimentos</p><h2 class="mt-2 text-2xl font-black">Frecuencias de consumo</h2></div><span class="text-xs text-slate-500">Guía del profesional</span></div><div class="mt-5 grid gap-3 sm:grid-cols-3"><article v-for="food in dietPlan.catalog" :key="food.name" class="catalog-card" :class="`catalog-${food.color}`"><div class="flex items-center gap-2"><span class="size-2 rounded-full" :class="food.color === 'green' ? 'bg-emerald-300' : food.color === 'yellow' ? 'bg-amber-300' : 'bg-rose-300'"></span><h3 class="text-sm font-bold">{{ food.name }}</h3></div><p class="mt-2 text-xs text-slate-400">{{ food.frequency }}</p></article></div></section>

          <section v-if="activeTab === 'routines'" class="tab-section mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl sm:p-6" aria-labelledby="routines-title">
            <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-start"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-lime-300">Rutinas</p><h2 id="routines-title" class="mt-2 text-2xl font-black">Entrenamiento de la semana</h2><p class="mt-2 text-sm text-slate-400">Consulta tu rutina, registra cada serie y guarda el peso utilizado.</p></div><span class="w-fit rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">Plan de demostración</span></div>
            <div class="mt-5 grid gap-3 sm:grid-cols-2"><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Días por semana<select v-model="routinePlan.weekLength" class="form-input mt-2 text-sm normal-case tracking-normal" @change="updateWeekLength"><option :value="6">6 días</option><option :value="7">7 días</option></select></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Día de descanso<select v-model="routinePlan.restDay" class="form-input mt-2 text-sm normal-case tracking-normal" @change="updateRestDay"><option value="none" :disabled="routinePlan.weekLength === 6">Sin día de descanso</option><option v-for="day in dayOptions" :key="day.key" :value="day.key">{{ routinePlan.days[day.key].label }}</option></select></label></div>

            <div class="mt-5 grid grid-cols-7 gap-2"><button v-for="day in dayOptions" :key="day.key" class="day-pill" :class="[selectedDay === day.key ? 'day-pill-active' : '', isRestDay(day.key) ? 'day-pill-rest' : '']" @click="selectedDay = day.key"><span>{{ day.short }}</span><strong>{{ isRestDay(day.key) ? '·' : routinePlan.days[day.key].routineId }}</strong></button></div>

            <div v-if="selectedRoutine && selectedRoutine.exercises.length" class="mt-5 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
              <div class="rounded-3xl border border-lime-300/15 bg-lime-300/10 p-5"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.15em] text-lime-300">{{ selectedRoutine.label }}</p><h3 class="mt-2 text-2xl font-black">Rutina {{ selectedRoutine.routineId }}</h3></div><span class="grid size-11 place-items-center rounded-2xl bg-lime-300/15 text-xl text-lime-300">✦</span></div><p class="mt-5 text-lg font-bold">{{ selectedRoutine.name }}</p><p class="mt-2 text-sm text-slate-300">{{ selectedRoutine.focus }}</p><div class="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-300"><span>Duración estimada</span><strong class="text-lime-300">{{ selectedRoutine.duration }}</strong></div><div class="mt-5"><div class="flex items-center justify-between text-xs"><span>Progreso de sesión</span><strong class="text-lime-300">{{ workoutProgress }}%</strong></div><div class="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-lime-300 transition-all" :style="{ width: `${workoutProgress}%` }"></div></div><p class="mt-3 text-xs text-slate-400">{{ completedSets }}/{{ totalSets }} series completadas</p></div></div>
              <div class="space-y-3"><article v-for="exercise in selectedRoutine.exercises" :key="exercise.id" class="exercise-card"><div class="flex items-start gap-3"><span class="exercise-illustration" aria-hidden="true">{{ exercise.illustration }}</span><div class="min-w-0 flex-1"><div class="flex flex-col justify-between gap-2 sm:flex-row"><div><h3 class="font-bold">{{ exercise.name }}</h3><p class="mt-1 text-xs text-lime-300">{{ exercise.prescription }} · Descanso {{ exercise.rest }}</p></div><label class="flex items-center gap-2 text-xs text-slate-400">Peso (kg)<input v-model="exercise.weight" type="number" min="0" step="0.5" class="weight-input" placeholder="—" @change="updateExerciseWeight" /></label></div><p class="mt-3 text-xs leading-5 text-slate-400">{{ exercise.tip }}</p><div class="mt-4 flex flex-wrap gap-2"><label v-for="setNumber in exercise.sets" :key="setNumber" class="set-chip"><input type="checkbox" :checked="exercise.completedSets.includes(setNumber)" :aria-label="`Serie ${setNumber} de ${exercise.name}`" class="accent-lime-300" @change="toggleSet(exercise.id, setNumber)" /><span>Serie {{ setNumber }}</span></label></div></div></div></article></div>
            </div>
            <div v-else class="mt-5 rounded-3xl border border-sky-300/15 bg-sky-300/10 p-6"><p class="text-xs font-semibold uppercase tracking-[0.15em] text-sky-200">{{ routinePlan.days[selectedDay]?.label }}</p><h3 class="mt-2 text-2xl font-black">Día de descanso</h3><p class="mt-2 max-w-xl text-sm leading-6 text-slate-300">Usa este día para recuperar, dormir bien y mantener las comidas de tu plan. Si necesitas ajustar la carga, consúltalo con tu instructor.</p></div>
          </section>

          <section v-if="activeTab === 'overview' && focusedPanel === 'schedule'" class="modal-panel schedule-modal" role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-lime-300">Horarios y recordatorios</p><h2 id="schedule-modal-title" class="mt-2 text-2xl font-black">Dale estructura a tu día</h2><p class="mt-2 text-sm text-slate-400">Configura tus momentos clave y decide qué avisos quieres recibir.</p></div><div class="schedule-header-tools"><span class="w-fit rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">Configuración local</span><button ref="scheduleCloseButton" type="button" class="modal-close-button modal-close-danger" aria-label="Cerrar horarios y recordatorios" @click="closeScheduleModal">×</button></div></div>
            <div class="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Entrenamiento<input v-model="schedule.trainingTime" type="time" class="form-input mt-2 text-sm normal-case tracking-normal" /></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Hora de dormir<input v-model="schedule.sleepTime" type="time" class="form-input mt-2 text-sm normal-case tracking-normal" /></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Hora de despertar<input v-model="schedule.wakeTime" type="time" class="form-input mt-2 text-sm normal-case tracking-normal" /></label></div>
              <div><div class="grid gap-2 sm:grid-cols-2"><label class="reminder-row"><span><strong>Comidas</strong><small>Desayuno, comida y cena</small></span><input v-model="schedule.reminders.meals" type="checkbox" class="toggle-input" /></label><label class="reminder-row"><span><strong>Entrenamiento</strong><small>Aviso de tu sesión</small></span><input v-model="schedule.reminders.training" type="checkbox" class="toggle-input" /></label><label class="reminder-row"><span><strong>Suplementos</strong><small>Recordatorio diario</small></span><input v-model="schedule.reminders.supplements" type="checkbox" class="toggle-input" /></label><label class="reminder-row"><span><strong>Descanso</strong><small>Prepararte para dormir</small></span><input v-model="schedule.reminders.sleep" type="checkbox" class="toggle-input" /></label></div><div class="mt-4 flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/25 p-4 sm:flex-row sm:items-center"><div><p class="text-sm font-semibold">Próximos avisos</p><div class="mt-2 flex flex-wrap gap-2"><span v-for="event in upcomingEvents" :key="event.key" class="event-chip">{{ event.time }} · {{ event.label }}</span><span v-if="!upcomingEvents.length" class="text-xs text-slate-500">No hay avisos activos.</span></div></div><button class="rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-bold text-slate-950" @click="saveSchedulePreferences">Guardar horarios</button></div><p v-if="scheduleSaved" class="mt-3 text-xs text-lime-300" role="status">Preferencias guardadas en este dispositivo.</p></div>
            </div>
            <p class="mt-4 text-[11px] text-slate-500">La integración con notificaciones nativas de Android e iOS se conectará mediante Capacitor.</p>
          </section>

          <section v-if="activeTab === 'rest'" class="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl sm:p-6">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-lime-300">Sueño y recuperación</p><h2 class="mt-2 text-2xl font-black">¿Cómo descansaste?</h2><p class="mt-2 text-sm text-slate-400">Registra el descanso de hoy para relacionarlo con tu entrenamiento y tu energía.</p></div><span class="w-fit rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">Registro manual</span></div>
            <div class="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div class="grid gap-4 sm:grid-cols-2"><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Me dormí a las<input v-model="sleepLog.bedtime" type="time" class="form-input mt-2 text-sm normal-case tracking-normal" /></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Desperté a las<input v-model="sleepLog.wakeTime" type="time" class="form-input mt-2 text-sm normal-case tracking-normal" /></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Interrupciones<input v-model.number="sleepLog.interruptions" type="number" min="0" max="20" class="form-input mt-2 text-sm normal-case tracking-normal" /></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Calidad del sueño<select v-model.number="sleepLog.quality" class="form-input mt-2 text-sm normal-case tracking-normal"><option :value="1">1 · Muy mala</option><option :value="2">2 · Mala</option><option :value="3">3 · Regular</option><option :value="4">4 · Buena</option><option :value="5">5 · Excelente</option></select></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 sm:col-span-2">Energía al despertar<select v-model.number="sleepLog.energy" class="form-input mt-2 text-sm normal-case tracking-normal"><option :value="1">1 · Muy baja</option><option :value="2">2 · Baja</option><option :value="3">3 · Normal</option><option :value="4">4 · Alta</option><option :value="5">5 · Excelente</option></select></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 sm:col-span-2">Notas<textarea v-model="sleepLog.notes" rows="2" class="form-input mt-2 resize-none text-sm normal-case tracking-normal" placeholder="¿Cómo te sentiste hoy?"></textarea></label></div>
              <div class="flex flex-col justify-between rounded-3xl border border-sky-300/15 bg-sky-300/10 p-5"><div><p class="text-xs font-semibold uppercase tracking-[0.15em] text-sky-200">Resumen de recuperación</p><div class="mt-4 flex items-end gap-2"><strong class="text-4xl font-black text-white">{{ sleepDuration !== null ? formatMetric(sleepDuration) : '—' }}</strong><span class="pb-1 text-sm text-sky-100">horas dormidas</span></div><div class="mt-4 space-y-3 text-sm"><div class="flex justify-between gap-3"><span class="text-slate-300">Estado orientativo</span><strong class="text-lime-200">{{ recoveryLabel }}</strong></div><div class="flex justify-between gap-3"><span class="text-slate-300">Interrupciones</span><strong class="text-white">{{ sleepLog.interruptions }}</strong></div></div></div><div><button class="mt-6 w-full rounded-2xl bg-lime-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-lime-200" @click="saveSleepLog">Guardar descanso</button><p v-if="sleepSaved" class="mt-3 text-center text-xs text-lime-200" role="status">Registro guardado en este dispositivo.</p></div></div>
            </div>
            <p class="mt-4 text-[11px] text-slate-500">Este indicador es orientativo y no diagnostica problemas de sueño. Más adelante podremos sincronizar datos de salud o dispositivos compatibles.</p>
          </section>

          <section v-if="pdfModalOpen" class="modal-panel mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="pdf-modal-title">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-lime-300">Documentos del plan</p><h2 id="pdf-modal-title" class="mt-2 text-2xl font-black">Carga el PDF de tu profesional</h2><p class="mt-2 text-sm text-slate-400">La app lo preparará para organizar dieta, rutinas y recomendaciones.</p></div><div class="modal-header-tools"><span class="provider-status-chip">{{ aiProvider.providerName }} · {{ providerStatusLabel }}</span><button ref="pdfCloseButton" type="button" class="modal-close-button modal-close-danger" aria-label="Cerrar carga de PDF" @click="closePdfModal">×</button></div></div>
            <div class="provider-inline-status mt-5"><div><p class="text-sm font-semibold">Proveedor de análisis</p><p class="mt-1 text-xs text-slate-400">{{ aiProvider.endpoint }} · {{ aiProvider.model }}</p><p class="mt-1 text-xs text-slate-500">La clave se configura únicamente en el backend seguro.</p></div><button type="button" class="provider-link-button" @click="openProviderModal">Configurar proveedor IA</button></div>
            <div class="mt-5 rounded-3xl border border-dashed border-white/20 bg-slate-950/20 p-5"><label for="plan-pdf" class="flex cursor-pointer flex-col items-center justify-center text-center"><span class="grid size-12 place-items-center rounded-2xl bg-violet-300/15 text-xl text-violet-200">↑</span><span class="mt-3 text-sm font-semibold">Seleccionar archivo PDF</span><span class="mt-1 text-xs text-slate-500">Máximo {{ aiProvider.maxFileSizeMb }} MB · Puede ser texto o imagen escaneada</span><input id="plan-pdf" type="file" accept="application/pdf,.pdf" class="sr-only" @change="handleDocumentUpload" /></label></div>
            <p v-if="documentError" class="mt-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100" role="alert">{{ documentError }}</p>
            <div v-if="documentState === 'processing'" class="mt-4 flex items-center gap-3 rounded-2xl border border-violet-300/15 bg-violet-300/10 p-4"><span class="grid size-9 animate-pulse place-items-center rounded-xl bg-violet-300/15 text-violet-200">◌</span><div><p class="text-sm font-semibold">Procesando documento...</p><p class="mt-1 text-xs text-slate-400">{{ uploadedDocument?.name }} · {{ formatFileSize(uploadedDocument?.size) }}</p><p class="mt-1 text-xs text-slate-400">Detectando texto, tablas e imágenes para preparar la revisión.</p><div class="document-progress-track"><div class="document-progress-bar" :style="{ width: `${documentProgress}%` }"></div></div><p class="mt-2 text-xs text-violet-100">{{ documentProgress }}% · Procesando</p></div></div>
            <div v-else-if="documentState === 'review' && extractedReview" class="mt-4 rounded-3xl border border-amber-300/15 bg-amber-300/10 p-5"><div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p class="text-xs font-semibold uppercase tracking-[0.15em] text-amber-200">Revisión necesaria</p><h3 class="mt-2 text-lg font-bold">{{ extractedReview.documentName }}</h3><p class="mt-1 text-xs text-amber-100/70">{{ extractedReview.ocrRequired ? 'El documento puede requerir OCR porque contiene páginas como imagen.' : 'Texto digital detectado.' }}</p></div><span class="rounded-xl bg-amber-300/15 px-3 py-2 text-xs text-amber-100">Antes de importar</span></div><div class="mt-5 space-y-3"><div v-for="field in extractedReview.fields" :key="`${field.section}-${field.label}`" class="review-field"><div class="min-w-0 flex-1"><p class="text-[11px] uppercase tracking-[0.1em] text-slate-500">{{ field.section }}</p><p class="mt-1 text-sm font-semibold text-slate-200">{{ field.label }}</p><input v-model="field.value" class="review-input" :aria-label="field.label" /></div><span class="confidence-badge" :class="`confidence-${field.confidence.toLowerCase()}`">{{ field.confidence }}</span></div></div><div class="mt-5 flex flex-col gap-3 sm:flex-row"><button class="rounded-2xl bg-lime-300 px-5 py-3 font-bold text-slate-950" @click="approveDocumentReview">Aprobar revisión</button><button class="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white" @click="discardDocument">Descartar</button></div></div>
            <div v-else-if="documentState === 'approved' && extractedReview" class="mt-4 flex flex-col justify-between gap-4 rounded-3xl border border-lime-300/15 bg-lime-300/10 p-5 sm:flex-row sm:items-center"><div><p class="text-xs font-semibold uppercase tracking-[0.15em] text-lime-200">Revisión aprobada</p><h3 class="mt-2 font-bold">{{ extractedReview.documentName }}</h3><p class="mt-1 text-xs text-slate-400">El documento quedó registrado como referencia local.</p></div><button class="rounded-2xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white" @click="discardDocument">Cambiar PDF</button></div>
            <p class="mt-4 text-[11px] text-slate-500">Prototipo de revisión: el proveedor OCR/IA real se conectará mediante un servicio seguro y los datos no se incorporarán al plan activo sin tu aprobación.</p>
          </section>

          <section v-if="providerModalOpen" class="modal-panel provider-modal" role="dialog" aria-modal="true" aria-labelledby="provider-modal-title">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-lime-300">Integración OCR + IA</p><h2 id="provider-modal-title" class="mt-2 text-2xl font-black">Configura tu proveedor</h2><p class="mt-2 text-sm text-slate-400">Define el endpoint y el modelo que utilizará el backend para analizar tus documentos.</p></div><button ref="providerCloseButton" type="button" class="modal-close-button modal-close-danger" aria-label="Cerrar configuración de IA" @click="closeProviderModal">×</button></div>
            <div class="provider-safety-note mt-5"><span class="provider-safety-icon" aria-hidden="true">⌁</span><div><p class="text-sm font-semibold">La API key no se captura aquí</p><p class="mt-1 text-xs leading-5 text-slate-400">Guárdala como secreto del backend, por ejemplo <code>OPENAI_API_KEY</code>. Nunca la expongas en Vue, PWA, Android, iOS ni en el repositorio.</p></div></div>
            <div class="mt-5 grid gap-4 sm:grid-cols-2"><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Proveedor<input v-model="providerForm.providerName" class="form-input mt-2 text-sm normal-case tracking-normal" autocomplete="off" /></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Modelo<input v-model="providerForm.model" class="form-input mt-2 text-sm normal-case tracking-normal" autocomplete="off" placeholder="gpt-5" /></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 sm:col-span-2">Endpoint HTTPS<input v-model="providerForm.endpoint" class="form-input mt-2 text-sm normal-case tracking-normal" autocomplete="url" placeholder="https://api.openai.com/v1/responses" /></label><label class="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Límite por PDF (MB)<input v-model.number="providerForm.maxFileSizeMb" type="number" min="1" max="50" class="form-input mt-2 text-sm normal-case tracking-normal" /></label><div class="provider-readonly-field"><span>Formato aceptado</span><strong>PDF · texto o escaneado</strong></div></div>
            <p v-if="providerError" class="mt-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100" role="alert">{{ providerError }}</p><p v-if="providerMessage" class="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-100" role="status">{{ providerMessage }}</p>
            <div class="mt-5 flex flex-col gap-3 sm:flex-row"><button type="button" class="rounded-2xl bg-lime-300 px-5 py-3 font-bold text-slate-950" @click="saveProviderConfiguration">Guardar configuración</button><button type="button" class="provider-test-button" :disabled="providerTesting" @click="testProviderConfiguration"><span v-if="providerTesting" class="modal-spinner" aria-hidden="true"></span>{{ providerTesting ? 'Probando...' : 'Probar configuración' }}</button></div>
            <div class="provider-status-footer mt-5"><span class="sync-dot" :class="aiProvider.status === 'saved-local' ? 'provider-status-ok' : 'provider-status-warn'"></span><span>Estado: {{ providerStatusLabel }}</span><span v-if="aiProvider.updatedAt">· {{ formatLastSync(aiProvider.updatedAt) }}</span></div>
            <p class="mt-4 text-[11px] text-slate-500">En este incremento la prueba es local y segura. La conexión HTTP real, la autenticación y el adaptador de respuestas se habilitarán al agregar el backend.</p>
          </section>

          <section v-if="syncModalOpen" class="modal-panel mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="sync-modal-title">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p class="text-sm font-semibold uppercase tracking-[0.15em] text-lime-300">Sincronización</p><h2 id="sync-modal-title" class="mt-2 text-2xl font-black">Tus datos están protegidos localmente</h2><p class="mt-2 text-sm text-slate-400">Los cambios se guardan primero en el dispositivo y quedan listos para sincronizarse.</p></div><div class="modal-header-tools"><span class="sync-badge" :class="isOnline ? 'sync-online' : 'sync-offline'"><span class="sync-dot"></span>{{ isOnline ? 'Online' : 'Offline' }}</span><button ref="syncCloseButton" type="button" class="modal-close-button modal-close-danger" aria-label="Cerrar sincronización" @click="closeSyncModal">×</button></div></div>
            <div class="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/25 p-4 sm:flex-row sm:items-center"><div><p class="text-sm font-semibold">Cambios pendientes</p><p class="mt-1 text-3xl font-black text-lime-300">{{ pendingSyncCount }}</p><p class="mt-1 text-xs text-slate-500">{{ pendingSyncCount ? 'Se enviarán cuando haya conexión.' : 'Todo está al día en este prototipo.' }}</p></div><button class="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50" :disabled="syncState === 'syncing'" @click="syncNow"><span v-if="syncState === 'syncing'" class="modal-spinner modal-spinner-dark" aria-hidden="true"></span>{{ syncState === 'syncing' ? 'Sincronizando...' : 'Sincronizar ahora' }}</button></div>
            <p v-if="syncMessage" class="mt-3 text-xs text-slate-300" role="status">{{ syncMessage }}</p>
            <p class="mt-4 text-[11px] text-slate-500">La confirmación de servidor será conectada en una fase posterior; por ahora la cola y su estado se prueban localmente.</p>
          </section>

          <div v-if="activeTab === 'overview' && focusedPanel === 'overview'" class="mt-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"><p class="text-sm font-semibold">Evaluación guardada</p><p class="mt-2 max-w-xl text-sm leading-6 text-slate-400">Tu línea base ya está lista. Podrás actualizar tus medidas después y comparar tu evolución.</p><button class="mt-5 rounded-2xl bg-lime-300 px-5 py-3 font-bold text-slate-950" @click="openView('evaluation')">Actualizar evaluación</button></div>
          <nav v-if="(focusedPanel === 'overview' || activeTab !== 'overview') && !pdfModalOpen && !syncModalOpen && !providerModalOpen" class="tab-bar" aria-label="Secciones principales">
            <button v-for="tab in tabs" :key="tab.key" type="button" class="tab-bar-item" :class="{ 'tab-bar-item-active': activeTab === tab.key }" :aria-current="activeTab === tab.key ? 'page' : undefined" @click="selectTab(tab.key)">
              <span class="tab-bar-icon" aria-hidden="true">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </div>
      </section>
      </Transition>

      <footer class="flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Diseñada para acompañarte, no para reemplazar a tus profesionales.</span><span>Web · PWA · Android · iOS</span></footer>
    </div>
  </main>
</template>
