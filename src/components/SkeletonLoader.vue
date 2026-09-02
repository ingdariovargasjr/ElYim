<script setup>
defineProps({
  rows: { type: Number, default: 3 },
})
</script>

<template>
  <div class="skeleton-stack" aria-label="Cargando contenido" aria-busy="true">
    <div class="skeleton-hero"><span class="skeleton-line skeleton-line-short"></span><span class="skeleton-line skeleton-line-title"></span><span class="skeleton-line skeleton-line-body"></span></div>
    <div class="skeleton-grid"><div v-for="row in rows" :key="row" class="skeleton-card"><span class="skeleton-circle"></span><span class="skeleton-line skeleton-line-card-title"></span><span class="skeleton-line skeleton-line-card-body"></span></div></div>
    <div class="skeleton-large"><span class="skeleton-line skeleton-line-short"></span><span class="skeleton-line skeleton-line-title"></span><span class="skeleton-line skeleton-line-body"></span><span class="skeleton-line skeleton-line-body"></span></div>
  </div>
</template>

