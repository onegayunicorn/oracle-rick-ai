<template>
  <div class="app">
    <header>
      <h1>Voice Synthesis Dashboard</h1>
      <nav>
        <button @click="view='dashboard'" :class="{active:view==='dashboard'}">Dashboard</button>
        <button @click="view='synthesize'" :class="{active:view==='synthesize'}">Synthesize</button>
        <button @click="view='creator'" :class="{active:view==='creator'}">Module Creator</button>
        <button @click="view='settings'" :class="{active:view==='settings'}">Settings</button>
      </nav>
    </header>
    <main>
      <Dashboard v-if="view==='dashboard'" />
      <Synthesis v-if="view==='synthesize'" />
      <ModuleCreator v-if="view==='creator'" />
      <Settings v-if="view==='settings'" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dashboard from './components/Dashboard.vue'
import Synthesis from './components/Synthesis.vue'
import ModuleCreator from './components/ModuleCreator.vue'
import Settings from './components/Settings.vue'

const view = ref('dashboard')
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui; }
.app { min-height: 100vh; background: #0f172a; color: #e2e8f0; }
header { background: #1e293b; padding: 1rem 2rem; border-bottom: 1px solid #334155; }
h1 { font-size: 1.25rem; color: #22d3ee; }
nav { margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
nav button { background: #334155; border: none; color: #cbd5e1; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
nav button.active { background: #22d3ee; color: #0f172a; font-weight: bold; }
main { padding: 2rem; max-width: 1000px; margin: 0 auto; }
</style>
