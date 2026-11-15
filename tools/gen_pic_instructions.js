// Usage:  node tools/gen_pic_instructions.js
// Reads story/mission001/story.js and writes story/mission001/pic_instructions.txt
// Also verifies that every image key used by the story exists in the image list.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const M = require(path.join(root, 'story/mission001/story.js'));

// ---- validate keys used by steps
const used = new Set(), problems = [];
(function walk(steps) {
  for (const s of steps) {
    if (s.bg) { used.add(s.bg); if (!M.images[s.bg]) problems.push('unknown bg: ' + s.bg); }
    if (s.say && !M.chars[s.say]) problems.push('unknown speaker: ' + s.say);
    if (s.choice) s.choice.options.forEach((o) => walk(o.result));
  }
})(M.steps);
Object.values(M.chars).forEach((c) => c.sprite && used.add(c.sprite));
const unused = Object.keys(M.images).filter((k) => !used.has(k));
if (unused.length) problems.push('images defined but never used: ' + unused.join(', '));
if (problems.length) { console.error('PROBLEMS:\n - ' + problems.join('\n - ')); process.exitCode = 1; }

// ---- build the text file
const bgs = Object.entries(M.images).filter(([, v]) => v.type === 'bg');
const sprites = Object.entries(M.images).filter(([, v]) => v.type === 'sprite');
const wrap = (t, w = 92, ind = '    ') => {
  const words = t.split(/\s+/), lines = []; let cur = '';
  for (const wd of words) { if ((cur + ' ' + wd).trim().length > w) { lines.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }
  if (cur) lines.push(cur);
  return lines.map((l) => ind + l).join('\n');
};
const out = [];
out.push(`ORBITAL 2.0 — ${M.code}: ${M.name}`);
out.push('PICTURE INSTRUCTIONS');
out.push('='.repeat(78));
out.push('');
out.push(`Save every picture in:   ${M.folder}/`);
out.push('Use EXACTLY the file names given below (the game loads them by name).');
out.push('PNG is preferred; .jpg and .webp with the same name also work.');
out.push(`Total pictures: ${bgs.length + sprites.length}  (${bgs.length} backgrounds + ${sprites.length} character sprites)`);
out.push('Until a picture exists, the game shows a labelled placeholder, so you can add them one at a time.');
out.push('');
out.push('GENERAL STYLE (match the ORBITAL 2.0 key art you already made)');
out.push('-'.repeat(78));
out.push(wrap('Cinematic, photorealistic sci-fi. Deep navy / black space, electric-blue (#35d0ff) neon and holographic accents, clean futuristic design, soft volumetric light. Consistent look across all pictures. No text, logos, watermarks or UI unless the description asks for it.', 90, '  '));
out.push('');
out.push('BACKGROUNDS');
out.push('  - Size 1920 x 1080 (16:9), PNG.');
out.push('  - The dialogue box covers the bottom ~25% of the screen: keep the important content in the upper 75%.');
out.push('  - Character sprites stand at the far LEFT and far RIGHT edges (about 5%–28% of the width on each side),');
out.push('    so keep the very centre of the picture as the main subject.');
out.push('');
out.push('CHARACTER SPRITES');
out.push('  - Transparent background PNG, roughly 1000 x 1700 px, standing 3/4 body (head to just above the knees is fine).');
out.push('  - Each sprite faces toward the centre of the screen (see each description).');
out.push('  - Same lighting style as the backgrounds, soft blue rim light.');
out.push('');
out.push('='.repeat(78));
out.push('PART 1 — BACKGROUND / VISUAL PICTURES (in the order they appear in the story)');
out.push('='.repeat(78));
bgs.forEach(([key, v], i) => {
  out.push('');
  out.push(`[${String(i + 1).padStart(2, '0')}]  ${v.file}.png`);
  out.push(`    Used in: ${v.scene}`);
  out.push(wrap(v.desc));
});
out.push('');
out.push('='.repeat(78));
out.push('PART 2 — CHARACTER SPRITES');
out.push('='.repeat(78));
sprites.forEach(([key, v], i) => {
  out.push('');
  out.push(`[C${i + 1}]  ${v.file}.png   (transparent PNG)`);
  out.push(wrap(v.desc));
});
out.push('');
out.push('='.repeat(78));
out.push('NOT NEEDED AS PICTURES (the game draws these itself)');
out.push('='.repeat(78));
out.push('  ORION (the AI) has no sprite — it speaks through a cyan HUD text box.');
out.push('  The USER (player) has no sprite and no name — shown as "USER".');
out.push('  NASA data panels, instrument tables, MISSION FAILED screens, the success/score screen and');
out.push('  the ORBITAL 2.0 end card are all built in code.');
out.push('');
out.push('CHECKLIST');
out.push('-'.repeat(78));
bgs.concat(sprites).forEach(([, v]) => out.push(`  [ ] ${v.file}.png`));
out.push('');

fs.writeFileSync(path.join(root, 'story/mission001/pic_instructions.txt'), out.join('\n'));
console.log(`wrote pic_instructions.txt — ${bgs.length} backgrounds, ${sprites.length} sprites` + (problems.length ? ' (with problems!)' : ' — story keys OK'));
