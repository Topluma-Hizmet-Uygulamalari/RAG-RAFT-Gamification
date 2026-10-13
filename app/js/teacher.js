// Öğretmen paneli: giriş/kayıt, sınıf yönetimi ve pano.
// Kullanıcıdan veya DB'den gelen hiçbir metin innerHTML ile basılmaz.
(function () {
  'use strict';

  var sb = null;              // Supabase istemcisi
  var currentUser = null;
  var currentClass = null;
  var currentView = '';
  var dash = { summary: null, levels: [], traps: [], sessions: [] };

  function $(id) { return document.getElementById(id); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined && text !== null) { node.textContent = text; }
    return node;
  }

  function setMsg(id, text, kind) {
    var node = $(id);
    node.textContent = text || '';
    node.className = 'form-msg' + (kind ? ' ' + kind : '');
  }

  function showView(name) {
    currentView = name;
    var views = ['auth', 'classes', 'dashboard'];
    for (var i = 0; i < views.length; i++) {
      $('view-' + views[i]).classList.toggle('hidden', views[i] !== name);
    }
  }

  function fmtDate(iso) {
    if (!iso) { return '—'; }
    try {
      return new Date(iso).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
    } catch (e) {
      return String(iso);
    }
  }

  // ---- Başlatma ----

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    if (!window.supabase || !window.APP_CONFIG || !window.APP_CONFIG.SUPABASE_URL) {
      var g = $('global-error');
      g.textContent = 'Bağlantı kitaplığı yüklenemedi. Öğretmen paneli internet bağlantısı gerektirir; bağlantınızı kontrol edip sayfayı yenileyin.';
      g.classList.remove('hidden');
      return;
    }

    sb = window.supabase.createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_KEY);

    bindEvents();

    // Oturum takibi: giriş/çıkışta görünüm değişir.
    sb.auth.onAuthStateChange(function (_event, session) {
      currentUser = session ? session.user : null;
      updateTopbar();
      if (!currentUser) {
        currentClass = null;
        showView('auth');
      } else if (currentView === '' || currentView === 'auth') {
        showView('classes');
        loadClasses();
      }
    });
  }

  function bindEvents() {
    $('auth-form').addEventListener('submit', function (e) {
      e.preventDefault();
      handleLogin();
    });
    $('btn-signup').addEventListener('click', handleSignup);
    $('btn-logout').addEventListener('click', handleLogout);
    $('create-class-form').addEventListener('submit', function (e) {
      e.preventDefault();
      handleCreateClass();
    });
    $('btn-back').addEventListener('click', function () {
      currentClass = null;
      showView('classes');
      loadClasses();
    });
    $('btn-csv').addEventListener('click', downloadCsv);
  }

  function updateTopbar() {
    $('topbar-user').classList.toggle('hidden', !currentUser);
    $('user-email').textContent = currentUser && currentUser.email ? currentUser.email : '';
  }

  // ---- Giriş / Kayıt ----

  function trAuthError(error) {
    var m = error && error.message ? error.message : '';
    if (m.indexOf('Email not confirmed') !== -1) {
      return 'E-posta adresiniz henüz doğrulanmamış. Gelen kutunuza (ve spam klasörüne) gönderilen doğrulama bağlantısına tıklayın, sonra tekrar giriş yapın.';
    }
    if (m.indexOf('Invalid login credentials') !== -1) { return 'E-posta veya şifre hatalı.'; }
    if (m.indexOf('already registered') !== -1) { return 'Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.'; }
    if (m.indexOf('Password should be') !== -1) { return 'Şifre en az 6 karakter olmalı.'; }
    if (m.indexOf('valid email') !== -1 || m.indexOf('invalid format') !== -1) { return 'Geçerli bir e-posta adresi girin.'; }
    if (m.indexOf('rate limit') !== -1 || m.indexOf('Too many') !== -1) { return 'Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.'; }
    if (m.indexOf('Failed to fetch') !== -1 || m.indexOf('NetworkError') !== -1) { return 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.'; }
    return 'İşlem başarısız oldu: ' + m;
  }

  function readAuthForm() {
    var email = $('auth-email').value.trim();
    var password = $('auth-password').value;
    if (!email || !password) {
      setMsg('auth-msg', 'E-posta ve şifre alanlarını doldurun.', 'error');
      return null;
    }
    if (password.length < 6) {
      setMsg('auth-msg', 'Şifre en az 6 karakter olmalı.', 'error');
      return null;
    }
    return { email: email, password: password };
  }

  function setAuthBusy(busy) {
    $('btn-login').disabled = busy;
    $('btn-signup').disabled = busy;
  }

  async function handleLogin() {
    var creds = readAuthForm();
    if (!creds) { return; }
    setAuthBusy(true);
    setMsg('auth-msg', 'Giriş yapılıyor…');
    try {
      var res = await sb.auth.signInWithPassword(creds);
      if (res.error) {
        setMsg('auth-msg', trAuthError(res.error), 'error');
      } else {
        setMsg('auth-msg', '');
      }
    } catch (err) {
      setMsg('auth-msg', trAuthError(err), 'error');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignup() {
    var creds = readAuthForm();
    if (!creds) { return; }
    setAuthBusy(true);
    setMsg('auth-msg', 'Kayıt yapılıyor…');
    try {
      var res = await sb.auth.signUp(creds);
      if (res.error) {
        setMsg('auth-msg', trAuthError(res.error), 'error');
      } else if (res.data && res.data.user && !res.data.session) {
        setMsg('auth-msg', 'Kayıt alındı. E-postanıza gönderilen doğrulama bağlantısına tıklayın, sonra bu sayfadan giriş yapın.', 'ok');
      } else {
        setMsg('auth-msg', 'Kayıt tamamlandı, giriş yapıldı.', 'ok');
      }
    } catch (err) {
      setMsg('auth-msg', trAuthError(err), 'error');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    try {
      await sb.auth.signOut();
    } catch (err) {
      console.warn('Çıkış hatası:', err);
    }
  }

  // ---- Sınıflarım ----

  async function loadClasses() {
    var list = $('class-list');
    list.textContent = '';
    setMsg('classes-msg', 'Sınıflar yükleniyor…');
    try {
      var res = await sb.from('classes')
        .select('id, name, join_code, created_at')
        .order('created_at', { ascending: false });
      if (res.error) { throw res.error; }
      setMsg('classes-msg', '');
      renderClasses(res.data || []);
    } catch (err) {
      console.warn('Sınıf listesi hatası:', err);
      setMsg('classes-msg', 'Sınıflar yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.', 'error');
    }
  }

  function renderClasses(classes) {
    var list = $('class-list');
    list.textContent = '';
    if (classes.length === 0) {
      list.appendChild(el('p', 'empty-msg', 'Henüz sınıfınız yok. Yukarıdan ilk sınıfınızı oluşturun; öğrencileriniz sınıf koduyla katılacak.'));
      return;
    }
    classes.forEach(function (cls) {
      var card = el('div', 'class-card');

      var info = el('div', 'class-card-info');
      info.appendChild(el('p', 'class-card-name', cls.name));
      info.appendChild(el('p', 'class-card-date', 'Oluşturulma: ' + fmtDate(cls.created_at)));
      card.appendChild(info);

      card.appendChild(el('span', 'class-card-code', cls.join_code));

      var actions = el('div', 'class-card-actions');
      var btnOpen = el('button', 'btn btn-primary', 'Panoyu Aç');
      btnOpen.type = 'button';
      btnOpen.addEventListener('click', function () { openDashboard(cls); });
      actions.appendChild(btnOpen);

      var btnDel = el('button', 'btn btn-danger', 'Sil');
      btnDel.type = 'button';
      btnDel.addEventListener('click', function () { handleDeleteClass(cls); });
      actions.appendChild(btnDel);

      card.appendChild(actions);
      list.appendChild(card);
    });
  }

  async function handleCreateClass() {
    var input = $('new-class-name');
    var name = input.value.trim();
    if (!name) {
      setMsg('classes-msg', 'Sınıf adı boş olamaz.', 'error');
      return;
    }
    $('btn-create-class').disabled = true;
    setMsg('classes-msg', 'Sınıf oluşturuluyor…');
    try {
      var res = await sb.from('classes')
        .insert({ name: name, teacher_id: currentUser.id })
        .select('id, name, join_code, created_at')
        .single();
      if (res.error) { throw res.error; }
      input.value = '';
      setMsg('classes-msg', '«' + res.data.name + '» oluşturuldu. Sınıf kodu: ' + res.data.join_code, 'ok');
      loadClasses();
    } catch (err) {
      console.warn('Sınıf oluşturma hatası:', err);
      setMsg('classes-msg', 'Sınıf oluşturulamadı. Lütfen tekrar deneyin.', 'error');
    } finally {
      $('btn-create-class').disabled = false;
    }
  }

  async function handleDeleteClass(cls) {
    var ok = window.confirm('«' + cls.name + '» sınıfını silmek istediğinize emin misiniz? Bu sınıfa ait tüm oturum ve olay verileri de silinir.');
    if (!ok) { return; }
    try {
      var res = await sb.from('classes').delete().eq('id', cls.id);
      if (res.error) { throw res.error; }
      setMsg('classes-msg', '«' + cls.name + '» silindi.', 'ok');
      loadClasses();
    } catch (err) {
      console.warn('Sınıf silme hatası:', err);
      setMsg('classes-msg', 'Sınıf silinemedi. Lütfen tekrar deneyin.', 'error');
    }
  }

  // ---- Pano ----

  function openDashboard(cls) {
    currentClass = cls;
    dash = { summary: null, levels: [], traps: [], sessions: [] };
    showView('dashboard');
    $('dash-class-name').textContent = cls.name;
    $('dash-join-code').textContent = cls.join_code;
    $('summary-cards').textContent = '';
    $('chart-errors').textContent = '';
    $('chart-idk').textContent = '';
    $('traps').textContent = '';
    $('sessions').textContent = '';
    $('btn-csv').disabled = true;
    setMsg('dash-msg', 'Pano verileri yükleniyor…');
    loadDashboard(cls.id);
  }

  async function loadDashboard(classId) {
    var results = await Promise.all([
      sb.from('class_summary').select('*').eq('class_id', classId).maybeSingle(),
      sb.from('level_error_rates').select('*').eq('class_id', classId).order('level'),
      sb.from('card_traps').select('*').eq('class_id', classId).order('wrong_picks', { ascending: false }).limit(5),
      sb.from('sessions').select('id, nickname, grade, started_at, finished_at, score')
        .eq('class_id', classId).order('started_at', { ascending: false })
    ].map(function (p) {
      return Promise.resolve(p).catch(function (err) { return { data: null, error: err }; });
    }));

    if (!currentClass || currentClass.id !== classId) { return; } // bu arada sayfa değişti

    var failed = results.some(function (r) { return r.error; });
    results.forEach(function (r) { if (r.error) { console.warn('Pano sorgu hatası:', r.error); } });
    setMsg('dash-msg', failed ? 'Bazı pano verileri yüklenemedi. Sayfayı yenileyip tekrar deneyin.' : '', failed ? 'error' : '');

    dash.summary = results[0].data || null;
    dash.levels = results[1].data || [];
    dash.traps = results[2].data || [];
    dash.sessions = results[3].data || [];

    renderSummary();
    renderErrorChart();
    renderIdkChart();
    renderTraps();
    renderSessions();
    $('btn-csv').disabled = dash.sessions.length === 0;
  }

  function statTile(label, value) {
    var tile = el('div', 'stat-tile');
    tile.appendChild(el('p', 'stat-label', label));
    tile.appendChild(el('p', 'stat-value', value));
    return tile;
  }

  function renderSummary() {
    var wrap = $('summary-cards');
    wrap.textContent = '';
    var s = dash.summary;
    var total = s ? Number(s.total_sessions) || 0 : 0;
    var finished = s ? Number(s.finished_sessions) || 0 : 0;
    var avg = s && s.avg_score !== null && s.avg_score !== undefined ? String(s.avg_score) : '—';
    wrap.appendChild(statTile('Katılan öğrenci', String(total)));
    wrap.appendChild(statTile('Oyunu bitiren', String(finished)));
    wrap.appendChild(statTile('Ortalama skor', avg));
  }

  // 1..5 seviyelerini doldurur; view yalnız olaylı seviyeleri döndürür.
  function levelRows() {
    var byLevel = {};
    dash.levels.forEach(function (r) { byLevel[r.level] = r; });
    var rows = [];
    for (var lv = 1; lv <= 5; lv++) {
      var r = byLevel[lv] || {};
      rows.push({
        level: lv,
        attempts: Number(r.attempts) || 0,
        errors: Number(r.errors) || 0,
        idk: Number(r.idk_count) || 0
      });
    }
    return rows;
  }

  function barRow(labelText, widthPct, fillClass, valueText) {
    var row = el('div', 'bar-row');
    row.appendChild(el('span', 'bar-label', labelText));
    var track = el('div', 'bar-track');
    var fill = el('div', 'bar-fill ' + fillClass);
    fill.style.width = Math.max(0, Math.min(100, widthPct)) + '%';
    track.appendChild(fill);
    row.appendChild(track);
    row.appendChild(el('span', 'bar-value', valueText));
    return row;
  }

  function renderErrorChart() {
    var wrap = $('chart-errors');
    wrap.textContent = '';
    var rows = levelRows();
    var anyAttempt = rows.some(function (r) { return r.attempts > 0; });
    if (!anyAttempt) {
      wrap.appendChild(el('p', 'empty-msg', 'Henüz oynayan olmadı.'));
      return;
    }
    rows.forEach(function (r) {
      var rate = r.attempts > 0 ? Math.round((r.errors / r.attempts) * 100) : 0;
      var value = r.attempts > 0 ? '%' + rate + ' (' + r.errors + '/' + r.attempts + ')' : 'veri yok';
      wrap.appendChild(barRow('Seviye ' + r.level, rate, 'err', value));
    });
  }

  function renderIdkChart() {
    var wrap = $('chart-idk');
    wrap.textContent = '';
    var rows = levelRows();
    var max = rows.reduce(function (m, r) { return Math.max(m, r.idk); }, 0);
    if (max === 0) {
      wrap.appendChild(el('p', 'empty-msg', 'Henüz «Bilmiyorum» kullanılmadı.'));
      return;
    }
    rows.forEach(function (r) {
      wrap.appendChild(barRow('Seviye ' + r.level, (r.idk / max) * 100, 'idk', r.idk + ' kez'));
    });
  }

  function renderTraps() {
    var wrap = $('traps');
    wrap.textContent = '';
    if (dash.traps.length === 0) {
      wrap.appendChild(el('p', 'empty-msg', 'Henüz tuzağa düşen olmadı.'));
      return;
    }
    var tableWrap = el('div', 'table-wrap');
    var table = el('table');
    var thead = el('thead');
    var headRow = el('tr');
    ['#', 'Kart', 'Seviye', 'Yanlış seçim'].forEach(function (h) {
      headRow.appendChild(el('th', null, h));
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = el('tbody');
    dash.traps.forEach(function (t, i) {
      var tr = el('tr');
      tr.appendChild(el('td', 'num', String(i + 1)));
      var tdCard = el('td');
      tdCard.appendChild(el('code', 'card-id', t.card_id));
      tr.appendChild(tdCard);
      tr.appendChild(el('td', 'num', String(t.level)));
      tr.appendChild(el('td', 'num', String(t.wrong_picks)));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrap.appendChild(tableWrap);
  }

  function renderSessions() {
    var wrap = $('sessions');
    wrap.textContent = '';
    if (dash.sessions.length === 0) {
      wrap.appendChild(el('p', 'empty-msg', 'Henüz oynayan olmadı. Öğrencileriniz oyuna sınıf koduyla katıldığında burada görünecek.'));
      return;
    }
    var tableWrap = el('div', 'table-wrap');
    var table = el('table');
    var thead = el('thead');
    var headRow = el('tr');
    ['Rumuz', 'Sınıf düzeyi', 'Skor', 'Durum', 'Başlangıç'].forEach(function (h) {
      headRow.appendChild(el('th', null, h));
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = el('tbody');
    dash.sessions.forEach(function (s) {
      var tr = el('tr');
      tr.appendChild(el('td', null, s.nickname));
      tr.appendChild(el('td', 'num', s.grade !== null && s.grade !== undefined ? s.grade + '. sınıf' : '—'));
      tr.appendChild(el('td', 'num', s.score !== null && s.score !== undefined ? String(s.score) : '—'));
      tr.appendChild(el('td', s.finished_at ? 'status-done' : 'status-open', s.finished_at ? 'Bitirdi' : 'Tamamlamadı'));
      tr.appendChild(el('td', null, fmtDate(s.started_at)));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrap.appendChild(tableWrap);
  }

  // ---- CSV (UTF-8 BOM) ----

  function csvCell(v) {
    var s = v === null || v === undefined ? '' : String(v);
    // Formül enjeksiyonuna karşı: rumuz öğrenci girdisidir, '=' ile başlarsa Excel'de formül çalışır
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    if (/[",;\r\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function downloadCsv() {
    if (!currentClass) { return; }
    var rows = [['rumuz', 'sinif_duzeyi', 'skor', 'durum', 'baslangic', 'bitis']];
    dash.sessions.forEach(function (s) {
      rows.push([
        s.nickname,
        s.grade === null || s.grade === undefined ? '' : s.grade,
        s.score === null || s.score === undefined ? '' : s.score,
        s.finished_at ? 'bitirdi' : 'tamamlamadi',
        s.started_at || '',
        s.finished_at || ''
      ]);
    });
    var csv = rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
    var blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sinif-' + (currentClass.join_code || 'sonuclar') + '-sonuclar.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
})();
