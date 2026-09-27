/* Quickstart: synthesize with the Node client (Node >= 18). */
const { FishVoiceNodeClient } = require('../skill/rick-sanchez-voice/scripts/fish_voice_node');
const fs = require('fs');

(async () => {
  const c = new FishVoiceNodeClient();
  const audio = await c.synthesize("Wubba lubba dub dub! [laugh]");
  fs.writeFileSync('quickstart.mp3', audio);
  console.log('[OK] wrote quickstart.mp3');
})().catch(e => { console.error(e); process.exit(1); });
