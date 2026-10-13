# Kütüphaneci Robot — RAG Oyunu

> **Topluma Hizmet Uygulamaları (THU) dersi projesi.**
> Ortaokul ve lise öğrencilerine RAG (Retrieval-Augmented Generation) mantığını ve yapay zekâ
> okuryazarlığını, teknik terim kullanmadan, oyunlaştırılmış bir web uygulamasıyla öğretir.

## Proje nedir?

Oyuncu bir **Kütüphaneci**dir. Okulun asistan robotuna öğrencilerden sorular gelir; robot
hiçbir şeyi "ezbere" bilmez, **yalnızca oyuncunun eline verdiği bilgi kartlarına** dayanarak
cevap üretir. Doğru kartı verirsen doğru cevap, yanlış kartı verirsen **kendinden emin ama
komik bir saçmalama** (halüsinasyon) alırsın. Böylece oyuncu, gerçek yapay zekâ sistemlerindeki
"retrieval" katmanının ta kendisi olur ve şu dersi yaşayarak öğrenir:

> **"Yapay zekâ cevap vermeden önce doğru bilgiyi bulmak zorunda — bulamazsa ya da yanlış bulursa saçmalar."**

5 seviye, her biri RAG'ın bir gerçeğini öğretir:

| Seviye | Mekanik | Öğrettiği ders | Teknik karşılığı |
|---|---|---|---|
| 1 — Doğru Kartı Bul | 4 kart, biri doğru | Robot kartsız cevap veremez | Retrieval |
| 2 — Çeldirici Kartlar | Konuyla ilgili *görünen* kartlar | Benzerlik ≠ doğruluk | Semantik benzerlik tuzağı |
| 3 — Doğru Kart Yok! | Cevap kartlarda yok; doğru hamle "Bilmiyorum De" | "Bilmiyorum" demek dürüstlüktür | Halüsinasyon / grounding |
| 4 — Eski Bilgi Tuzağı | İki "doğru" kart, biri eski tarihli | Kaynağın tarihine bak | Güncellik (freshness) |
| 5 — Kart Limiti | 8 karttan en kritik 3'ünü seç | Bellek sınırlı, seçim ustalıktır | Context window |

**Topluma hizmet bağlamı:** Oyun tamamen simülasyondur; gerçek bir yapay zekâ modeline
bağlanmaz. Ücretsizdir, okul ağından bağımsız internetsiz çalışır ve Atölye Modu'nda hiçbir
öğrenci verisi cihaz dışına çıkmaz (KVKK açısından temiz). Sınıf Modu'nda bile öğrenciden
yalnızca **rumuz** istenir — arayüz "Gerçek adını yazma!" diye uyarır. Atölye kurgusu, analog
açılış ve "Yapay Zekâ Dedektifi" sertifikası için `PROJE-FIKIRLERI.md` dosyasına bakın.

## Klasör yapısı

```
THU-Rag/
├── app/
│   ├── index.html            # Öğrenci oyunu (çift tıkla, internetsiz çalışır)
│   ├── teacher.html          # Öğretmen paneli (internet gerektirir)
│   ├── analog.html           # Yazdırılabilir analog kart seti (atölye açılışı)
│   ├── sertifika.html        # "Yapay Zekâ Dedektifi" sertifikası (A4 yatay)
│   ├── css/
│   │   ├── styles.css        # Oyun teması (aydınlık, çocuk dostu, 18px+ taban)
│   │   └── teacher.css       # Panel teması
│   └── js/
│       ├── content.js        # İÇERİK: 5 seviye, 15 soru, 75 kart (yalnızca veri)
│       ├── engine.js         # OYUN MOTORU: saf mantık, DOM'suz (Node'da da çalışır)
│       ├── adapters.js       # SERVİS KATMANI: LocalAdapter + SupabaseAdapter
│       ├── ui.js             # ÖĞRENCİ ARAYÜZÜ: ekranlar, robot, animasyonlar
│       ├── teacher.js        # ÖĞRETMEN PANELİ: giriş, sınıflar, pano
│       └── supabase-config.js# Supabase URL + publishable key
├── docs/
│   ├── ATOLYE-PLANI.md       # 40 dakikalık atölye akışı, replikler, B planları
│   ├── OLCME-TESTI.md        # Ön/son test soruları, cevap anahtarı, rubrik
│   └── RAPOR-TASLAK.md       # Topluma Hizmet dersi final raporu iskeleti
├── supabase/
│   └── migrations/           # Veritabanı şeması + RLS + RPC'ler (SQL)
├── tests/
│   ├── engine.test.mjs       # Motor birim testleri (node --test)
│   └── content.check.mjs     # İçerik duman testi (şema/kural doğrulama)
├── SPEC.md                   # Teknik sözleşme — tüm modüller buna uyar
└── PROJE-FIKIRLERI.md        # Ürün fikri ve atölye kurgusu
```

## Katmanlı mimari

Saf HTML/CSS/JS (ES2020). Framework yok, build adımı yok. Tek dış bağımlılık supabase-js
(CDN'den `defer` ile yüklenir; yüklenemezse uygulama kırılmaz, yerel moda düşer).

```
┌──────────────────────────────┐  ┌──────────────────────────────┐
│   SUNUM — Öğrenci            │  │   SUNUM — Öğretmen           │
│   index.html + ui.js         │  │   teacher.html + teacher.js  │
│   (ekranlar, robot, juice)   │  │   (giriş, sınıflar, pano)    │
└───────┬───────────┬──────────┘  └──────────────┬───────────────┘
        │           │                            │
        ▼           ▼                            │
┌───────────────┐ ┌──────────────────┐           │
│ ALAN MANTIĞI  │ │ İÇERİK           │           │
│ engine.js     │ │ content.js       │           │
│ saf mantık;   │ │ yalnız veri;     │           │
│ DOM/fetch YOK │ │ kod içermez      │           │
└───────┬───────┘ └──────────────────┘           │
        │ olaylar (answer, levelComplete, ...)   │
        ▼                                        │
┌──────────────────────────────┐                 │
│ SERVİS KATMANI  adapters.js  │                 │
│ ortak arayüz: joinClass /    │                 │
│ logEvent / finishSession /   │                 │
│ exportCsv                    │                 │
│ ┌──────────┐ ┌─────────────┐ │                 │
│ │ Local    │ │ Supabase    │ │                 │
│ │ Adapter  │ │ Adapter     │ │                 │
│ │ (locale  │ │ (RPC + ağ   │ │                 │
│ │ Storage) │ │ kuyruğu)    │ │                 │
│ └──────────┘ └──────┬──────┘ │                 │
└─────────────────────┼────────┘                 │
                      ▼                          ▼
             ┌─────────────────────────────────────────┐
             │ VERİ — Supabase (PostgreSQL + Auth + RLS)│
             │ classes / sessions / events              │
             │ RPC: join_class, log_event,              │
             │      finish_session (anon'un tek kapısı) │
             │ View: class_summary, level_error_rates,  │
             │       card_traps (yalnız authenticated)  │
             └─────────────────────────────────────────┘
```

Katman kuralları:

- **engine.js** DOM, fetch ve adapter bilmez; hem tarayıcıda (`window.GameEngine`) hem
  Node'da (`module.exports`) çalışır — testler bu sayede Node'da koşar.
- **ui.js** motoru olaylar üzerinden dinler, telemetriyi adapter'a "ateşle-unut" yollar;
  ağ hatası oyunu **asla** kırmaz (olaylar localStorage kuyruğuna yazılır).
- **content.js** yalnızca veridir; yeni soru eklemek kod değiştirmek değildir (aşağıya bak).
- Kullanıcı girdisi DOM'a asla `innerHTML` ile basılmaz (`textContent`) — XSS koruması.

## Yerelde çalıştırma (Atölye Modu)

Kurulum yok: **`app/index.html` dosyasına çift tıkla.** İnternet olmadan, `file://`
üzerinden tamamen oynanabilir.

1. Açılışta **"Atölye Modu (internetsiz)"** butonuna bas.
2. 5 seviyeyi oyna; oyun sonunda **"Sonuçları İndir (CSV)"** ile olay günlüğünü al
   (Excel'de Türkçe karakterlerle açılır; atölye raporu için veri kaynağıdır).

İnternet varsa **"Sınıf Koduyla Katıl"** ile Sınıf Modu'na geçilir: öğretmenin tahtaya
yazdığı 6 haneli kod + rumuz + sınıf düzeyi girilir, veriler canlı olarak öğretmenin
panosuna düşer.

### Testler

```bash
node --test                      # 15 motor birim testi (tests/engine.test.mjs)
node tests/content.check.mjs     # içerik duman testi (şema + seviye kuralları)
```

> Not: Windows'ta `node --test tests/` biçimi Node'un bilinen bir aksaklığına takılabilir;
> `node --test` (kök dizinden) veya `node --test tests/engine.test.mjs` kullanın.

## Öğretmen paneli kullanımı

`app/teacher.html` internet gerektirir (Supabase'e bağlanır). Akış:

1. **Kayıt / Giriş:** E-posta + şifre ile "Kayıt Ol" (Supabase e-posta doğrulaması açıksa
   gelen kutunuzdaki bağlantıya tıklayıp sonra giriş yapın).
2. **Sınıf oluştur:** Sınıf adını yazın (örn. "7-A Fen Bilimleri"). Veritabanı otomatik olarak
   6 haneli bir **sınıf kodu** üretir.
3. **Kodu tahtaya yazın:** Panoda kod büyük puntoyla görünür; öğrenciler oyunda
   "Sınıf Koduyla Katıl" diyerek bu kodla bağlanır.
4. **Pano:** Katılan/bitiren öğrenci sayısı ve ortalama skor; seviye başına hata oranı ve
   "Bilmiyorum" kullanımı (bar grafikler); en çok tuzağa düşüren 5 kart; oturum listesi
   (rumuz, sınıf düzeyi, skor, durum) ve **CSV İndir**.

RLS (satır düzeyi güvenlik) sayesinde her öğretmen yalnızca **kendi** sınıflarını ve verisini görür.

## Supabase kurulumu (özet)

Canlı proje hazır ve `app/js/supabase-config.js` içinde tanımlıdır. Sıfırdan kurmak için:

1. [supabase.com](https://supabase.com) üzerinde yeni bir proje açın.
2. `supabase/migrations/` altındaki SQL dosyalarını **sırayla** SQL Editor'de çalıştırın
   (veya `supabase db push` ile uygulayın):
   - `001_initial_schema_rag_game.sql` — tablolar (`classes`, `sessions`, `events`),
     RLS politikaları, `join_class` / `log_event` / `finish_session` RPC'leri,
     pano view'ları (`class_summary`, `level_error_rates`, `card_traps`).
   - `002_harden_function_grants.sql` — fonksiyon yetkilerinin sıkılaştırılması.
3. Project Settings → API'den **URL** ve **publishable key**'i alıp
   `app/js/supabase-config.js` içine yazın.

Güvenlik modeli: anonim (öğrenci) tarafın tablolara doğrudan erişimi **yoktur**; tek kapı üç
RPC'dir. Publishable key istemciye gömülmek için tasarlanmıştır; asıl koruma RLS'dedir.

## İçerik ekleme rehberi (content.js)

Tüm sorular `app/js/content.js` içindedir; kod değil **veri** eklersiniz. Soru nesnesi:

```js
{
  id: "l2q4",                        // benzersiz: l<seviye>q<soru>
  question: "Robot'a gelen soru (öğrenci ağzından, Türkçe)",
  cards: [
    {
      id: "l2q4c1",                  // benzersiz: ...c<kart>
      title: "Kart başlığı (kısa)",
      text: "Kart içeriği 1-2 cümle",
      year: null,                    // L4'te anlamlı; diğerlerinde null olabilir
      kind: "correct",               // correct | distractor | irrelevant | outdated | essential
      answerKey: "correct"           // kind essential/correct ise "correct", yoksa kind ile aynı
    },
    // ...
  ],
  essentialCardIds: null,            // SADECE L5'te: tam 3 elemanlı kart id dizisi
  answers: {
    correct: "Robotun doğru cevabı (kaynağa dayalı, 1-2 cümle)",
    idk: "Robotun dürüst 'bilmiyorum' cevabı",
    partial: "L5: eksik kart setiyle verilen yarım cevap",   // yalnız L5 zorunlu
    distractor: "...", irrelevant: "...", outdated: "..."    // karttaki answerKey'ler için
  }
}
```

Kurallar (ayrıntılar `SPEC.md` Bölüm 5'te):

- Seviye başına **tam 3 soru**; kart sayıları: L1 4, L2 5, L3 4, L4 4, L5 8.
- **L3**'te `kind:"correct"` kart olmaz (doğru hamle "Bilmiyorum De"dir).
- **L4**'te bir `outdated` (eski yıl) ve bir `correct` (güncel yıl) kart bulunur;
  yıllar kart **metninde** görünür olmalıdır.
- **L5**'te 8 karttan tam 3'ü `essential`dır ve `essentialCardIds` bunları listeler.
- Yanlış-cevap varyantları **komik ama kendinden emin** tonda yazılır; asla
  "sanırım / emin değilim" demez. Ders budur: emin görünmek ≠ doğru olmak.
- Konular 5-8. sınıf müfredatına yakın genel kültür/fen/sosyal; siyaset/din/şiddet yok.

Ekledikten sonra doğrulayın: `node tests/content.check.mjs`

## GitHub Pages'e yayın

Depo → **Settings → Pages → Deploy from a branch** → branch `main`, klasör `/ (root)`.
Yayın adresleri:

- Oyun: `https://<kullanıcı-veya-organizasyon>.github.io/<repo>/app/`
- Öğretmen paneli: `https://<kullanıcı-veya-organizasyon>.github.io/<repo>/app/teacher.html`

Notlar:

- Build adımı olmadığı için ek yapılandırma gerekmez; tüm yollar görelidir.
- Supabase panelinde **Authentication → URL Configuration** kısmına Pages adresini eklemek,
  öğretmen kayıt e-postalarındaki doğrulama bağlantılarının doğru sayfaya dönmesini sağlar.
- Oyun Pages üzerinden açılsa bile Atölye Modu internetsiz mantıkla (localStorage + CSV) çalışmaya devam eder.


## Bilinen eksikler ve notlar

- Atölye Modu CSV'si yalnızca geçerli oturumun olaylarını indirir; oturuma ait kayıt yoksa başlık satırlı boş CSV iner ve ekranda bildirim gösterilir.
- Öğrenci akışı (sınıf koduyla katılım, olay yazma, oturum kapatma, limitler, pano view'ları) canlı Supabase üzerinde API ile uçtan uca test edildi ve geçti (2026-10-13). Öğretmen tarafının tarayıcı akışı (kayıt → onay maili → giriş → pano) ilk kullanım öncesi bir kez elle denenmelidir.
- Öğretmen kaydında e-posta onayı AÇIKTIR: kayıt sonrası gelen maildeki bağlantı tıklanmadan giriş yapılamaz. Hızlı deneme için Supabase panelinde Authentication → Sign In/Up → "Confirm email" kapatılabilir.
- Veritabanında duman testinden kalan "DUMAN TESTİ SINIFI" kaydı ve `thu.rag.smoketest@gmail.com` test hesabı durmaktadır; Supabase panelinden silinebilir.
