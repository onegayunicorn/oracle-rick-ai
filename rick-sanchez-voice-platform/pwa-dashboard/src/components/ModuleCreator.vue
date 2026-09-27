<template>
  <div class="creator">
    <h2>Voice Synthesis Module Creator</h2>
    <p class="intro">Generate a ready-to-use Python or Node package preconfigured for any voice.</p>

    <form @submit.prevent="build">
      <label>Package Name</label>
      <input v-model="spec.name" placeholder="e.g. rick-voice" required pattern="[a-z][a-z0-9_-]*" />
      <label>Voice ID</label>
      <input v-model="spec.voice_id" placeholder="Your voice clone ID" required />
      <label>Persona Name</label>
      <input v-model="spec.persona_name" placeholder="e.g. RickSanchez" />
      <label>Model</label>
      <select v-model="spec.model">
        <option value="s2.1-pro-free">s2.1-pro-free</option>
        <option value="s2.1-pro">s2.1-pro</option>
      </select>
      <label>Language</label>
      <select v-model="spec.language">
        <option value="python">Python</option>
        <option value="node">Node.js</option>
      </select>
      <label>Description</label>
      <input v-model="spec.description" placeholder="Brief package description" />
      <button type="submit" :disabled="building">
        {{ building ? 'Packaging…' : 'Generate Module Package' }}
      </button>
    </form>

    <div v-if="downloadUrl" class="done">
      Ready — <a :href="downloadUrl" download>Download {{ spec.name }}-module.tar.gz</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { generateModule } from '../api'

const spec = ref({
  name: '', voice_id: '', persona_name: 'CustomVoice',
  model: 's2.1-pro-free', language: 'python', description: '', author: ''
})
const building = ref(false)
const downloadUrl = ref('')

async function build() {
  building.value = true
  try {
    const blob = await generateModule(spec.value)
    downloadUrl.value = URL.createObjectURL(blob)
  } catch (e) {
    alert('Error: ' + e.message)
  } finally {
    building.value = false
  }
}
</script>

<style scoped>
.intro { color: #94a3b8; margin-bottom: 1.5rem; }
form { display: flex; flex-direction: column; gap: 0.75rem; }
label { margin-top: 0.25rem; color: #cbd5e1; }
input, select { padding: 0.75rem; background: #1e293b; border: 1px solid #475569; border-radius: 6px; color: #f1f5f9; }
button { margin-top: 0.75rem; background: #a855f7; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: bold; cursor: pointer; }
.done { margin-top: 1.5rem; padding: 1rem; background: #14532d; border-radius: 8px; }
a { color: #86efac; font-weight: bold; }
</style>
