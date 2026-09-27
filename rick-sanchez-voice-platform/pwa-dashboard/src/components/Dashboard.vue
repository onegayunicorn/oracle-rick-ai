<template>
  <div class="dashboard">
    <h2>System Status</h2>
    <div class="cards">
      <div class="card">
        <h3>Orchestrator</h3>
        <span class="dot" :class="{ok:status.status==='ok'}"></span>
        {{ status.status || 'checking...' }}
      </div>
      <div class="card">
        <h3>Fish TTS</h3>
        <span class="dot" :class="{ok:status.fish_available}"></span>
        {{ status.fish_available ? 'Connected' : 'Unavailable' }}
      </div>
      <div class="card">
        <h3>Default Model</h3>
        <span>{{ status.default_model }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { health } from '../api'

const status = ref({})
onMounted(async () => { status.value = await health() })
</script>

<style scoped>
.dashboard h2 { margin-bottom: 1rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 1rem; }
.card { background: #1e293b; padding: 1.25rem; border-radius: 10px; }
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ef4444; margin-right: 0.5rem; }
.dot.ok { background: #22c55e; }
</style>
