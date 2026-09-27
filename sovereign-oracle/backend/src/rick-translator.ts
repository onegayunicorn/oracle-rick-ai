import axios from 'axios';
import { NexusState } from './nexus-math';

export interface TelemetryPacket {
  lux: number;
  cct: number;
  source: 'hardware' | 'simulator';
  nexus: NexusState;
  timestamp: number;
}

export class RickTranslatorService {
  private ollamaUrl: string;
  private piperUrl: string;
  private isProcessing: boolean = false;
  private lastTriggerTime: number = 0;
  private lastLux: number = 0;

  constructor(
    ollamaUrl: string = process.env.OLLAMA_URL || 'http://localhost:11434',
    piperUrl: string = process.env.PIPER_URL || 'http://localhost:8000'
  ) {
    this.ollamaUrl = ollamaUrl;
    this.piperUrl = piperUrl;
  }

  /** Generates dynamic prompt context from real-time EM-001..EM-007 state. */
  public buildSystemContext(telemetry: TelemetryPacket): string {
    const { lux, cct, nexus } = telemetry;
    let opticalDemeanor = 'nominal lab ambient';
    let vocalModifier = '';
    if (nexus.em001_decoherence > 0.055) {
      opticalDemeanor = 'severe environmental noise, optical collapse detected';
      vocalModifier = '*burp* ';
    }
    const temporalStatus = nexus.em005_ricciCurvature > 0.046 ? 'TEMPORAL FLUX HIGH' : 'METRIC INTACT';
    const bandgapState = nexus.em007_bandgap < 0.3 ? 'SUPPRESSED (450-650nm absorption)' : 'TRANSPARENT';
    return `
[TELEMETRY SNAPSHOT]
- Ambient Lux: ${lux.toFixed(1)} lx (${opticalDemeanor})
- Color Temp: ${cct.toFixed(0)} K
- Quantum Decoherence Gamma: ${nexus.em001_decoherence.toFixed(4)}
- 7.83Hz Schumann Eigenmode: ${(nexus.em002_resonance * 100).toFixed(1)}%
- Fractal Dimension D_H: ${nexus.em003_fractalDim.toFixed(4)}
- Von Neumann Entropy S: ${nexus.em004_entropy.toFixed(4)}
- Spacetime Ricci Curvature: ${temporalStatus} (R=${nexus.em005_ricciCurvature.toFixed(4)})
- Photonic Bandgap: ${bandgapState}
${vocalModifier ? `Note: Deliver an opening ${vocalModifier}` : ''}
`.trim();
  }

  /** Evaluates if telemetry shifts warrant an unprompted Rick monologue. */
  public evaluateAutonomousTrigger(telemetry: TelemetryPacket): boolean {
    const now = Date.now();
    if (now - this.lastTriggerTime < 15000 || this.isProcessing) return false;
    const luxDelta = Math.abs(telemetry.lux - this.lastLux);
    if (luxDelta > 50.0) {
      this.lastTriggerTime = now;
      this.lastLux = telemetry.lux;
      return true;
    }
    if (telemetry.nexus.em005_ricciCurvature > 0.051) {
      this.lastTriggerTime = now;
      return true;
    }
    return false;
  }

  /** Complete pipeline: query LLM -> synthesize Piper audio. */
  public async executeOracleInquiry(
    userQuery: string, telemetry: TelemetryPacket
  ): Promise<{ text: string; audioBase64: string }> {
    this.isProcessing = true;
    try {
      const telemetryContext = this.buildSystemContext(telemetry);
      const llmResponse = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: 'rick-c137',
        prompt: `${telemetryContext}\n\nHuman Inquiry: \"${userQuery}\"\nRick C-137 Response:`,
        stream: false,
      });
      const speechText = llmResponse.data.response.trim();
      const ttsResponse = await axios.post(
        `${this.piperUrl}/v1/audio/speech`,
        { text: speechText, length_scale: 1.05 },
        { responseType: 'arraybuffer' }
      );
      const audioBase64 = Buffer.from(ttsResponse.data).toString('base64');
      return { text: speechText, audioBase64 };
    } finally {
      this.isProcessing = false;
    }
  }
}
