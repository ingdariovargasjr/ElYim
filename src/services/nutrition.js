const DIET_KEY = 'gymapp.prototype.diet'
import { queueSyncOperation } from './sync'

const demoDiet = {
  isDemo: true,
  meals: [
    {
      id: 'breakfast',
      name: 'Desayuno',
      time: '08:00',
      note: 'Inicia el día con calma y respeta las porciones indicadas.',
      ingredients: [
        { id: 'eggs', name: 'Huevo entero', quantity: '3 piezas', completed: false },
        { id: 'tortillas', name: 'Tortillas de maíz', quantity: '2 piezas', completed: false },
        { id: 'fruit', name: 'Fruta de temporada', quantity: '1 porción', completed: false },
      ],
    },
    {
      id: 'lunch',
      name: 'Comida',
      time: '14:00',
      note: 'Combina proteína, carbohidrato y vegetales según tu plan.',
      ingredients: [
        { id: 'chicken', name: 'Pechuga de pollo', quantity: '150 g', completed: false },
        { id: 'rice', name: 'Arroz cocido', quantity: '1 taza', completed: false },
        { id: 'vegetables', name: 'Verduras', quantity: '2 tazas', completed: false },
      ],
    },
    {
      id: 'dinner',
      name: 'Cena',
      time: '20:00',
      note: 'Mantén la cena dentro del horario que configuraste.',
      ingredients: [
        { id: 'fish', name: 'Pescado blanco', quantity: '150 g', completed: false },
        { id: 'salad', name: 'Ensalada verde', quantity: '2 tazas', completed: false },
        { id: 'avocado', name: 'Aguacate', quantity: '¼ pieza', completed: false },
      ],
    },
  ],
  supplements: [
    { id: 'multivitamin', name: 'Multivitamínico', detail: 'Según indicación profesional', completed: false },
    { id: 'omega3', name: 'Omega 3', detail: 'Según indicación profesional', completed: false },
    { id: 'creatine', name: 'Creatina', detail: 'Según indicación profesional', completed: false },
  ],
  recommendations: [
    'Toma agua durante el día y respeta las cantidades de tu plan.',
    'Procura mantener horarios consistentes para tus comidas.',
    'Registra cualquier cambio o reacción para comentarlo con tu profesional.',
  ],
  fats: [
    { name: 'Aceite en spray', detail: '5 disparos de 1 segundo' },
    { name: 'Aguacate', detail: 'Usar únicamente la porción indicada' },
  ],
  catalog: [
    { name: 'Verduras verdes', frequency: 'Libre', color: 'green' },
    { name: 'Fruta de temporada', frequency: '2–3 veces por semana', color: 'yellow' },
    { name: 'Alimentos altos en azúcar', frequency: '1–2 veces por semana, sin exceder cantidades', color: 'red' },
  ],
}

function cloneDemoDiet() {
  return JSON.parse(JSON.stringify(demoDiet))
}

export function getDefaultDiet() { return cloneDemoDiet() }

export function getStoredDiet() {
  try {
    return JSON.parse(localStorage.getItem(DIET_KEY) || 'null')
  } catch {
    return null
  }
}

export function saveDiet(diet) {
  localStorage.setItem(DIET_KEY, JSON.stringify(diet))
  queueSyncOperation('nutrition')
  return diet
}
