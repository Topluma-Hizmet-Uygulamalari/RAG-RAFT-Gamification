# TEKNİK SÖZLEŞME (SPEC) — Kütüphaneci Robot / RAG Oyunu

Bu dosya tüm modüllerin uyması gereken sözleşmedir. **API imzaları, dosya sahipliği ve global isimler buradan değiştirilmeden kullanılır.** Bir modül başka modülün dosyasına yazamaz.

## 0. Proje özeti

Ortaokul/lise öğrencilerine RAG mantığını öğreten, Türkçe, oyunlaştırılmış web uygulaması.
Oyuncu "Kütüphaneci"dir: Robot'a soru gelir, oyuncu bilgi kartlarından seçip Robot'a verir, Robot YALNIZCA verilen kartlara dayanarak cevap üretir. Yanlış kart → kendinden emin saçmalama (halüsinasyon).

Ayrıntılı ürün fikri: `PROJE-FIKIRLERI.md` (oku).

## 1. Dosya sahipliği

| Modül | Yazdığı dosyalar |
|---|---|
| İçerik | `app/js/content.js` |
| Oyun motoru | `app/js/engine.js`, `tests/engine.test.mjs` |
| Servis katmanı | `app/js/adapters.js` |
| Öğrenci UI | `app/index.html`, `app/css/styles.css`, `app/js/ui.js` |
| Öğretmen | `app/teacher.html`, `app/js/teacher.js`, `app/css/teacher.css` |
| Entegrasyon | `README.md` + diğer dosyalarda uyum düzeltmeleri |
| (hazır) | `app/js/supabase-config.js`, `supabase/migrations/*` — DOKUNMA |

## 2. Teknoloji kuralları

- Saf HTML/CSS/JS (ES2020). Framework yok, build yok, TypeScript yok.
- Tek dış bağımlılık: supabase-js, SADECE şu şekilde:
  `<script defer src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/dist/umd/supabase.min.js"></script>`
  Yüklenemezse (`window.supabase` undefined) uygulama KIRILMAZ — yerel moda düşer.
- `app/index.html` **file:// üzerinden internetsiz açıldığında** oyun tamamen oynanabilir olmalı (Atölye Modu).
- Tüm kullanıcıya görünen metinler Türkçe. Kod yorumları Türkçe ve az.
- Kullanıcı girdisi DOM'a asla `innerHTML` ile basılmaz (`textContent` kullan) — rumuz/sınıf adı XSS kaynağıdır.
- Her JS dosyası `node --check` ile hatasız geçmeli.

## 3. Script yükleme sırası (index.html)

```html
<script defer src="...supabase-js CDN..."></script>
<script defer src="js/supabase-config.js"></script>
<script defer src="js/content.js"></script>
<script defer src="js/engine.js"></script>
<script defer src="js/adapters.js"></script>
<script defer src="js/ui.js"></script>
```
`ui.js` → `DOMContentLoaded` sonrası başlatır.

## 4. Global isimler

- `window.APP_CONFIG` = `{ SUPABASE_URL, SUPABASE_KEY }` (hazır, supabase-config.js)
- `window.CONTENT` (content.js)
- `window.GameEngine` (engine.js)
- `window.Adapters` (adapters.js)
- `window.GameUI` (ui.js — başlatıcı)

## 5. İçerik şeması (content.js)

```js
window.CONTENT = {
  meta: { title: "Kütüphaneci Robot", version: 1 },
  levels: [ Level, ... ] // tam 5 seviye
};
// Level:
{
  id: 1,                       // 1..5
  title: "Doğru Kartı Bul",
  lesson: "Robot kartsız cevap veremez.",   // seviye sonunda gösterilen ders cümlesi
  intro: "2-3 cümlelik Türkçe seviye tanıtımı",
  mechanics: {
    maxPick: 1,                // L5'te 3
    idkEnabled: false,         // L3'te true
    hasCorrect: true           // L3'te false (doğru kart yok!)
  },
  questions: [ Question, ... ] // seviye başına TAM 3 soru
}
// Question:
{
  id: "l1q1",
  question: "Robot'a gelen soru (öğrenci ağzından, Türkçe)",
  cards: [ Card, ... ],        // L1: 4, L2: 5, L3: 4, L4: 4, L5: 8 kart
  essentialCardIds: null,      // SADECE L5'te: tam 3 elemanlı dizi
  answers: {
    correct: "Robotun doğru cevabı (kaynağa dayalı, 1-2 cümle)",
    idk: "Robotun dürüst 'bilmiyorum' cevabı",
    partial: "L5: eksik kart setiyle verilen yarım/yanlış cevap",
    // kartların answerKey'leri için (aşağıya bak):
    distractor: "...", irrelevant: "...", outdated: "..."
  }
}
// Card:
{
  id: "l1q1c1",
  title: "Kart başlığı (kısa)",
  text: "Kart içeriği 1-2 cümle",
  year: 2024,                  // L4'te anlamlı; diğerlerinde null olabilir
  kind: "correct" | "distractor" | "irrelevant" | "outdated" | "essential",
  answerKey: "correct" | "distractor" | "irrelevant" | "outdated",
  // kind==='essential' → answerKey 'correct'
  answer: "OPSİYONEL: bu kart seçilip yanlış çıktığında robotun vereceği karta-özgü cevap. " +
          "Aynı answerKey'den birden fazla kart olan sorularda ZORUNLU sayılır; yoksa robot " +
          "verilmeyen bir kartın içeriğine atıf yapabilir ve RAG benzetmesi delinir."
}
```

İçerik kuralları:
- L3 sorularında `kind:"correct"` kart YOK; doğru hamle "Bilmiyorum de" butonudur.
- L4'te kartlardan biri `outdated` (eski yıl), biri `correct` (güncel yıl); yıllar kart metninde görünür olmalı.
- L5'te 8 karttan tam 3'ü `essential`; `essentialCardIds` bunları listeler.
- Yanlış-cevap varyantları ("distractor"/"irrelevant") KOMİK ama KENDİNDEN EMİN tonda yazılır; asla "sanırım/emin değilim" demez. Ders budur: emin görünmek ≠ doğru olmak.
- Konular 5-8. sınıf müfredatına yakın genel kültür/fen/sosyal (ör. gezegenler, Kurtuluş Savaşı, su döngüsü, İstanbul, vücudumuz); siyaset/din/şiddet yok.

## 6. Oyun motoru API (engine.js)

Saf mantık; DOM, adapter, fetch YOK. Hem tarayıcı (`window.GameEngine`) hem Node (`module.exports`) ortamında çalışır (UMD kalıbı) — testler Node'da koşar.

```js
const game = GameEngine.createGame(content);
game.state  // { screen: 'idle'|'playing'|'levelIntro'|'feedback'|'gameOver',
            //   levelIndex, questionIndex, selectedCardIds: [],
            //   attempt: 1|2, score, perLevel: [{levelId, correctFirstTry, errors, idkUsed}] }
game.start()                       // ilk seviye introsuna geçer
game.beginLevel()                  // introdan ilk soruya
game.toggleCard(cardId)            // seçer/bırakır; maxPick aşılırsa false döner, state değişmez
game.submit()                      // -> Outcome ; seçim boşsa {error:'empty'}
game.sayIDK()                      // -> Outcome ; yalnız idkEnabled seviyede
game.next()                        // feedback sonrası: sonraki soru / seviye introsu / oyun sonu
game.on(event, cb) / game.off(event, cb)
```

`Outcome`:
```js
{
  outcome: 'correct'|'wrong'|'idk_right'|'idk_wrong'|'partial',
  answerText: string,        // robotun söyleyeceği metin (answers'tan motor seçer)
  robotMood: 'happy'|'confident_wrong'|'honest'|'thinking',
  explanation: string,       // neden doğru/yanlış (motor üretir: kart türünden şablonla)
  canRetry: boolean,         // yanlışsa ve attempt===1 ise true
  pointsEarned: number,
  wrongCards: [cardId,...]   // yanlış seçilen kartlar
}
```

Cevap seçimi kuralı: outcome correct → `answers.correct`; idk_right → `answers.idk`; wrong → seçilen İLK yanlış kartın `answer` alanı (varsa), yoksa `answerKey`'ine denk gelen varyant; L5 yanlış set → `answers.partial`.

Puanlama: ilk denemede doğru +100; ikinci denemede doğru +50; L3'te idk_right +100; idk_wrong (doğru kart varken bilmiyorum) 0 puan + açıklama; 2. deneme de yanlışsa 0 puan, doğru cevap gösterilir, `next()` ile devam. Oyun sonu skoru `state.score`.

Olaylar (`emit`): `'statechange'`, `'answer' (Outcome + question + selectedCards)`, `'levelComplete' ({level, lesson})`, `'gameOver' ({score, perLevel})`.

Test dosyası `tests/engine.test.mjs`: `node --test tests/engine.test.mjs` ile koşar (Windows'ta `node --test tests/` biçimi Node 22'de hatalı); en az: maxPick sınırı, L3 idk_right, yanlış→retry→doğru puanlaması, L5 essential set eşleşmesi, oyun sonu skoru.

## 7. Servis katmanı (adapters.js)

```js
// Ortak arayüz (her iki adapter de uygular):
// mode: 'local' | 'supabase'
// async joinClass({joinCode, nickname, grade}) -> {sessionId}  (LocalAdapter'da sahte id üretir)
// async logEvent({level, action, cardId=null, isCorrect=null, payload=null})  // fire-and-forget, UI'ı asla bloklamaz
// async finishSession({score})
// exportCsv() -> tetikler dosya indirme (her iki modda da çalışır; olay günlüğünü CSV yapar)

window.Adapters = {
  createLocal(): LocalAdapter,            // localStorage'a yazar ('rag_events_v1' anahtarı)
  createSupabase(): SupabaseAdapter|null  // window.supabase veya APP_CONFIG yoksa null döner
};
```

SupabaseAdapter: `supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_KEY)`;
RPC çağrıları: `rpc('join_class', {p_join_code, p_nickname, p_grade})` → uuid döner;
`rpc('log_event', {p_session_id, p_level, p_action, p_card_id, p_is_correct, p_payload})`;
`rpc('finish_session', {p_session_id, p_score})`.
Ağ hatasında: olayı localStorage kuyruğuna yaz, sessizce devam et (console.warn yeter); oyun ASLA kırılmaz. `join_class` hatasında kullanıcıya gösterilecek Türkçe mesaj döndür (`invalid_join_code` → "Sınıf kodu bulunamadı").

Olay sözlüğü (DB check'iyle birebir): `action ∈ {'card_pick','submit','idk','level_complete','game_finish'}`.
UI şunları loglar: submit'te seçilen her kart için `card_pick` (isCorrect = kartın doğru/essential olup olmadığı) + bir `submit` (isCorrect = outcome==='correct'||'idk_right'); idk'da `idk`; seviye sonunda `level_complete` (payload {score}); oyun sonunda `game_finish` sonra `finishSession`.

## 8. Öğrenci UI (index.html + ui.js + styles.css)

Ekranlar: **Karşılama** (başlık + 2 buton: "Sınıf Koduyla Katıl" / "Atölye Modu (internetsiz)") → kod ekranında joinCode+rumuz+sınıf (rumuz yanında "Gerçek adını yazma!" uyarısı) → **Seviye intro** → **Soru ekranı** (soru balonu, kart ızgarası, "Robota Ver" butonu, L3'te "Bilmiyorum De" butonu, skor ve seviye göstergesi) → **Robot cevabı** (daktilo efektiyle yazılır, ruh haline göre yüz) → **Seviye sonu** (ders cümlesi + rozet) → **Oyun sonu** (skor, seviye özeti, Atölye Modu'nda "Sonuçları İndir (CSV)" butonu, "Yapay Zekâ Dedektifi" sertifika kartı).

- Robot: elle çizilmiş **inline SVG**, en az 4 yüz ifadesi (mutlu, düşünen, kendinden emin-yanlış, dürüst/utangaç). Düşünürken göz/anten animasyonu (CSS).
- Kartlar tıkla-seç (sürükleme YOK), seçili hâli belirgin; dokunmatik hedefler ≥ 48px; akıllı tahta için büyük yazı (taban 18px+).
- Juice: doğruda konfeti (canvas, kütüphanesiz), yanlışta hafif ekran sarsıntısı, kart→robot uçuş animasyonu, daktilo efekti.
- Tema: tek, aydınlık, çocuk dostu; renkler `:root` CSS değişkenlerinde; `prefers-reduced-motion` desteklenir.
- Supabase kullanılabilir değilse "Sınıf Koduyla Katıl" butonu devre dışı + açıklama; oyun Atölye Modu'yla her koşulda oynanır.

## 9. Öğretmen uygulaması (teacher.html + teacher.js + teacher.css)

Bağımsız sayfa; supabase-js + supabase-config.js + teacher.js + teacher.css yükler. İçerik/engine yüklemez.

- **Giriş/Kayıt:** e-posta+şifre (`signUp`/`signInWithPassword`); "Email not confirmed" hatasında Türkçe yönerge göster. Oturum `onAuthStateChange` ile izlenir.
- **Sınıflarım:** listele (`from('classes').select()` — RLS sayesinde sadece kendi sınıfları), yeni sınıf oluştur (`insert({name, teacher_id: user.id})` → `join_code` DB'de otomatik üretilir), kodu büyük puntoyla göster (tahtaya yazılacak), sınıf sil.
- **Pano (sınıf seçince):** `class_summary` (katılım/bitirme/ort. skor kartları) + `level_error_rates` (seviye başına hata ve "bilmiyorum" kullanımı — saf CSS yatay bar grafik) + `card_traps` (en çok tuzağa düşüren 5 kart, content.js'siz ham card_id gösterilebilir) + oturum listesi (rumuz, sınıf, skor, bitirme) + "CSV indir".
- Tüm sorgular hata yakalar, Türkçe boş-durum mesajları vardır ("Henüz oynayan olmadı").

## 10. Veritabanı (hazır — bilgi amaçlı)

Tablolar: `classes(id, teacher_id, name, join_code, created_at)`, `sessions(id, class_id, nickname, grade, started_at, finished_at, score)`, `events(id, session_id, level, action, card_id, is_correct, payload, ts)`.
Anon'un tablolara doğrudan erişimi YOK; tek kapı üç RPC (bölüm 7). Öğretmen RLS ile sadece kendi verisini görür. View'lar: `class_summary`, `level_error_rates`, `card_traps` (yalnız authenticated).
SQL: `supabase/migrations/`.

## 11. Tanımlar

- **Atölye Modu:** LocalAdapter; internetsiz, file:// ile çalışır; CSV ile veri teslimi.
- **Sınıf Modu:** SupabaseAdapter; sınıf kodu + rumuz; veri canlı DB'ye.
