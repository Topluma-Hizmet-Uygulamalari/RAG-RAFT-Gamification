/* ui.js — Öğrenci arayüzü (SPEC Bölüm 8). Motoru ve adapterleri SPEC imzalarıyla kullanır. */
(function () {
  'use strict';

  // ---- modül durumu ----
  var game = null;
  var adapter = null;
  var mode = null; // 'local' | 'supabase'
  var nickname = 'Kütüphaneci';
  var showingFeedback = false;
  var lastContext = null;       // { levelIndex, questionIndex } — submit/idk anında
  var lastWrongCards = [];
  var renderedQuestionKey = '';
  var busy = false;
  var typingTimer = null;
  var typingDone = null;
  var typingFullText = '';
  var typingEl = null;
  var toastTimer = null;

  function $(id) { return document.getElementById(id); }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // ---- güvenli adapter çağrıları (oyun asla kırılmaz) ----
  function logSafe(ev) {
    if (!adapter || typeof adapter.logEvent !== 'function') return;
    try {
      var p = adapter.logEvent(ev);
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) { /* sessiz */ }
  }

  // ---- içerik yardımcıları ----
  function levels() { return (window.CONTENT && window.CONTENT.levels) || []; }
  function levelAt(i) { return levels()[i] || null; }
  function currentLevel() { return game ? levelAt(game.state.levelIndex) : null; }
  function currentQuestion() {
    var lv = currentLevel();
    if (!lv || !game) return null;
    return lv.questions[game.state.questionIndex] || null;
  }
  function findCardIn(question, cardId) {
    if (!question || !question.cards) return null;
    for (var i = 0; i < question.cards.length; i++) {
      if (question.cards[i].id === cardId) return question.cards[i];
    }
    return null;
  }

  // ---- ekran / görünüm geçişleri ----
  var SCREENS = ['welcome', 'join', 'game'];
  var VIEWS = ['intro', 'question', 'feedback', 'levelend', 'gameover'];

  function showScreen(name) {
    SCREENS.forEach(function (s) {
      var el = $('screen-' + s);
      if (el) el.hidden = (s !== name);
    });
    var topbar = $('topbar');
    if (topbar) topbar.hidden = (name !== 'game');
  }

  function showView(name) {
    VIEWS.forEach(function (v) {
      var el = $('view-' + v);
      if (el) el.hidden = (v !== name);
    });
  }

  // ---- robot ----
  var MOODS = { happy: 1, thinking: 1, confident_wrong: 1, honest: 1 };

  function mountRobots() {
    var tpl = $('robot-template');
    if (!tpl || !tpl.content) return;
    ['welcome-robot', 'robot-stage'].forEach(function (id) {
      var holder = $(id);
      if (holder && !holder.firstElementChild) {
        holder.appendChild(tpl.content.cloneNode(true));
      }
    });
  }

  function setMood(mood) {
    var m = MOODS[mood] ? mood : 'happy';
    var robots = document.querySelectorAll('.robot');
    for (var i = 0; i < robots.length; i++) robots[i].setAttribute('data-mood', m);
  }

  function robotSay(text) {
    stopTyping();
    var el = $('robot-bubble');
    if (el) {
      el.classList.remove('typing-caret');
      el.textContent = text;
    }
  }

  // ---- daktilo efekti ----
  function stopTyping() {
    if (typingTimer) { clearInterval(typingTimer); typingTimer = null; }
    typingDone = null; typingEl = null; typingFullText = '';
  }

  function finishTyping() {
    if (!typingTimer) return;
    var el = typingEl, text = typingFullText, done = typingDone;
    stopTyping();
    if (el) { el.textContent = text; el.classList.remove('typing-caret'); }
    if (done) done();
  }

  function typeText(el, text, done) {
    stopTyping();
    if (!el) { if (done) done(); return; }
    if (reducedMotion()) { el.textContent = text; if (done) done(); return; }
    el.textContent = '';
    el.classList.add('typing-caret');
    typingEl = el; typingFullText = text; typingDone = done;
    var i = 0;
    typingTimer = setInterval(function () {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        var cb = typingDone;
        stopTyping();
        el.classList.remove('typing-caret');
        if (cb) cb();
      }
    }, 24);
  }

  // ---- juice: konfeti (kütüphanesiz), sarsıntı, kart uçuşu ----
  var confettiParticles = [];
  var confettiRaf = null;
  var CONFETTI_COLORS = ['#4F6DF5', '#FFB800', '#2EB872', '#F05B5B', '#8FA7F2', '#F8A5A5'];

  function sizeConfettiCanvas() {
    var c = $('confetti-canvas');
    if (!c) return null;
    if (c.width !== window.innerWidth) c.width = window.innerWidth;
    if (c.height !== window.innerHeight) c.height = window.innerHeight;
    return c;
  }

  function launchConfetti(count) {
    if (reducedMotion()) return;
    var c = sizeConfettiCanvas();
    if (!c) return;
    for (var i = 0; i < (count || 120); i++) {
      confettiParticles.push({
        x: Math.random() * c.width,
        y: -20 - Math.random() * c.height * 0.3,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 3.5,
        size: 6 + Math.random() * 7,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25
      });
    }
    if (!confettiRaf) confettiRaf = requestAnimationFrame(confettiStep);
  }

  function confettiStep() {
    var c = sizeConfettiCanvas();
    if (!c) { confettiRaf = null; return; }
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    var alive = [];
    for (var i = 0; i < confettiParticles.length; i++) {
      var p = confettiParticles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.rot += p.vr;
      if (p.y < c.height + 30) {
        alive.push(p);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }
    confettiParticles = alive;
    if (confettiParticles.length) {
      confettiRaf = requestAnimationFrame(confettiStep);
    } else {
      ctx.clearRect(0, 0, c.width, c.height);
      confettiRaf = null;
    }
  }

  function shakeScreen() {
    if (reducedMotion()) return;
    var el = $('main');
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth; // animasyonu sıfırla
    el.classList.add('shake');
  }

  function flyCardsToRobot(cardIds, done) {
    if (reducedMotion()) { done(); return; }
    var robotEl = document.querySelector('#robot-stage .robot');
    var grid = $('card-grid');
    if (!robotEl || !grid) { done(); return; }
    var target = robotEl.getBoundingClientRect();
    var tx = target.left + target.width / 2;
    var ty = target.top + target.height / 2;
    var flew = 0;
    cardIds.forEach(function (id, idx) {
      var el = null;
      var all = grid.querySelectorAll('.card');
      for (var i = 0; i < all.length; i++) {
        if (all[i].getAttribute('data-card-id') === id) { el = all[i]; break; }
      }
      if (!el) return;
      var r = el.getBoundingClientRect();
      var clone = el.cloneNode(true);
      clone.classList.add('card-fly');
      clone.style.left = r.left + 'px';
      clone.style.top = r.top + 'px';
      clone.style.width = r.width + 'px';
      clone.style.height = r.height + 'px';
      document.body.appendChild(clone);
      void clone.offsetWidth;
      var dx = tx - (r.left + r.width / 2);
      var dy = ty - (r.top + r.height / 2);
      clone.style.transitionDelay = (idx * 60) + 'ms';
      clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.15) rotate(10deg)';
      clone.style.opacity = '0';
      flew += 1;
      setTimeout(function () {
        if (clone.parentNode) clone.parentNode.removeChild(clone);
      }, 800 + idx * 60);
    });
    setTimeout(done, flew ? 650 : 0);
  }

  // ---- bildirim ----
  function toast(msg) {
    var el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2400);
  }

  function fatal(msg) {
    var el = $('fatal');
    if (el) { el.textContent = msg; el.hidden = false; }
  }

  // ---- üst bar ----
  function updateTopbar() {
    if (!game) return;
    var s = game.state;
    var lv = levelAt(s.levelIndex);
    var lvlEl = $('topbar-level');
    if (lvlEl) {
      lvlEl.textContent = (s.screen === 'gameOver' || !lv)
        ? 'Bitti!'
        : 'Seviye ' + lv.id + ' / ' + levels().length;
    }
    var scoreEl = $('topbar-score');
    if (scoreEl) {
      var yeni = String(s.score);
      if (scoreEl.textContent !== yeni) {
        scoreEl.textContent = yeni;
        scoreEl.classList.remove('bump');
        void scoreEl.offsetWidth;
        scoreEl.classList.add('bump');
      }
    }
  }

  // ---- görünümler ----
  function renderIntro() {
    var lv = currentLevel();
    if (!lv) return;
    $('intro-level-chip').textContent = 'Seviye ' + lv.id + ' / ' + levels().length;
    $('intro-title').textContent = lv.title;
    $('intro-text').textContent = lv.intro;
    var hints = $('intro-hints');
    hints.textContent = '';
    var m = lv.mechanics || {};
    var maxPick = m.maxPick || 1;
    var li = document.createElement('li');
    li.textContent = maxPick > 1
      ? 'Bu seviyede Robot\'a en fazla ' + maxPick + ' kart verebilirsin.'
      : 'Robot\'a yalnızca 1 kart verebilirsin, iyi seç!';
    hints.appendChild(li);
    if (m.idkEnabled) {
      var li2 = document.createElement('li');
      li2.textContent = 'Yeni buton: "Bilmiyorum De" — bazen en dürüst cevap budur.';
      hints.appendChild(li2);
    }
    setMood('happy');
    robotSay('Yeni seviye! Hazır mısın? Soruları birlikte çözelim.');
  }

  function renderQuestion(force) {
    if (!game) return;
    var s = game.state;
    var lv = currentLevel();
    var q = currentQuestion();
    if (!lv || !q) return;
    var key = s.levelIndex + ':' + s.questionIndex + ':' + s.attempt;
    if (!force && key === renderedQuestionKey) { syncSelection(); return; }
    renderedQuestionKey = key;

    setMood('thinking');
    robotSay(s.attempt === 2
      ? 'Kütüphaneci, bu kart soruyu cevaplamıyor diyor. Bana başka bir kart ver!'
      : 'Bu soruya cevap vermem için bana doğru kartı ver!');

    $('question-text').textContent = q.question;
    $('attempt-chip').hidden = (s.attempt !== 2);

    var grid = $('card-grid');
    grid.textContent = '';
    q.cards.forEach(function (card) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card';
      btn.setAttribute('data-card-id', card.id);

      var t = document.createElement('span');
      t.className = 'card-title';
      t.textContent = card.title;
      btn.appendChild(t);

      var x = document.createElement('span');
      x.className = 'card-text';
      x.textContent = card.text;
      btn.appendChild(x);

      if (card.year !== null && card.year !== undefined) {
        var y = document.createElement('span');
        y.className = 'card-year';
        y.textContent = 'Yıl: ' + card.year;
        btn.appendChild(y);
      }
      if (lastWrongCards.indexOf(card.id) !== -1) btn.classList.add('card-wrong');

      btn.addEventListener('click', function () { onCardClick(card.id); });
      grid.appendChild(btn);
    });

    var m = lv.mechanics || {};
    $('btn-idk').hidden = !m.idkEnabled;
    syncSelection();
  }

  function syncSelection() {
    if (!game) return;
    var s = game.state;
    var lv = currentLevel();
    var maxPick = (lv && lv.mechanics && lv.mechanics.maxPick) || 1;
    var sel = s.selectedCardIds || [];
    var grid = $('card-grid');
    if (grid) {
      var all = grid.querySelectorAll('.card');
      for (var i = 0; i < all.length; i++) {
        var id = all[i].getAttribute('data-card-id');
        all[i].classList.toggle('selected', sel.indexOf(id) !== -1);
      }
    }
    var info = $('pick-info');
    if (info) info.textContent = 'Seçilen kart: ' + sel.length + ' / ' + maxPick;
    var btn = $('btn-submit');
    if (btn) btn.disabled = (sel.length === 0);
  }

  function renderLevelEnd(levelIndex) {
    var lv = levelAt(levelIndex);
    if (!lv) { if (game) game.next(); return; }
    $('levelend-title').textContent = 'Seviye ' + lv.id + ' Tamamlandı!';
    $('level-lesson').textContent = lv.lesson;
    setMood('happy');
    robotSay('Bunu birlikte başardık! Rozeti hak ettin.');
    showView('levelend');
    launchConfetti(60);
  }

  function renderGameOver(data) {
    var s = game ? game.state : { score: 0, perLevel: [] };
    var score = (data && typeof data.score === 'number') ? data.score : s.score;
    var perLevel = (data && data.perLevel) || s.perLevel || [];

    $('final-score').textContent = String(score);

    var sum = $('level-summary');
    sum.textContent = '';
    perLevel.forEach(function (p) {
      var lv = null;
      for (var i = 0; i < levels().length; i++) {
        if (levels()[i].id === p.levelId) { lv = levels()[i]; break; }
      }
      var row = document.createElement('div');
      row.className = 'summary-row';
      var title = document.createElement('span');
      title.className = 'sum-title';
      title.textContent = 'Seviye ' + p.levelId + (lv ? ' — ' + lv.title : '');
      var stats = document.createElement('span');
      stats.className = 'sum-stats';
      stats.textContent = 'İlk denemede doğru: ' + (p.correctFirstTry || 0) +
        ' · Hata: ' + (p.errors || 0) +
        ' · Bilmiyorum: ' + (p.idkUsed || 0);
      row.appendChild(title);
      row.appendChild(stats);
      sum.appendChild(row);
    });

    // sertifika (rumuz yalnız textContent ile basılır)
    $('cert-name').textContent = nickname;
    $('cert-score').textContent = score + ' puan';
    $('cert-date').textContent = new Date().toLocaleDateString('tr-TR');

    $('btn-csv').hidden = (mode !== 'local');

    setMood('happy');
    robotSay('Harikaydın! Artık gerçek bir Yapay Zekâ Dedektifisin.');
    showView('gameover');
    launchConfetti(180);
  }

  // ---- motor olayları ----
  function onStateChange() {
    if (!game) return;
    updateTopbar();
    var scr = game.state.screen;
    if (scr === 'levelIntro') {
      showingFeedback = false;
      lastWrongCards = [];
      renderedQuestionKey = '';
      renderIntro();
      showView('intro');
    } else if (scr === 'playing') {
      if (!showingFeedback) {
        renderQuestion(false);
        showView('question');
      }
    } else if (scr === 'gameOver') {
      showingFeedback = false;
      renderGameOver(null);
    }
    // 'feedback' ekranını showOutcome yönetir
  }

  // Telemetri: SPEC Bölüm 7 olay sözlüğü
  function onAnswerEvent(data) {
    if (!data || !adapter) return;
    var oc = (typeof data.outcome === 'string') ? data.outcome
      : (data.outcome && data.outcome.outcome);
    if (!oc) return;
    var lv = currentLevel();
    var levelId = lv ? lv.id : null;
    var q = data.question || currentQuestion();
    var selected = data.selectedCards || [];

    if (oc === 'idk_right' || oc === 'idk_wrong') {
      logSafe({ level: levelId, action: 'idk', cardId: null, isCorrect: oc === 'idk_right' });
      return;
    }
    selected.forEach(function (c) {
      var card = (typeof c === 'string') ? findCardIn(q, c) : c;
      if (!card) return;
      logSafe({
        level: levelId,
        action: 'card_pick',
        cardId: card.id,
        isCorrect: card.kind === 'correct' || card.kind === 'essential'
      });
    });
    logSafe({
      level: levelId,
      action: 'submit',
      cardId: null,
      isCorrect: oc === 'correct' || oc === 'idk_right'
    });
  }

  function onLevelComplete(data) {
    var levelId = null;
    if (data && data.level) {
      levelId = (typeof data.level === 'object') ? data.level.id : data.level;
    } else {
      var lv = currentLevel();
      levelId = lv ? lv.id : null;
    }
    logSafe({
      level: levelId,
      action: 'level_complete',
      cardId: null,
      isCorrect: null,
      payload: { score: game ? game.state.score : 0 }
    });
  }

  function onGameOverEvent(data) {
    var score = (data && typeof data.score === 'number') ? data.score : (game ? game.state.score : 0);
    var lastLv = levels().length ? levels()[levels().length - 1] : null;
    logSafe({
      level: lastLv ? lastLv.id : null,
      action: 'game_finish',
      cardId: null,
      isCorrect: null,
      payload: { score: score }
    });
    if (adapter && typeof adapter.finishSession === 'function') {
      try {
        var p = adapter.finishSession({ score: score });
        if (p && typeof p.catch === 'function') p.catch(function () {});
      } catch (e) { /* sessiz */ }
    }
  }

  // ---- oyuncu eylemleri ----
  function onCardClick(cardId) {
    if (!game || busy || showingFeedback) return;
    var ok = game.toggleCard(cardId);
    if (ok === false) {
      var lv = currentLevel();
      var maxPick = (lv && lv.mechanics && lv.mechanics.maxPick) || 1;
      toast('En fazla ' + maxPick + ' kart seçebilirsin! Önce bir kartı bırak.');
      return;
    }
    syncSelection();
  }

  function onSubmit() {
    if (!game || busy || showingFeedback) return;
    var sel = (game.state.selectedCardIds || []).slice();
    if (!sel.length) { toast('Önce en az bir kart seç!'); return; }
    lastContext = { levelIndex: game.state.levelIndex, questionIndex: game.state.questionIndex };
    var out = game.submit();
    if (!out || out.error) { toast('Önce en az bir kart seç!'); return; }
    busy = true;
    updateTopbar();
    flyCardsToRobot(sel, function () {
      busy = false;
      showOutcome(out);
    });
  }

  function onIdk() {
    if (!game || busy || showingFeedback) return;
    lastContext = { levelIndex: game.state.levelIndex, questionIndex: game.state.questionIndex };
    var out = game.sayIDK();
    if (!out || out.error) return;
    updateTopbar();
    showOutcome(out);
  }

  function showOutcome(out) {
    showingFeedback = true;
    lastWrongCards = out.wrongCards || [];
    showView('feedback');
    $('feedback-panel').hidden = true;
    setMood('thinking');
    robotSay('Hmm, kartlara bakıyorum...');

    var delay = reducedMotion() ? 0 : 700;
    setTimeout(function () {
      setMood(out.robotMood || 'happy');
      var kazandi = (out.outcome === 'correct' || out.outcome === 'idk_right');
      if (kazandi) launchConfetti(110);
      else shakeScreen();

      typeText($('robot-bubble'), out.answerText || '', function () {
        var panel = $('feedback-panel');
        var pts = $('feedback-points');
        var puan = out.pointsEarned || 0;
        pts.textContent = puan > 0 ? '+' + puan + ' puan!' : '+0 puan';
        pts.classList.toggle('points-win', puan > 0);
        $('feedback-explanation').textContent = out.explanation || '';
        $('btn-retry').hidden = !out.canRetry;
        $('btn-next').hidden = !!out.canRetry;
        panel.hidden = false;
        updateTopbar();
      });
    }, delay);
  }

  function isLastQuestionOfLevel(ctx) {
    if (!ctx) return false;
    var lv = levelAt(ctx.levelIndex);
    return !!lv && ctx.questionIndex === lv.questions.length - 1;
  }

  function onRetry() {
    showingFeedback = false;
    // Motoru 'feedback' ekranından çıkarır: next() retry dalı attempt=2 yapar,
    // statechange ile soru yeniden çizilir. (Doğrudan render etmek motoru kilitliyordu.)
    if (game) game.next();
  }

  function onNext() {
    showingFeedback = false;
    lastWrongCards = [];
    if (isLastQuestionOfLevel(lastContext)) {
      renderLevelEnd(lastContext.levelIndex);
    } else if (game) {
      game.next();
    }
  }

  function onLevelEndNext() {
    if (game) game.next();
  }

  // ---- oyun başlatma ----
  function startGame() {
    if (!window.GameEngine || typeof window.GameEngine.createGame !== 'function') {
      fatal('Oyun motoru yüklenemedi. Sayfayı yenilemeyi dene.');
      return;
    }
    game = window.GameEngine.createGame(window.CONTENT);
    game.on('statechange', onStateChange);
    game.on('answer', onAnswerEvent);
    game.on('levelComplete', onLevelComplete);
    game.on('gameOver', onGameOverEvent);
    showScreen('game');
    game.start();
    onStateChange();
  }

  function startWorkshop() {
    mode = 'local';
    nickname = 'Kütüphaneci';
    adapter = window.Adapters.createLocal();
    try {
      var p = adapter.joinClass({ joinCode: 'ATOLYE', nickname: nickname, grade: null });
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) { /* yerel modda sorun olmaz */ }
    startGame();
  }

  function showJoinError(msg) {
    var el = $('join-error');
    el.textContent = msg;
    el.hidden = false;
  }

  function onJoinSubmit(e) {
    e.preventDefault();
    $('join-error').hidden = true;

    var code = $('inp-code').value.trim().toUpperCase();
    var nick = $('inp-nick').value.trim();
    var gradeVal = $('inp-grade').value;
    if (!code) { showJoinError('Sınıf kodunu yaz. (Öğretmenin tahtaya yazdığı kod.)'); return; }
    if (!nick) { showJoinError('Kendine bir rumuz seç. Gerçek adını yazma!'); return; }

    adapter = window.Adapters.createSupabase();
    if (!adapter) {
      showJoinError('Sınıf servisine ulaşılamıyor. Atölye Modu ile oynayabilirsin.');
      return;
    }

    var btn = $('btn-join-submit');
    btn.disabled = true;
    btn.textContent = 'Bağlanılıyor...';

    Promise.resolve()
      .then(function () {
        return adapter.joinClass({
          joinCode: code,
          nickname: nick,
          grade: gradeVal ? Number(gradeVal) : null
        });
      })
      .then(function (res) {
        if (!res || !res.sessionId) {
          var msg = (res && (res.error || res.message)) || 'Sınıf kodu bulunamadı.';
          throw new Error(String(msg));
        }
        mode = 'supabase';
        nickname = nick;
        startGame();
      })
      .catch(function (err) {
        showJoinError((err && err.message) ? err.message : 'Bağlantı kurulamadı. Tekrar dene.');
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = 'Katıl';
      });
  }

  function onCsvExport() {
    if (!adapter || typeof adapter.exportCsv !== 'function') return;
    try {
      var out = adapter.exportCsv();
      if (out === false) toast('CSV indirilemedi. Tekrar dene.');
      else if (out === 'empty') toast('Bu oturuma ait kayıt yok; yalnız başlık satırı indirildi.');
    }
    catch (e) { toast('CSV indirilemedi. Tekrar dene.'); }
  }

  // ---- başlatıcı ----
  function init() {
    if (init._started) return;
    init._started = true;

    if (!window.CONTENT || !window.GameEngine || !window.Adapters) {
      fatal('Oyun dosyaları eksik yüklendi. Sayfayı yenile; sorun sürerse dosyaların tam kopyalandığından emin ol.');
      return;
    }

    mountRobots();
    setMood('happy');

    // Supabase yoksa Sınıf Modu kapalı — Atölye Modu her koşulda açık
    var online = !!(window.supabase && window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL);
    if (!online) {
      $('btn-join-class').disabled = true;
      $('join-disabled-note').hidden = false;
    }

    $('btn-join-class').addEventListener('click', function () {
      showScreen('join');
      $('inp-code').focus();
    });
    $('btn-workshop').addEventListener('click', startWorkshop);
    $('btn-join-back').addEventListener('click', function () { showScreen('welcome'); });
    $('join-form').addEventListener('submit', onJoinSubmit);
    $('btn-begin-level').addEventListener('click', function () { if (game) game.beginLevel(); });
    $('btn-submit').addEventListener('click', onSubmit);
    $('btn-idk').addEventListener('click', onIdk);
    $('btn-retry').addEventListener('click', onRetry);
    $('btn-next').addEventListener('click', onNext);
    $('btn-level-next').addEventListener('click', onLevelEndNext);
    $('btn-csv').addEventListener('click', onCsvExport);
    $('btn-restart').addEventListener('click', function () { window.location.reload(); });

    // daktiloyu tıklayınca bitir
    $('robot-bubble').addEventListener('click', finishTyping);

    window.addEventListener('resize', sizeConfettiCanvas);
    sizeConfettiCanvas();

    showScreen('welcome');
  }

  window.GameUI = { init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
