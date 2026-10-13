// İçerik duman testi — content.js SPEC Bölüm 5 kurallarına uyuyor mu?
// Çalıştırma: node tests/content.check.mjs  (hata yoksa "OK" basar, hata varsa 1 ile çıkar)
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const CONTENT = require('../app/js/content.js');

const errors = [];
const ok = (cond, msg) => { if (!cond) errors.push(msg); };

// Seviye başına beklenen kart sayısı (SPEC Bölüm 5)
const CARD_COUNTS = { 1: 4, 2: 5, 3: 4, 4: 4, 5: 8 };

ok(CONTENT && Array.isArray(CONTENT.levels), 'CONTENT.levels dizisi yok');
ok(CONTENT.levels.length === 5, `5 seviye bekleniyordu, ${CONTENT.levels.length} var`);

const allCardIds = new Set();

CONTENT.levels.forEach((lv, i) => {
  const L = `L${lv.id}`;
  ok(lv.id === i + 1, `${L}: id sırası bozuk (beklenen ${i + 1})`);
  ok(typeof lv.title === 'string' && lv.title, `${L}: title eksik`);
  ok(typeof lv.lesson === 'string' && lv.lesson, `${L}: lesson eksik`);
  ok(typeof lv.intro === 'string' && lv.intro, `${L}: intro eksik`);
  ok(lv.mechanics && typeof lv.mechanics.maxPick === 'number', `${L}: mechanics.maxPick eksik`);
  ok(lv.mechanics.maxPick === (lv.id === 5 ? 3 : 1), `${L}: maxPick ${lv.mechanics.maxPick} (beklenen ${lv.id === 5 ? 3 : 1})`);
  ok(lv.mechanics.idkEnabled === (lv.id === 3), `${L}: idkEnabled ${lv.mechanics.idkEnabled}`);
  ok(lv.mechanics.hasCorrect === (lv.id !== 3), `${L}: hasCorrect ${lv.mechanics.hasCorrect}`);
  ok(Array.isArray(lv.questions) && lv.questions.length === 3, `${L}: tam 3 soru olmalı (${lv.questions.length} var)`);

  lv.questions.forEach((q) => {
    const Q = `${L}/${q.id}`;
    ok(typeof q.question === 'string' && q.question, `${Q}: question eksik`);
    ok(Array.isArray(q.cards) && q.cards.length === CARD_COUNTS[lv.id],
      `${Q}: ${CARD_COUNTS[lv.id]} kart bekleniyordu, ${q.cards ? q.cards.length : 0} var`);

    // Kartlar
    const kinds = {};
    q.cards.forEach((c) => {
      const C = `${Q}/${c.id}`;
      ok(!allCardIds.has(c.id), `${C}: kart id'si tekrar ediyor`);
      allCardIds.add(c.id);
      ok(typeof c.title === 'string' && c.title, `${C}: title eksik`);
      ok(typeof c.text === 'string' && c.text, `${C}: text eksik`);
      ok(['correct', 'distractor', 'irrelevant', 'outdated', 'essential'].includes(c.kind), `${C}: geçersiz kind "${c.kind}"`);
      const expectedKey = (c.kind === 'correct' || c.kind === 'essential') ? 'correct' : c.kind;
      ok(c.answerKey === expectedKey, `${C}: answerKey "${c.answerKey}" olmamalı (beklenen "${expectedKey}")`);
      kinds[c.kind] = (kinds[c.kind] || 0) + 1;
    });

    // answers: motorun seçebileceği TÜM anahtarlar var mı?
    ok(q.answers && typeof q.answers.correct === 'string' && q.answers.correct, `${Q}: answers.correct eksik`);
    ok(typeof q.answers.idk === 'string' && q.answers.idk, `${Q}: answers.idk eksik`);
    q.cards.forEach((c) => {
      if (c.answerKey !== 'correct') {
        ok(typeof q.answers[c.answerKey] === 'string' && q.answers[c.answerKey],
          `${Q}: answers.${c.answerKey} eksik (kart ${c.id} bunu gerektiriyor)`);
      }
    });

    if (lv.id === 3) {
      // L3: doğru kart YOK
      ok(!kinds.correct && !kinds.essential, `${Q}: L3'te correct/essential kart olmamalı`);
    }

    if (lv.id === 4) {
      // L4: biri outdated (eski yıl), biri correct (güncel yıl); yıllar kart metninde görünür
      const outdated = q.cards.filter((c) => c.kind === 'outdated');
      const correct = q.cards.filter((c) => c.kind === 'correct');
      ok(outdated.length === 1, `${Q}: L4'te tam 1 outdated kart olmalı`);
      ok(correct.length === 1, `${Q}: L4'te tam 1 correct kart olmalı`);
      [...outdated, ...correct].forEach((c) => {
        ok(typeof c.year === 'number', `${Q}/${c.id}: L4 kartında year sayı olmalı`);
        ok(c.text.includes(String(c.year)), `${Q}/${c.id}: yıl (${c.year}) kart metninde görünmüyor`);
      });
      ok(correct[0] && outdated[0] && correct[0].year > outdated[0].year,
        `${Q}: correct kartın yılı outdated karttan yeni olmalı`);
    }

    if (lv.id === 5) {
      // L5: 8 karttan tam 3'ü essential; essentialCardIds birebir eşleşir; partial cevabı var
      const essential = q.cards.filter((c) => c.kind === 'essential').map((c) => c.id);
      ok(essential.length === 3, `${Q}: tam 3 essential kart olmalı (${essential.length} var)`);
      ok(Array.isArray(q.essentialCardIds) && q.essentialCardIds.length === 3,
        `${Q}: essentialCardIds tam 3 elemanlı dizi olmalı`);
      const setA = new Set(essential);
      const setB = new Set(q.essentialCardIds || []);
      ok(setA.size === setB.size && [...setA].every((id) => setB.has(id)),
        `${Q}: essentialCardIds (${[...setB]}) essential kartlarla (${[...setA]}) eşleşmiyor`);
      (q.essentialCardIds || []).forEach((id) => {
        ok(q.cards.some((c) => c.id === id), `${Q}: essentialCardIds '${id}' kartlar arasında yok`);
      });
      ok(typeof q.answers.partial === 'string' && q.answers.partial, `${Q}: answers.partial eksik (L5 zorunlu)`);
    } else {
      ok(q.essentialCardIds === null, `${Q}: essentialCardIds yalnız L5'te dolu olmalı`);
    }
  });
});

if (errors.length) {
  console.error(`İÇERİK HATASI (${errors.length}):`);
  errors.forEach((e) => console.error(' - ' + e));
  process.exit(1);
}
console.log('OK — içerik SPEC Bölüm 5 kurallarının tümünden geçti.');
console.log(`Seviyeler: ${CONTENT.levels.length}, sorular: ${CONTENT.levels.reduce((n, l) => n + l.questions.length, 0)}, kartlar: ${allCardIds.size}`);
