<template>
  <div class="settings">
    <h2>Settings &amp; Configuration</h2>
    <table>
      <tr><th>Orchestrator</th><td>{{ orchestratorUrl || '(default)' }}</td></tr>
      <tr><th>Protocol</th><td>{{ location.protocol }} // {{ location.host }}</td></tr>
      <tr><th>PWA Ready</th><td>{{ isPWA ? 'Yes' : 'No (browser tab)' }}</td></tr>
      <tr><th>Service Worker</th><td>{{ swState }}</td></tr>
    </table>
    <p class="hint">Configure orchestrator URL via <code>VITE_ORCHESTRATOR_URL</code> at build time.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const location = window.location
const orchestratorUrl = ref(import.meta.env.VITE_ORCHESTRATOR_URL)
const isPWA = ref(false)
const swState = ref('Checking…')

onMounted(() => {
  isPWA.value = window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(r => {
      swState.value = r ? 'Registered' : 'Not installed'
    })
  } else {
    swState.value = 'Not supported'
  }
})
</script>

<style scoped>
table { border-collapse: collapse; width: 100%; margin-top: 1rem; background: #1e293b; border-radius: 8px; overflow: hidden; }
td, th { padding: 0.75rem 1rem; border-bottom: 1px solid #334155; text-align: left; }
.hint { margin-top: 1rem; color: #94a3b8; font-size: 0.9rem; }
code { background: #334155; padding: 0.125rem 0.5rem; border-radius: 4px; }
</style>
