// WebLLM offline model configuration. Runs entirely in-browser via WebGPU.
export const WEBLLM_CONFIG = {
  model: 'Llama-3-8B-Instruct-q4f32_1-MLC',
  useWebGPU: true,
  contextWindowSize: 4096,
  temperature: 0.7,
  top_p: 0.95,
};
