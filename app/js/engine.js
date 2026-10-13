/* Oyun motoru — saf mantık. DOM, fetch, adapter, timer YOK. (SPEC Bölüm 6) */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GameEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Kart türüne göre Türkçe açıklama şablonları
  var KIND_EXPLANATIONS = {
    correct: 'Doğru kartı buldun! Robot cevabını bu kaynağa dayandırdı.',
    essential: 'Doğru kartı buldun! Robot cevabını bu kaynağa dayandırdı.',
    distractor: 'Bu kart konuyla ilgili görünüyor ama sorunun cevabını içermiyor.',
    irrelevant: 'Bu kartın soruyla hiçbir ilgisi yok; yine de Robot kendinden emin konuştu. Emin görünmek doğru olmak değildir!',
    outdated: 'Bu karttaki bilgi eski tarihli. Kaynağın yılına her zaman dikkat et!'
  };

  var EXPLANATIONS = {
    correctSingle: function (card) {
      return KIND_EXPLANATIONS.correct;
    },
    correctSet: 'En önemli kartların hepsini seçtin; Robot eksiksiz ve doğru bir cevap verdi.',
    idkRight: "Kartların hiçbirinde cevap yoktu ve Robot dürüstçe \"bilmiyorum\" dedi. Bilmediğini söylemek bir başarıdır!",
    idkWrong: 'Aslında kartların arasında doğru cevap vardı. "Bilmiyorum" demeden önce kartlara bir kez daha bakmalıydın.',
    partial: 'Seçtiğin kart seti eksik ya da yanlıştı; Robot elindeki kartlarla ancak böyle bir cevap üretebildi.'
  };

  function createGame(content) {
    if (!content || !Array.isArray(content.levels) || content.levels.length === 0) {
      throw new Error('Geçersiz içerik: levels dizisi gerekli.');
    }

    var levels = content.levels;

    var state = {
      screen: 'idle',
      levelIndex: 0,
      questionIndex: 0,
      selectedCardIds: [],
      attempt: 1,
      score: 0,
      perLevel: levels.map(function (lvl) {
        return { levelId: lvl.id, correctFirstTry: 0, errors: 0, idkUsed: 0 };
      })
    };

    var listeners = {};      // event -> [cb, ...]
    var lastOutcome = null;  // next() için son sonucu hatırla

    function on(event, cb) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);
    }

    function off(event, cb) {
      if (!listeners[event]) return;
      var i = listeners[event].indexOf(cb);
      if (i !== -1) listeners[event].splice(i, 1);
    }

    function emit(event, payload) {
      var cbs = listeners[event];
      if (!cbs) return;
      cbs.slice().forEach(function (cb) { cb(payload); });
    }

    function emitState() { emit('statechange', state); }

    function currentLevel() { return levels[state.levelIndex]; }
    function currentQuestion() { return currentLevel().questions[state.questionIndex]; }
    function currentStats() { return state.perLevel[state.levelIndex]; }

    function findCard(question, cardId) {
      for (var i = 0; i < question.cards.length; i++) {
        if (question.cards[i].id === cardId) return question.cards[i];
      }
      return null;
    }

    function isCorrectCard(card) {
      return card.kind === 'correct' || card.kind === 'essential';
    }

    function sameSet(a, b) {
      if (a.length !== b.length) return false;
      return a.every(function (x) { return b.indexOf(x) !== -1; });
    }

    // --- API ---

    function start() {
      if (state.screen !== 'idle') return;
      state.levelIndex = 0;
      state.questionIndex = 0;
      state.attempt = 1;
      state.selectedCardIds = [];
      state.screen = 'levelIntro';
      emitState();
    }

    function beginLevel() {
      if (state.screen !== 'levelIntro') return;
      state.questionIndex = 0;
      state.attempt = 1;
      state.selectedCardIds = [];
      state.screen = 'playing';
      emitState();
    }

    function toggleCard(cardId) {
      if (state.screen !== 'playing') return false;
      var question = currentQuestion();
      if (!findCard(question, cardId)) return false;
      var idx = state.selectedCardIds.indexOf(cardId);
      if (idx !== -1) {
        state.selectedCardIds.splice(idx, 1);
      } else {
        var maxPick = currentLevel().mechanics.maxPick;
        if (state.selectedCardIds.length >= maxPick) return false; // sınır aşımı: state değişmez
        state.selectedCardIds.push(cardId);
      }
      emitState();
      return true;
    }

    // Ortak sonuç kapanışı: puan, ekran, olaylar
    function resolveOutcome(outcome, question, selectedCards) {
      lastOutcome = outcome;
      state.score += outcome.pointsEarned;
      state.screen = 'feedback';
      emit('answer', {
        outcome: outcome.outcome,
        answerText: outcome.answerText,
        robotMood: outcome.robotMood,
        explanation: outcome.explanation,
        canRetry: outcome.canRetry,
        pointsEarned: outcome.pointsEarned,
        wrongCards: outcome.wrongCards,
        question: question,
        selectedCards: selectedCards
      });
      emitState();
      return outcome;
    }

    function submit() {
      if (state.screen !== 'playing') return { error: 'not_playing' };
      if (state.selectedCardIds.length === 0) return { error: 'empty' };

      var level = currentLevel();
      var question = currentQuestion();
      var selectedCards = state.selectedCardIds.map(function (id) {
        return findCard(question, id);
      });
      var stats = currentStats();
      var firstTry = state.attempt === 1;
      var outcome;

      if (Array.isArray(question.essentialCardIds)) {
        // L5 tarzı: seçilen set, essential set ile birebir eşleşmeli
        if (sameSet(state.selectedCardIds, question.essentialCardIds)) {
          outcome = {
            outcome: 'correct',
            answerText: question.answers.correct,
            robotMood: 'happy',
            explanation: EXPLANATIONS.correctSet,
            canRetry: false,
            pointsEarned: firstTry ? 100 : 50,
            wrongCards: []
          };
          if (firstTry) stats.correctFirstTry += 1;
        } else {
          var wrongInSet = state.selectedCardIds.filter(function (id) {
            return question.essentialCardIds.indexOf(id) === -1;
          });
          stats.errors += 1;
          var canRetryP = firstTry;
          outcome = {
            outcome: 'partial',
            answerText: question.answers.partial,
            robotMood: 'confident_wrong',
            explanation: EXPLANATIONS.partial +
              (canRetryP ? ' Bir hakkın daha var: en önemli kartları yeniden seç.' :
                ' Doğru cevap: ' + question.answers.correct),
            canRetry: canRetryP,
            pointsEarned: 0,
            wrongCards: wrongInSet
          };
        }
      } else {
        var allCorrect = selectedCards.every(isCorrectCard);
        if (level.mechanics.hasCorrect && allCorrect) {
          outcome = {
            outcome: 'correct',
            answerText: question.answers.correct,
            robotMood: 'happy',
            explanation: EXPLANATIONS.correctSingle(selectedCards[0]),
            canRetry: false,
            pointsEarned: firstTry ? 100 : 50,
            wrongCards: []
          };
          if (firstTry) stats.correctFirstTry += 1;
        } else {
          // Yanlış: seçilen İLK yanlış kartın answerKey'ine denk gelen varyant
          var firstWrong = null;
          var wrongIds = [];
          selectedCards.forEach(function (card) {
            if (!isCorrectCard(card)) {
              if (!firstWrong) firstWrong = card;
              wrongIds.push(card.id);
            }
          });
          stats.errors += 1;
          var canRetryW = firstTry;
          outcome = {
            outcome: 'wrong',
            answerText: firstWrong.answer || question.answers[firstWrong.answerKey],
            robotMood: 'confident_wrong',
            explanation: (KIND_EXPLANATIONS[firstWrong.kind] || EXPLANATIONS.partial) +
              (canRetryW ? ' Bir hakkın daha var: başka bir kart dene.' :
                (level.mechanics.hasCorrect ? ' Doğru cevap: ' + question.answers.correct :
                  ' Bu soruda doğru kart yoktu; doğru hamle "Bilmiyorum De" idi.')),
            canRetry: canRetryW,
            pointsEarned: 0,
            wrongCards: wrongIds
          };
        }
      }

      return resolveOutcome(outcome, question, selectedCards);
    }

    function sayIDK() {
      if (state.screen !== 'playing') return { error: 'not_playing' };
      var level = currentLevel();
      if (!level.mechanics.idkEnabled) return { error: 'idk_disabled' };

      var question = currentQuestion();
      var selectedCards = state.selectedCardIds.map(function (id) {
        return findCard(question, id);
      });
      var stats = currentStats();
      stats.idkUsed += 1;
      var outcome;

      if (!level.mechanics.hasCorrect) {
        outcome = {
          outcome: 'idk_right',
          answerText: question.answers.idk,
          robotMood: 'honest',
          explanation: EXPLANATIONS.idkRight,
          canRetry: false,
          pointsEarned: 100,
          wrongCards: []
        };
      } else {
        // Doğru kart varken "bilmiyorum": 0 puan + açıklama
        stats.errors += 1;
        outcome = {
          outcome: 'idk_wrong',
          answerText: question.answers.idk,
          robotMood: 'honest',
          explanation: EXPLANATIONS.idkWrong + ' Doğru cevap: ' + question.answers.correct,
          canRetry: false,
          pointsEarned: 0,
          wrongCards: []
        };
      }

      return resolveOutcome(outcome, question, selectedCards);
    }

    function next() {
      if (state.screen !== 'feedback') return;

      if (lastOutcome && lastOutcome.canRetry) {
        // Aynı soruya ikinci deneme
        lastOutcome = null;
        state.attempt = 2;
        state.selectedCardIds = [];
        state.screen = 'playing';
        emitState();
        return;
      }

      lastOutcome = null;
      var level = currentLevel();

      if (state.questionIndex < level.questions.length - 1) {
        state.questionIndex += 1;
        state.attempt = 1;
        state.selectedCardIds = [];
        state.screen = 'playing';
        emitState();
        return;
      }

      // Seviye bitti
      emit('levelComplete', { level: level, lesson: level.lesson });

      if (state.levelIndex < levels.length - 1) {
        state.levelIndex += 1;
        state.questionIndex = 0;
        state.attempt = 1;
        state.selectedCardIds = [];
        state.screen = 'levelIntro';
        emitState();
        return;
      }

      // Oyun bitti
      state.screen = 'gameOver';
      emit('gameOver', { score: state.score, perLevel: state.perLevel });
      emitState();
    }

    return {
      state: state,
      start: start,
      beginLevel: beginLevel,
      toggleCard: toggleCard,
      submit: submit,
      sayIDK: sayIDK,
      next: next,
      on: on,
      off: off
    };
  }

  return { createGame: createGame };
}));
