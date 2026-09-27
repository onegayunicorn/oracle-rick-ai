# Offline LLM Service (Ollama)

```bash
# Build the Rick persona model locally (fully offline after first pull)
ollama pull llama3.2:3b-instruct-q4_K_M
ollama create rick-c137 -f services/llm/Modelfile.rick
ollama run rick-c137
```

The backend's `RickTranslatorService` queries `http://localhost:11434/api/generate`
with a dynamic [TELEMETRY SNAPSHOT] injected into every prompt.
