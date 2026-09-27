#!/usr/bin/env node
const { FishVoiceNodeClient } = require('./index');
const fs = require('fs');

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--list-voices')) {
    const c = new FishVoiceNodeClient();
    console.log(JSON.stringify(await c.listVoices(), null, 2));
    return;
  }
  const outIdx = args.indexOf('-o');
  const out = outIdx > -1 ? args[outIdx + 1] : 'output.mp3';
  const text = args.filter((a, i) => a !== '-o' && (i === 0 || args[i - 1] !== '-o')).join(' ');
  if (!text) {
    console.error('Usage: rick-tts-node "text" [-o out.mp3] [--list-voices]');
    process.exit(1);
  }
  const c = new FishVoiceNodeClient();
  const audio = await c.synthesize(text);
  fs.writeFileSync(out, audio);
  console.log('[OK] Saved to', out);
}
main().catch(e => { console.error('[ERROR]', e.message); process.exit(1); });
