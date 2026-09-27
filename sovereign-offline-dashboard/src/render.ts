import type { AppState } from './store';

export function renderDashboard(store: AppState) {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <header><h1>Offline AI Dashboard</h1><span id="model-badge">${store.modelStatus}</span></header>
    <nav id="tabs"><button data-tab="chat">Chat</button><button data-tab="models">Models</button><button data-tab="history">History</button><button data-tab="settings">Settings</button></nav>
    <main id="view"></main>
  `;
}
