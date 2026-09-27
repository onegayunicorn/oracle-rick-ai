/** WebAudio ring-buffer player with gapless scheduling + FFT intensity. */
export class SovereignAudioPlayer {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private nextStartTime: number = 0;
  private isMuted: boolean = false;

  public init(): void {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 22050 });
      this.compressor = this.ctx.createDynamicsCompressor();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.compressor.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  public async enqueueWavChunk(wavArrayBuffer: ArrayBuffer): Promise<void> {
    if (this.isMuted || !this.ctx || !this.analyser || !this.compressor) return;
    const audioBuffer = await this.ctx.decodeAudioData(wavArrayBuffer.slice(0));
    const source = this.ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.compressor);
    const scheduledTime = Math.max(this.ctx.currentTime, this.nextStartTime);
    source.start(scheduledTime);
    this.nextStartTime = scheduledTime + audioBuffer.duration;
  }

  public getAudioIntensity(): number {
    if (!this.analyser) return 0;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    return sum / (data.length * 255);
  }

  public interrupt(): void {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.init();
      this.nextStartTime = 0;
    }
  }

  public setMuted(m: boolean) { this.isMuted = m; }
}
