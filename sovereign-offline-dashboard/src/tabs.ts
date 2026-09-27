const TABS = ['chat', 'models', 'history', 'settings'];
export function initTabs() {
  document.getElementById('tabs')?.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).dataset.tab;
    if (!t) return;
    document.querySelectorAll('#tabs button').forEach(b => (b as HTMLElement).classList.toggle('active', (b as HTMLElement).dataset.tab === t));
    const view = document.getElementById('view')!;
    view.innerHTML = `<h2>${t.toUpperCase()}</h2><p>Tab content: ${t}</p>`;
  });
}
