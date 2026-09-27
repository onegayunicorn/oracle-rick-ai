const ORCHESTRATOR = import.meta.env.VITE_ORCHESTRATOR_URL || ''

export async function health() {
  const r = await fetch(`${ORCHESTRATOR}/api/v1/health`)
  return r.json()
}

export async function synthesize(text, opts = {}) {
  const r = await fetch(`${ORCHESTRATOR}/api/v1/synthesize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, ...opts })
  })
  return r.json()
}

export async function jobStatus(jobId) {
  const r = await fetch(`${ORCHESTRATOR}/api/v1/jobs/${jobId}`)
  return r.json()
}

export function jobDownloadUrl(jobId) {
  return `${ORCHESTRATOR}/api/v1/jobs/${jobId}/download`
}

export async function generateModule(spec) {
  const r = await fetch(`${ORCHESTRATOR}/api/v1/modules/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spec)
  })
  if (!r.ok) throw new Error('Generation failed')
  return r.blob()
}
