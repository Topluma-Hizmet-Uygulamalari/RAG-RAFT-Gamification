// Oyun motoru testleri — node --test tests/engine.test.mjs ile koşar.
// content.js'e bağımlı değildir: SPEC şemasına uyan sahte içerik burada kurulur.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const GameEngine = require('../app/js/engine.js');

// --- SPEC şemasına uyan sahte içerik ---
function makeCard(id, kind, extra = {}) {
  const answerKey = kind === 'correct' || kind === 'essential' ? 'correct' : kind;
  return {
    id,
    title: 'Kart ' + id,
    text: 'İçerik ' + id,
    year: null,
    kind,
    answerKey,
    ...extra
  };
}

function makeAnswers() {
  return {
    correct: 'Doğru cevap metni.',
    idk: 'Bu kartlarda cevap yok, bilmiyorum.',
    partial: 'Elimdeki kartlarla ancak yarım cevap verebilirim.',
    distractor: 'Çeldirici karttan gelen kendinden emin yanlış cevap.',
    irrelevant: 'Alakasız karttan gelen saçma ama emin cevap.',
    outdated: 'Eski karttan gelen güncel olmayan cevap.'
  };
}

function makeContent() {
  return {
    meta: { title: 'Test Oyunu', version: 1 },
    levels: [
      {
        id: 1,
        title: 'Doğru Kartı Bul',
        lesson: 'Robot kartsız cevap veremez.',
        intro: 'Seviye 1 tanıtımı.',
        mechanics: { maxPick: 1, idkEnabled: false, hasCorrect: true },
        questions: [
          {
            id: 'l1q1',
            question: 'Soru 1?',
            cards: [
              makeCard('l1q1c1', 'correct'),
              makeCard('l1q1c2', 'distractor'),
              makeCard('l1q1c3', 'irrelevant')
            ],
            essentialCardIds: null,
            answers: makeAnswers()
          },
          {
            id: 'l1q2',
            question: 'Soru 2?',
            cards: [
              makeCard('l1q2c1', 'distractor'),
              makeCard('l1q2c2', 'correct'),
              makeCard('l1q2c3', 'outdated', { year: 2010 })
            ],
            essentialCardIds: null,
            answers: makeAnswers()
          }
        ]
      },
      {
        id: 3,
        title: 'Hiç Doğru Kart Yok',
        lesson: 'Bilmiyorum demek bir başarıdır.',
        intro: 'Seviye 3 tanıtımı.',
        mechanics: { maxPick: 1, idkEnabled: true, hasCorrect: false },
        questions: [
          {
            id: 'l3q1',
            question: 'Cevabı kartlarda olmayan soru?',
            cards: [
              makeCard('l3q1c1', 'distractor'),
              makeCard('l3q1c2', 'irrelevant')
            ],
            essentialCardIds: null,
            answers: makeAnswers()
          }
        ]
      },
      {
        id: 5,
        title: 'Kart Limiti',
        lesson: 'Yer sınırlı, seçim kritik.',
        intro: 'Seviye 5 tanıtımı.',
        mechanics: { maxPick: 3, idkEnabled: false, hasCorrect: true },
        questions: [
          {
            id: 'l5q1',
            question: 'En kritik üç kart hangisi?',
            cards: [
              makeCard('l5q1c1', 'essential'),
              makeCard('l5q1c2', 'essential'),
              makeCard('l5q1c3', 'essential'),
              makeCard('l5q1c4', 'distractor'),
              makeCard('l5q1c5', 'irrelevant')
            ],
            essentialCardIds: ['l5q1c1', 'l5q1c2', 'l5q1c3'],
            answers: makeAnswers()
          }
        ]
      }
    ]
  };
}

// Oyunu belirli bir seviyenin ilk sorusuna getirir (önceki seviyeleri doğru oynayarak)
function playToLevel(game, levelIndex) {
  game.start();
  game.beginLevel();
  while (game.state.levelIndex < levelIndex) {
    const content = makeContent();
    const level = content.levels[game.state.levelIndex];
    const q = level.questions[game.state.questionIndex];
    if (level.mechanics.hasCorrect) {
      const picks = Array.isArray(q.essentialCardIds)
        ? q.essentialCardIds
        : [q.cards.find((c) => c.kind === 'correct').id];
      for (const id of picks) game.toggleCard(id);
      game.submit();
    } else {
      game.sayIDK();
    }
    game.next();
    if (game.state.screen === 'levelIntro') game.beginLevel();
  }
}

test('başlangıç durumu ve akış: idle -> levelIntro -> playing', () => {
  const game = GameEngine.createGame(makeContent());
  assert.equal(game.state.screen, 'idle');
  assert.equal(game.state.score, 0);
  game.start();
  assert.equal(game.state.screen, 'levelIntro');
  assert.equal(game.state.levelIndex, 0);
  game.beginLevel();
  assert.equal(game.state.screen, 'playing');
  assert.equal(game.state.questionIndex, 0);
  assert.equal(game.state.attempt, 1);
});

test('toggleCard: maxPick sınırı aşılırsa false döner, state değişmez', () => {
  const game = GameEngine.createGame(makeContent());
  game.start();
  game.beginLevel(); // L1: maxPick 1
  assert.equal(game.toggleCard('l1q1c1'), true);
  assert.deepEqual(game.state.selectedCardIds, ['l1q1c1']);
  assert.equal(game.toggleCard('l1q1c2'), false); // sınır aşımı
  assert.deepEqual(game.state.selectedCardIds, ['l1q1c1']);
  // Aynı karta tekrar tıklamak bırakır
  assert.equal(game.toggleCard('l1q1c1'), true);
  assert.deepEqual(game.state.selectedCardIds, []);
  // Soruda olmayan kart seçilemez
  assert.equal(game.toggleCard('yok-boyle-kart'), false);
});

test('submit: boş seçimle {error:"empty"} döner', () => {
  const game = GameEngine.createGame(makeContent());
  game.start();
  game.beginLevel();
  const res = game.submit();
  assert.deepEqual(res, { error: 'empty' });
  assert.equal(game.state.screen, 'playing');
});

test('ilk denemede doğru: +100, happy, answers.correct', () => {
  const game = GameEngine.createGame(makeContent());
  game.start();
  game.beginLevel();
  game.toggleCard('l1q1c1');
  const out = game.submit();
  assert.equal(out.outcome, 'correct');
  assert.equal(out.pointsEarned, 100);
  assert.equal(out.answerText, makeAnswers().correct);
  assert.equal(out.robotMood, 'happy');
  assert.equal(out.canRetry, false);
  assert.deepEqual(out.wrongCards, []);
  assert.equal(game.state.score, 100);
  assert.equal(game.state.screen, 'feedback');
  assert.equal(game.state.perLevel[0].correctFirstTry, 1);
});

test('yanlış -> retry -> doğru: ikinci denemede +50', () => {
  const game = GameEngine.createGame(makeContent());
  game.start();
  game.beginLevel();
  game.toggleCard('l1q1c2'); // distractor
  const wrong = game.submit();
  assert.equal(wrong.outcome, 'wrong');
  assert.equal(wrong.pointsEarned, 0);
  assert.equal(wrong.canRetry, true);
  assert.equal(wrong.robotMood, 'confident_wrong');
  assert.equal(wrong.answerText, makeAnswers().distractor); // ilk yanlış kartın answerKey varyantı
  assert.ok(wrong.explanation.includes('konuyla ilgili görünüyor')); // çeldirici şablonu
  assert.deepEqual(wrong.wrongCards, ['l1q1c2']);
  assert.equal(game.state.perLevel[0].errors, 1);

  game.next(); // retry: aynı soru, attempt 2
  assert.equal(game.state.screen, 'playing');
  assert.equal(game.state.attempt, 2);
  assert.equal(game.state.questionIndex, 0);
  assert.deepEqual(game.state.selectedCardIds, []);

  game.toggleCard('l1q1c1');
  const right = game.submit();
  assert.equal(right.outcome, 'correct');
  assert.equal(right.pointsEarned, 50);
  assert.equal(game.state.score, 50);
  assert.equal(game.state.perLevel[0].correctFirstTry, 0); // ilk denemede değildi
});

test('iki deneme de yanlış: 0 puan, canRetry false, doğru cevap açıklamada', () => {
  const game = GameEngine.createGame(makeContent());
  game.start();
  game.beginLevel();
  game.toggleCard('l1q1c2');
  game.submit();
  game.next(); // attempt 2
  game.toggleCard('l1q1c3'); // irrelevant
  const out = game.submit();
  assert.equal(out.outcome, 'wrong');
  assert.equal(out.canRetry, false);
  assert.equal(out.pointsEarned, 0);
  assert.equal(out.answerText, makeAnswers().irrelevant);
  assert.ok(out.explanation.includes(makeAnswers().correct)); // doğru cevap gösterilir
  assert.equal(game.state.score, 0);
  assert.equal(game.state.perLevel[0].errors, 2);
  game.next(); // devam: sonraki soru
  assert.equal(game.state.questionIndex, 1);
  assert.equal(game.state.attempt, 1);
});

test('L3 idk_right: +100, honest, answers.idk', () => {
  const game = GameEngine.createGame(makeContent());
  playToLevel(game, 1); // L3 tarzı seviyenin introsundan playing'e geçti
  assert.equal(game.state.levelIndex, 1);
  assert.equal(game.state.screen, 'playing');
  const before = game.state.score;
  const out = game.sayIDK();
  assert.equal(out.outcome, 'idk_right');
  assert.equal(out.pointsEarned, 100);
  assert.equal(out.answerText, makeAnswers().idk);
  assert.equal(out.robotMood, 'honest');
  assert.equal(game.state.score, before + 100);
  assert.equal(game.state.perLevel[1].idkUsed, 1);
});

test('L3: yanlış kart verilince robot kendinden emin saçmalar', () => {
  const game = GameEngine.createGame(makeContent());
  playToLevel(game, 1);
  game.toggleCard('l3q1c1'); // distractor
  const out = game.submit();
  assert.equal(out.outcome, 'wrong');
  assert.equal(out.robotMood, 'confident_wrong');
  assert.equal(out.answerText, makeAnswers().distractor);
  assert.equal(out.canRetry, true);
});

test('sayIDK: idkEnabled olmayan seviyede hata döner, state değişmez', () => {
  const game = GameEngine.createGame(makeContent());
  game.start();
  game.beginLevel(); // L1: idkEnabled false
  const res = game.sayIDK();
  assert.deepEqual(res, { error: 'idk_disabled' });
  assert.equal(game.state.screen, 'playing');
  assert.equal(game.state.perLevel[0].idkUsed, 0);
});

test('L5: essential set tam eşleşirse correct (sıra önemsiz)', () => {
  const game = GameEngine.createGame(makeContent());
  playToLevel(game, 2);
  assert.equal(game.state.levelIndex, 2);
  // Farklı sırayla seç
  game.toggleCard('l5q1c3');
  game.toggleCard('l5q1c1');
  game.toggleCard('l5q1c2');
  const out = game.submit();
  assert.equal(out.outcome, 'correct');
  assert.equal(out.pointsEarned, 100);
  assert.equal(out.answerText, makeAnswers().correct);
});

test('L5: yanlış set -> partial, answers.partial, wrongCards doğru', () => {
  const game = GameEngine.createGame(makeContent());
  playToLevel(game, 2);
  game.toggleCard('l5q1c1');
  game.toggleCard('l5q1c2');
  game.toggleCard('l5q1c4'); // distractor — essential değil
  const out = game.submit();
  assert.equal(out.outcome, 'partial');
  assert.equal(out.answerText, makeAnswers().partial);
  assert.equal(out.robotMood, 'confident_wrong');
  assert.equal(out.pointsEarned, 0);
  assert.equal(out.canRetry, true);
  assert.deepEqual(out.wrongCards, ['l5q1c4']);
});

test('L5: maxPick 3 sınırı — dördüncü kart seçilemez', () => {
  const game = GameEngine.createGame(makeContent());
  playToLevel(game, 2);
  assert.equal(game.toggleCard('l5q1c1'), true);
  assert.equal(game.toggleCard('l5q1c2'), true);
  assert.equal(game.toggleCard('l5q1c4'), true);
  assert.equal(game.toggleCard('l5q1c3'), false);
  assert.equal(game.state.selectedCardIds.length, 3);
});

test('oyun sonu: skor, perLevel ve olaylar', () => {
  const game = GameEngine.createGame(makeContent());
  const events = { levelComplete: [], gameOver: [], answers: 0 };
  game.on('levelComplete', (p) => events.levelComplete.push(p));
  game.on('gameOver', (p) => events.gameOver.push(p));
  game.on('answer', () => { events.answers += 1; });

  game.start();
  game.beginLevel();
  // L1 q1 ve q2 ilk denemede doğru
  game.toggleCard('l1q1c1');
  game.submit();
  game.next();
  game.toggleCard('l1q2c2');
  game.submit();
  game.next();
  assert.equal(events.levelComplete.length, 1);
  assert.equal(events.levelComplete[0].lesson, 'Robot kartsız cevap veremez.');
  assert.equal(game.state.screen, 'levelIntro');

  // L3: idk_right
  game.beginLevel();
  game.sayIDK();
  game.next();
  assert.equal(events.levelComplete.length, 2);

  // L5: essential set
  game.beginLevel();
  game.toggleCard('l5q1c1');
  game.toggleCard('l5q1c2');
  game.toggleCard('l5q1c3');
  game.submit();
  game.next();

  assert.equal(game.state.screen, 'gameOver');
  assert.equal(game.state.score, 400); // 100+100+100+100
  assert.equal(events.gameOver.length, 1);
  assert.equal(events.gameOver[0].score, 400);
  assert.equal(events.levelComplete.length, 3);
  assert.equal(events.answers, 4);
  assert.deepEqual(events.gameOver[0].perLevel, [
    { levelId: 1, correctFirstTry: 2, errors: 0, idkUsed: 0 },
    { levelId: 3, correctFirstTry: 0, errors: 0, idkUsed: 1 },
    { levelId: 5, correctFirstTry: 1, errors: 0, idkUsed: 0 }
  ]);
});

test('statechange olayı emit edilir ve off ile aboneden çıkılır', () => {
  const game = GameEngine.createGame(makeContent());
  let count = 0;
  const cb = () => { count += 1; };
  game.on('statechange', cb);
  game.start();
  assert.equal(count, 1);
  game.off('statechange', cb);
  game.beginLevel();
  assert.equal(count, 1);
});

test('answer olayı Outcome + question + selectedCards taşır', () => {
  const game = GameEngine.createGame(makeContent());
  let payload = null;
  game.on('answer', (p) => { payload = p; });
  game.start();
  game.beginLevel();
  game.toggleCard('l1q1c1');
  game.submit();
  assert.ok(payload);
  assert.equal(payload.outcome, 'correct');
  assert.equal(payload.question.id, 'l1q1');
  assert.equal(payload.selectedCards.length, 1);
  assert.equal(payload.selectedCards[0].id, 'l1q1c1');
});

test('karta-özgü answer alanı varsa yanlış cevapta varyant yerine o kullanılır', () => {
  const content = makeContent();
  // İlk sorunun çeldirici kartına karta-özgü cevap ekle
  content.levels[0].questions[0].cards[1].answer = 'Bu karta özel kendinden emin saçmalama.';
  const game = GameEngine.createGame(content);
  game.start();
  game.beginLevel();
  game.toggleCard('l1q1c2');
  const out = game.submit();
  assert.equal(out.outcome, 'wrong');
  assert.equal(out.answerText, 'Bu karta özel kendinden emin saçmalama.');
  // answer alanı olmayan kart hâlâ answerKey varyantını kullanmalı
  game.next();
  game.toggleCard('l1q1c3');
  const out2 = game.submit();
  assert.equal(out2.answerText, makeAnswers().irrelevant);
});
