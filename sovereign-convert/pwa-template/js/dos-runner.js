// Emulation bridge: loads assets/app.bin and drives the canvas.
// For DOS EXEs, swap in js-dos / dosbox-wasm; for WASM builds, instantiate directly.
class DosRunner {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  async load(url = 'assets/app.bin') {
    try {
      const res = await fetch(url);
      this.binary = await res.arrayBuffer();
      this.ctx.fillStyle = '#22d3ee';
      this.ctx.font = '16px monospace';
      this.ctx.fillText(`Loaded ${this.binary.byteLength} bytes`, 20, 40);
      this.ctx.fillText('Attach js-dos / WASM runtime to execute.', 20, 70);
    } catch (e) {
      this.ctx.fillStyle = '#f87171';
      this.ctx.fillText('No app binary found. Place at assets/app.bin.', 20, 40);
    }
  }
}
window.DosRunner = DosRunner;
