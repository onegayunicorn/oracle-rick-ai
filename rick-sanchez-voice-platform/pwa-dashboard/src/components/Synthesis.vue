<template>
  <div class="synthesize">
    <h2>Voice Synthesis</h2>
    <textarea v-model="text" rows="4" placeholder="Enter text — use [bracket] tags for emotion: [laugh] [whisper] [excited]"></textarea>
    <div class="form-row">
      <input v-model="voiceId" placeholder="Voice ID" />
      <select v-model="model">
        <option value="s2.1-pro-free">s2.1-pro-free (Free)</option>
        <option value="s2.1-pro">s2.1-pro (Paid)</option>
      </select>
    </div>
    <button @click="generate" :disabled="loading">
      {{ loading ? 'Generating…' : 'Generate Audio' }}
    </button>

    <div v-if="job" class="result">
      <p>Status: <strong>{{ job.status }}</strong></p>
      <audio v-if="job.status==='completed'" controls :src="downloadUrl">Your browser does not support audio</audio>
      <a v-if="job.status==='completed'" :href="downloadUrl" download>Download MP3</a>
      <p v-if="job.error" class="error">{{ job.error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { synthesize, jobStatus, jobDownloadUrl } from '../api'

const text = ref('')
const voiceId = ref('d2e75a3e3fd6419893057c02a375a113')
const model = ref('s2.1-pro-free')
const job = ref(null)
const loading = ref(false)
const poller = ref(null)

const downloadUrl = computed(() => job.value ? jobDownloadUrl(job.value.job_id) : '')

async function generate() {
  loading.value = true
  job.value = await synthesize(text.value, { voice_id: voiceId.value, model: model.value })
  poller.value = setInterval(async () => {
    job.value = await jobStatus(job.value.job_id)
    if (['completed','failed'].includes(job.value.status)) {
      clearInterval(poller.value)
    }
  }, 800)
  loading.value = false
}
</script>

<style scoped>
textarea { width: 100%; padding: 1rem; background: #1e293b; border: 1px solid #475569; border-radius: 8px; color: #f1f5f9; }
.form-row { display: flex; gap: 0.75rem; margin: 0.75rem 0; }
input, select { flex: 1; padding: 0.75rem; background: #1e293b; border: 1px solid #475569; border-radius: 6px; color: #f1f5f9; }
button { background: #22d3ee; color: #0f172a; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: bold; cursor: pointer; }
button:disabled { opacity: 0.6; cursor: wait; }
.result { margin-top: 1.5rem; padding: 1rem; background: #1e293b; border-radius: 8px; }
.error { color: #f87171; margin-top: 0.5rem; }
audio { margin: 1rem 0; width: 100%; }
</style>
