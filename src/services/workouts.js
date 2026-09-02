const WORKOUT_KEY = 'gymapp.prototype.workouts'
import { queueSyncOperation } from './sync'

const defaultWorkouts = {
  isDemo: true,
  weekLength: 6,
  restDay: 'sunday',
  days: {
    monday: { label: 'Lunes', routineId: 'A', name: 'Tren superior', focus: 'Pecho, hombros y tríceps', duration: '45 min', exercises: [
      { id: 'bench-press', name: 'Press de banca', illustration: '▰', prescription: '4 series × 10 repeticiones', sets: 4, reps: 10, rest: '90 s', tip: 'Mantén los hombros estables y controla el descenso.', completedSets: [], weight: '' },
      { id: 'shoulder-press', name: 'Press de hombro', illustration: '▲', prescription: '3 series × 12 repeticiones', sets: 3, reps: 12, rest: '75 s', tip: 'Evita arquear la espalda durante el movimiento.', completedSets: [], weight: '' },
      { id: 'triceps-rope', name: 'Extensión de tríceps', illustration: '↘', prescription: '3 series × 12 repeticiones', sets: 3, reps: 12, rest: '60 s', tip: 'Mantén los codos cerca del cuerpo.', completedSets: [], weight: '' },
    ] },
    tuesday: { label: 'Martes', routineId: 'B', name: 'Tren inferior', focus: 'Pierna y glúteo', duration: '50 min', exercises: [
      { id: 'squat', name: 'Sentadilla', illustration: '●', prescription: '4 series × 8 repeticiones', sets: 4, reps: 8, rest: '120 s', tip: 'Baja con control y mantén las rodillas alineadas.', completedSets: [], weight: '' },
      { id: 'romanian-deadlift', name: 'Peso muerto rumano', illustration: '◆', prescription: '3 series × 10 repeticiones', sets: 3, reps: 10, rest: '90 s', tip: 'Lleva la cadera hacia atrás y conserva la espalda neutra.', completedSets: [], weight: '' },
      { id: 'leg-extension', name: 'Extensión de pierna', illustration: '◒', prescription: '3 series × 12 repeticiones', sets: 3, reps: 12, rest: '60 s', tip: 'Pausa brevemente al extender la pierna.', completedSets: [], weight: '' },
    ] },
    wednesday: { label: 'Miércoles', routineId: 'C', name: 'Acondicionamiento', focus: 'Cardio y core', duration: '35 min', exercises: [
      { id: 'incline-walk', name: 'Caminata inclinada', illustration: '↗', prescription: '20 minutos', sets: 1, reps: '20 min', rest: '—', tip: 'Mantén un ritmo que puedas sostener con buena postura.', completedSets: [], weight: '' },
      { id: 'plank', name: 'Plancha', illustration: '▬', prescription: '3 series × 40 segundos', sets: 3, reps: '40 s', rest: '45 s', tip: 'Activa abdomen y glúteos sin colapsar la espalda.', completedSets: [], weight: '' },
      { id: 'dead-bug', name: 'Dead bug', illustration: '✦', prescription: '3 series × 10 repeticiones', sets: 3, reps: 10, rest: '45 s', tip: 'Mueve las extremidades sin despegar la zona lumbar.', completedSets: [], weight: '' },
    ] },
    thursday: { label: 'Jueves', routineId: 'A', name: 'Tren superior', focus: 'Espalda y bíceps', duration: '45 min', exercises: [
      { id: 'lat-pulldown', name: 'Jalón al pecho', illustration: '↓', prescription: '4 series × 10 repeticiones', sets: 4, reps: 10, rest: '90 s', tip: 'Inicia el jalón desde la espalda, no desde los brazos.', completedSets: [], weight: '' },
      { id: 'row', name: 'Remo sentado', illustration: '⇐', prescription: '3 series × 12 repeticiones', sets: 3, reps: 12, rest: '75 s', tip: 'Junta las escápulas al final de cada repetición.', completedSets: [], weight: '' },
      { id: 'biceps-curl', name: 'Curl de bíceps', illustration: '∩', prescription: '3 series × 12 repeticiones', sets: 3, reps: 12, rest: '60 s', tip: 'Evita balancear el torso para subir el peso.', completedSets: [], weight: '' },
    ] },
    friday: { label: 'Viernes', routineId: 'B', name: 'Tren inferior', focus: 'Pierna posterior y glúteo', duration: '50 min', exercises: [
      { id: 'hip-thrust', name: 'Hip thrust', illustration: '⬆', prescription: '4 series × 10 repeticiones', sets: 4, reps: 10, rest: '90 s', tip: 'Aprieta glúteos arriba sin hiperextender la espalda.', completedSets: [], weight: '' },
      { id: 'leg-curl', name: 'Curl femoral', illustration: '◓', prescription: '3 series × 12 repeticiones', sets: 3, reps: 12, rest: '60 s', tip: 'Controla el regreso a la posición inicial.', completedSets: [], weight: '' },
      { id: 'calf-raise', name: 'Elevación de pantorrilla', illustration: '↥', prescription: '3 series × 15 repeticiones', sets: 3, reps: 15, rest: '45 s', tip: 'Completa el rango de movimiento sin rebotar.', completedSets: [], weight: '' },
    ] },
    saturday: { label: 'Sábado', routineId: 'C', name: 'Acondicionamiento', focus: 'Movilidad y cardio suave', duration: '30 min', exercises: [
      { id: 'bike', name: 'Bicicleta estática', illustration: '◉', prescription: '20 minutos', sets: 1, reps: '20 min', rest: '—', tip: 'Ajusta el asiento y conserva una cadencia cómoda.', completedSets: [], weight: '' },
      { id: 'mobility', name: 'Movilidad de cadera', illustration: '◇', prescription: '3 series × 8 repeticiones', sets: 3, reps: 8, rest: '30 s', tip: 'Realiza el movimiento lentamente y sin dolor.', completedSets: [], weight: '' },
    ] },
    sunday: { label: 'Domingo', routineId: null, name: 'Descanso', focus: 'Recuperación', duration: '—', exercises: [] },
  },
}

function cloneDefault() { return JSON.parse(JSON.stringify(defaultWorkouts)) }
export function getDefaultWorkouts() { return cloneDefault() }

export function getStoredWorkouts() {
  try { return JSON.parse(localStorage.getItem(WORKOUT_KEY) || 'null') } catch { return null }
}

export function saveWorkouts(workouts) {
  localStorage.setItem(WORKOUT_KEY, JSON.stringify(workouts))
  queueSyncOperation('workouts')
  return workouts
}
