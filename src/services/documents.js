const DOCUMENT_KEY = 'gymapp.prototype.document'
import { queueSyncOperation } from './sync'

export async function analyzeDocumentPrototype(file) {
  await new Promise((resolve) => setTimeout(resolve, 450))

  return {
    documentName: file.name,
    sourceType: 'PDF',
    ocrRequired: true,
    fields: [
      { section: 'Régimen alimenticio', label: 'Comidas encontradas', value: 'Desayuno, comida y cena', confidence: 'Alta' },
      { section: 'Régimen alimenticio', label: 'Ingredientes y cantidades', value: 'Requiere revisión de cantidades', confidence: 'Media' },
      { section: 'Rutinas', label: 'Rutinas detectadas', value: 'Rutina A, B y C', confidence: 'Media' },
      { section: 'Suplementación', label: 'Suplementos encontrados', value: 'Requiere confirmación', confidence: 'Baja' },
      { section: 'Recomendaciones', label: 'Instrucciones', value: 'Texto pendiente de confirmar', confidence: 'Baja' },
    ],
  }
}

export function getStoredDocument() {
  try { return JSON.parse(localStorage.getItem(DOCUMENT_KEY) || 'null') } catch { return null }
}

export function saveDocumentReview(review) {
  localStorage.setItem(DOCUMENT_KEY, JSON.stringify({ ...review, approvedAt: new Date().toISOString() }))
  queueSyncOperation('document')
  return review
}

export function discardDocumentReview() {
  localStorage.removeItem(DOCUMENT_KEY)
}
