import { initDB } from './db';
import { createStore } from './store';
import { renderDashboard } from './render';
import { initTabs } from './tabs';
import { initEngine } from './webllm/engine';

(async () => {
  await initDB();
  const store = createStore();
  renderDashboard(store);
  initTabs();
  initEngine();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');
})();
