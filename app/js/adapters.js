// Servis katmanı (SPEC Bölüm 7) — LocalAdapter + SupabaseAdapter
// Oyun motoru veriyi kimin sakladığını bilmez; yalnızca bu arayüzü çağırır.
(function (global) {
  'use strict';

  var STORAGE_KEY = 'rag_events_v1';   // yerel olay günlüğü (Atölye Modu)
  var QUEUE_KEY = 'rag_queue_v1';      // ağ hatasında bekleyen Supabase olayları
  var SESSION_KEY = 'rag_sessions_v1'; // yerel oturum özetleri

  // --- localStorage yardımcıları (her çağrı korumalı; özel pencere vb. kırmaz) ---

  function readList(key) {
    try {
      var raw = global.localStorage.getItem(key);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeList(key, list) {
    try {
      global.localStorage.setItem(key, JSON.stringify(list));
      return true;
    } catch (e) {
      console.warn('adapters: localStorage yazılamadı', e);
      return false;
    }
  }

  function appendTo(key, item) {
    var list = readList(key);
    list.push(item);
    return writeList(key, list);
  }

  // --- CSV üretimi ve indirme ---

  function csvEscape(value) {
    if (value === null || value === undefined) return '';
    var s = typeof value === 'object' ? JSON.stringify(value) : String(value);
    // Formül enjeksiyonuna karşı: Excel'in formül sayacağı başlangıçları etkisizleştir
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    if (/[",;\r\n]/.test(s)) {
      s = '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function buildCsv(rows) {
    var header = ['Oturum', 'Seviye', 'Eylem', 'Kart', 'Doğru mu', 'Ek Veri', 'Zaman'];
    var lines = [header.join(',')];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var dogruMu = '';
      if (r.isCorrect === true) dogruMu = 'evet';
      else if (r.isCorrect === false) dogruMu = 'hayır';
      lines.push([
        csvEscape(r.sessionId),
        csvEscape(r.level),
        csvEscape(r.action),
        csvEscape(r.cardId),
        dogruMu,
        csvEscape(r.payload),
        csvEscape(r.ts)
      ].join(','));
    }
    return lines.join('\r\n');
  }

  function downloadCsv(rows) {
    try {
      // UTF-8 BOM: Excel'in Türkçe karakterleri doğru açması için şart.
      var csv = '﻿' + buildCsv(rows);
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'kutuphaneci-robot-sonuclar.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      return true;
    } catch (e) {
      console.warn('adapters: CSV indirilemedi', e);
      return false;
    }
  }

  function makeEventRow(sessionId, args) {
    args = args || {};
    return {
      sessionId: sessionId,
      level: args.level !== undefined ? args.level : null,
      action: args.action !== undefined ? args.action : null,
      cardId: args.cardId !== undefined ? args.cardId : null,
      isCorrect: args.isCorrect !== undefined ? args.isCorrect : null,
      payload: args.payload !== undefined ? args.payload : null,
      ts: new Date().toISOString()
    };
  }

  function fakeSessionId() {
    return 'yerel-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  // --- LocalAdapter: Atölye Modu (internetsiz, file://) ---

  function createLocal() {
    var sessionId = null;

    function ensureSession() {
      if (!sessionId) sessionId = fakeSessionId();
      return sessionId;
    }

    return {
      mode: 'local',

      joinClass: function (args) {
        args = args || {};
        sessionId = fakeSessionId();
        appendTo(SESSION_KEY, {
          sessionId: sessionId,
          nickname: args.nickname || null,
          grade: args.grade || null,
          startedAt: new Date().toISOString(),
          finishedAt: null,
          score: null
        });
        return Promise.resolve({ sessionId: sessionId });
      },

      // Ateşle-unut: asla reddetmez, UI'ı bloklamaz.
      logEvent: function (args) {
        try {
          appendTo(STORAGE_KEY, makeEventRow(ensureSession(), args));
        } catch (e) {
          console.warn('adapters: olay kaydedilemedi', e);
        }
        return Promise.resolve();
      },

      finishSession: function (args) {
        args = args || {};
        try {
          var id = ensureSession();
          var list = readList(SESSION_KEY);
          var found = false;
          for (var i = 0; i < list.length; i++) {
            if (list[i].sessionId === id) {
              list[i].finishedAt = new Date().toISOString();
              list[i].score = args.score !== undefined ? args.score : null;
              found = true;
            }
          }
          if (!found) {
            list.push({
              sessionId: id,
              nickname: null,
              grade: null,
              startedAt: null,
              finishedAt: new Date().toISOString(),
              score: args.score !== undefined ? args.score : null
            });
          }
          writeList(SESSION_KEY, list);
        } catch (e) {
          console.warn('adapters: oturum kapatılamadı', e);
        }
        return Promise.resolve();
      },

      // Yalnızca geçerli oturumun olaylarını indirir. Oturum ya da olay yoksa
      // eski kayıtlara DÜŞMEZ (ortak okul bilgisayarında önceki sınıfların verisi
      // yanlışlıkla dışarı çıkmasın): yalnız başlık satırlı boş CSV iner ve
      // 'empty' döner — UI bunu kullanıcıya bildirir.
      exportCsv: function () {
        var mine = [];
        if (sessionId) {
          mine = readList(STORAGE_KEY).filter(function (r) {
            return r && r.sessionId === sessionId;
          });
        }
        if (!mine.length) {
          console.warn('adapters: bu oturuma ait olay yok, boş CSV indiriliyor');
          return downloadCsv([]) === false ? false : 'empty';
        }
        return downloadCsv(mine);
      }
    };
  }

  // --- SupabaseAdapter: Sınıf Modu (canlı veri) ---

  function joinErrorMessage(err) {
    var raw = String((err && (err.message || err.details || err.hint)) || err || '');
    if (raw.indexOf('invalid_join_code') !== -1) {
      return 'Sınıf kodu bulunamadı. Tahtadaki kodu kontrol edip tekrar dene.';
    }
    if (/fetch|network|timeout|bağlan/i.test(raw)) {
      return 'Bağlantı kurulamadı. İnternet bağlantını kontrol edip tekrar dene.';
    }
    return 'Sınıfa katılırken bir sorun oluştu. Lütfen tekrar dene.';
  }

  function createSupabase() {
    var cfg = global.APP_CONFIG;
    if (!global.supabase || typeof global.supabase.createClient !== 'function' ||
        !cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_KEY) {
      return null;
    }

    var client;
    try {
      client = global.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);
    } catch (e) {
      console.warn('adapters: Supabase istemcisi oluşturulamadı', e);
      return null;
    }

    var sessionId = null;
    var localLog = []; // CSV için bu oturumun olay kopyası

    // Ağ hatasında olay yerel kuyruğa yazılır; oyun asla kırılmaz.
    function enqueue(row) {
      appendTo(QUEUE_KEY, row);
    }

    function sendEvent(row) {
      return client.rpc('log_event', {
        p_session_id: row.sessionId,
        p_level: row.level,
        p_action: row.action,
        p_card_id: row.cardId,
        p_is_correct: row.isCorrect,
        p_payload: row.payload
      }).then(function (res) {
        if (res && res.error) throw res.error;
      });
    }

    // Kuyrukta bekleyenleri sırayla göndermeyi dener; başaramazsa kuyruğu korur.
    var flushing = false;
    function flushQueue() {
      if (flushing) return;
      var pending = readList(QUEUE_KEY);
      if (!pending.length) return;
      flushing = true;
      writeList(QUEUE_KEY, []);
      var chain = Promise.resolve();
      var failed = [];
      pending.forEach(function (row) {
        chain = chain.then(function () {
          if (failed.length) { failed.push(row); return; }
          // Oturumsuz sıraya girmiş olay: güncel oturuma ata, yoksa at (DB NOT NULL kısıtına takılıp kuyruğu zehirlemesin)
          if (!row.sessionId) {
            if (sessionId) row.sessionId = sessionId;
            else { console.warn('adapters: oturumsuz kuyruk olayı atıldı', row.action); return; }
          }
          return sendEvent(row).catch(function (e) {
            console.warn('adapters: kuyruktaki olay gönderilemedi', e);
            failed.push(row);
          });
        });
      });
      chain.then(function () {
        if (failed.length) writeList(QUEUE_KEY, failed.concat(readList(QUEUE_KEY)));
        flushing = false;
      }).catch(function () {
        writeList(QUEUE_KEY, failed.concat(readList(QUEUE_KEY)));
        flushing = false;
      });
    }

    return {
      mode: 'supabase',

      joinClass: function (args) {
        args = args || {};
        return client.rpc('join_class', {
          p_join_code: args.joinCode,
          p_nickname: args.nickname,
          p_grade: args.grade
        }).then(function (res) {
          if (res && res.error) throw res.error;
          sessionId = res.data;
          if (!sessionId) throw new Error('invalid_join_code');
          flushQueue();
          return { sessionId: sessionId };
        }).catch(function (err) {
          // UI'ın doğrudan gösterebileceği Türkçe mesaj.
          throw new Error(joinErrorMessage(err));
        });
      },

      // Ateşle-unut: hemen çözülen promise döner, asla reddetmez.
      logEvent: function (args) {
        try {
          var row = makeEventRow(sessionId, args);
          localLog.push(row);
          if (!sessionId) {
            enqueue(row);
            return Promise.resolve();
          }
          sendEvent(row).then(function () {
            flushQueue();
          }).catch(function (e) {
            console.warn('adapters: olay gönderilemedi, kuyruğa alındı', e);
            enqueue(row);
          });
        } catch (e) {
          console.warn('adapters: olay kaydedilemedi', e);
        }
        return Promise.resolve();
      },

      finishSession: function (args) {
        args = args || {};
        if (!sessionId) return Promise.resolve();
        return client.rpc('finish_session', {
          p_session_id: sessionId,
          p_score: args.score !== undefined ? args.score : null
        }).then(function (res) {
          if (res && res.error) throw res.error;
        }).catch(function (e) {
          console.warn('adapters: oturum kapatılamadı', e);
        });
      },

      exportCsv: function () {
        return downloadCsv(localLog);
      }
    };
  }

  global.Adapters = {
    createLocal: createLocal,
    createSupabase: createSupabase
  };
})(typeof window !== 'undefined' ? window : globalThis);
