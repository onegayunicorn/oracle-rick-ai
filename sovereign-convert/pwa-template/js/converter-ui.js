// PWA-side controls: fullscreen, install prompt, settings.
document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('screen');
  const runner = new DosRunner(canvas);
  await runner.load();

  const controls = document.getElementById('controls');
  const fsBtn = document.createElement('button');
  fsBtn.textContent = 'Fullscreen';
  fsBtn.onclick = () => document.documentElement.requestFullscreen?.();
  controls.appendChild(fsBtn);

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.createElement('button');
    btn.textContent = 'Install App';
    btn.onclick = () => { deferredPrompt.prompt(); };
    controls.appendChild(btn);
  });
});
