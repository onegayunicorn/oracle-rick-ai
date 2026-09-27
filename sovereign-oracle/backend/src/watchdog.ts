/** Sensor stall watchdog with autonomous Brownian fallback. */
export class SensorWatchdog {
  private lastUpdate: number = Date.now();
  private isSimulated: boolean = false;

  public feed(): void {
    this.lastUpdate = Date.now();
    this.isSimulated = false;
  }

  public checkHealth(): { useFallback: boolean; timeSinceLastMs: number } {
    const elapsed = Date.now() - this.lastUpdate;
    if (elapsed > 2500 && !this.isSimulated) {
      console.warn('[watchdog] Sensor stream stalled. Engaging synthetic Brownian light engine.');
      this.isSimulated = true;
    }
    return { useFallback: this.isSimulated, timeSinceLastMs: elapsed };
  }
}
