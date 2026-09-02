<script setup>
defineProps({
  form: { type: Object, required: true },
  records: { type: Array, default: () => [] },
  error: { type: String, default: '' },
  saved: { type: Boolean, default: false },
})

defineEmits(['save', 'back'])

function formatMetric(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : '—'
}

function formatDate(date) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`))
}
</script>

<template>
  <section class="focused-panel tab-section" aria-labelledby="checkin-title">
    <div class="focused-panel-header">
      <div>
        <p class="eyebrow-label">Check in</p>
        <h2 id="checkin-title" class="mt-2 text-2xl font-black">Registra cómo vas hoy</h2>
        <p class="mt-2 text-sm text-slate-400">Guarda tu peso, medidas y el contexto del día para alimentar tus tendencias.</p>
      </div>
      <button type="button" class="back-button" @click="$emit('back')">← Volver a Overview</button>
    </div>

    <div class="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="focused-form-card">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="field-label">Fecha<input v-model="form.date" type="date" class="form-input mt-2 text-sm normal-case tracking-normal" /></label>
          <label class="field-label">Peso (kg)<input v-model="form.weightKg" type="number" min="0" step="0.1" class="form-input mt-2 text-sm normal-case tracking-normal" placeholder="78" /></label>
          <label class="field-label">Grasa corporal %<input v-model="form.bodyFatPercent" type="number" min="0" max="99.9" step="0.1" class="form-input mt-2 text-sm normal-case tracking-normal" placeholder="Opcional" /></label>
          <label class="field-label">Cintura (cm)<input v-model="form.waistCm" type="number" min="0" step="0.1" class="form-input mt-2 text-sm normal-case tracking-normal" placeholder="Opcional" /></label>
          <label class="field-label">Cadera (cm)<input v-model="form.hipCm" type="number" min="0" step="0.1" class="form-input mt-2 text-sm normal-case tracking-normal" placeholder="Opcional" /></label>
          <label class="reminder-row sm:mt-8"><span><strong>Comida trampa</strong><small>Contexto del día</small></span><input v-model="form.cheatMeal" type="checkbox" class="toggle-input" /></label>
          <label class="field-label sm:col-span-2">Ejercicio adicional<input v-model="form.extraExercise" type="text" class="form-input mt-2 text-sm normal-case tracking-normal" placeholder="Caminata, deporte, etc. (opcional)" /></label>
          <label class="field-label sm:col-span-2">Notas<textarea v-model="form.notes" rows="3" class="form-input mt-2 resize-none text-sm normal-case tracking-normal" placeholder="Energía, sensaciones o contexto (opcional)"></textarea></label>
        </div>
        <button type="button" class="mt-4 w-full rounded-2xl bg-lime-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-lime-200" @click="$emit('save')">Guardar check-in</button>
        <p v-if="error" class="mt-3 text-xs text-rose-200" role="alert">{{ error }}</p>
        <p v-if="saved" class="mt-3 text-center text-xs text-lime-200" role="status">Check-in guardado localmente y listo para sincronizar.</p>
      </div>

      <aside class="focused-side-card">
        <p class="eyebrow-label text-sky-200">Registros recientes</p>
        <p class="mt-2 text-sm leading-6 text-slate-300">Las mediciones se comparan contra tu línea base, no contra un solo día.</p>
        <div v-if="records.length" class="mt-4 space-y-2">
          <div v-for="record in [...records].reverse().slice(0, 5)" :key="record.id" class="recent-record">
            <span>{{ formatDate(record.date) }}<small v-if="record.source === 'baseline'">Línea base</small></span>
            <strong>{{ formatMetric(record.weightKg) }} kg</strong>
          </div>
        </div>
        <p v-else class="mt-4 text-xs text-slate-500">Todavía no hay registros.</p>
      </aside>
    </div>
  </section>
</template>
