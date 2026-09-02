const CM_PER_INCH = 2.54

function toInches(value) {
  return Number(value) / CM_PER_INCH
}

function log10(value) {
  return Math.log(value) / Math.LN10
}

export function calculateBodyMetrics({ sex, heightCm, weightKg, age, waistCm, hipCm, neckCm }) {
  const height = Number(heightCm)
  const weight = Number(weightKg)
  const ageNumber = Number(age)
  const waist = Number(waistCm)
  const hip = Number(hipCm)
  const neck = Number(neckCm)

  if (![height, weight].every((value) => Number.isFinite(value) && value > 0)) return null

  const bmi = weight / ((height / 100) ** 2)
  let bodyFat = null

  if (Number.isFinite(waist) && Number.isFinite(neck) && waist > neck && neck > 0) {
    const heightIn = toInches(height)
    const waistIn = toInches(waist)
    const neckIn = toInches(neck)

    if (sex === 'male' && heightIn > 0) {
      bodyFat = 495 / (1.0324 - 0.19077 * log10(waistIn - neckIn) + 0.15456 * log10(heightIn)) - 450
    }

    if (sex === 'female' && Number.isFinite(hip) && hip > 0 && heightIn > 0) {
      bodyFat = 495 / (1.29579 - 0.35004 * log10(waistIn + toInches(hip) - neckIn) + 0.221 * log10(heightIn)) - 450
    }
  }

  const normalizedBodyFat = Number.isFinite(bodyFat) ? Math.min(70, Math.max(1, bodyFat)) : null
  const fatMassKg = normalizedBodyFat === null ? null : weight * (normalizedBodyFat / 100)

  return {
    bmi,
    bodyFat: normalizedBodyFat,
    fatMassKg,
    leanMassKg: fatMassKg === null ? null : weight - fatMassKg,
    ageIncludedInProfile: Number.isFinite(ageNumber) && ageNumber > 0,
  }
}

