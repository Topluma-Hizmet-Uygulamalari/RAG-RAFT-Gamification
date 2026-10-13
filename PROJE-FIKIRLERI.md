# RAG Oyunlaştırma Projesi — Fikir Dokümanı

> Topluma Hizmet Uygulamaları dersi projesi
> Hedef: Ortaokul/lise öğrencilerine RAG (Retrieval-Augmented Generation) mantığını oyunlaştırılmış mekaniklerle öğretmek ve yapay zekâ okuryazarlığı kazandırmak.

## Temel İlke

Her şey tek kavram etrafında dönüyor:

> **"Yapay zekâ cevap vermeden önce doğru bilgiyi bulmak zorunda — bulamazsa ya da yanlış bulursa saçmalar."**

Bütün oyun mekanikleri, atölye kurgusu ve ölçüm bu cümleye hizmet eder.

## Alınan Kararlar

- **RAFT kapsam dışı.** RAG'ı anlamadan anlam ifade etmeyen ikinci katman bir kavram; kafa karışıklığı riski kazancından büyük. Açık kitap sınavı benzetmesi istenirse RAFT adı anılmadan tek bir bonus ekran olarak eklenebilir.
- **Tek oyunu parlat:** Dört vasat mini oyun yerine bir tane çok iyi oyun (Kütüphaneci Robot). Chunking/embedding oyunları zaman kalırsa eklenir.
- **Hedef kitle: ortaokula göre tasarla.** Ortaokul için anlaşılır olan lisede de çalışır; tersi doğru değil.
- **Tamamen simüle, tek HTML dosyası, internetsiz çalışır.** Gerçek modele bağlantı yok: ücretsiz, okul ağından bağımsız, KVKK açısından temiz (öğrenci verisi hiçbir yere gitmiyor — raporda artı puan).
- **Akıllı tahta uyumu:** Sürükle-bırak yerine (veya yanında) "tıkla-seç, tıkla-yerleştir" mekaniği.

## Çerçeve (Oyunun Hikâyesi)

1. **Kütüphaneci Robot (ana oyun):** Robot okulun yeni asistanı, öğrencilerin sorularını cevaplıyor. Ama kütüphanedeki bilgi kartlarını ona **oyuncu** veriyor — yani oyuncu "retrieval" katmanının ta kendisi oluyor.
2. **Haber Muhabiri (ileri seviye bölüm):** Robot haber yazacak, oyuncu arşivden belge seçiyor. Yanlış/eski belge → yanlış haber. Dezenformasyon ve medya okuryazarlığına bağlanır; topluma hizmet raporunda güçlü durur.
3. **Hastane/Eczane asistanı (B planı):** "Yanlış bilgi neye mal olur" hissini en sert veren tema, ama ortaokul için fazla ağır olabilir. Yedekte dursun.

## Oyun Mekaniği — 5 Seviyeli Zorluk Eğrisi

Tek oyun, her seviye RAG'ın bir gerçeğini öğretir. Teknik terimlerin hiçbirinin adı geçmez:

| Seviye | Mekanik | Öğretilen şey | Teknik karşılığı |
|---|---|---|---|
| 1 — Doğru kartı bul | Soru basit, kartlar az, biri bariz doğru | Robot kartsız cevap **veremiyor** | Retrieval |
| 2 — Çeldirici kartlar | Konuyla ilgili *görünen* ama soruyu cevaplamayan kartlar (örn. "Atatürk ne zaman doğdu?" sorusuna "Atatürk'ün sevdiği yemekler" kartı) | Benzerlik ≠ doğruluk | Semantik benzerlik tuzağı |
| 3 — Hiç doğru kart yok | Cevap kartlarda yok; doğru hamle robota "bilmiyorum" dedirtmek. Yanlış kart verilirse robot kendinden emin saçmalar | **"Bilmiyorum" demek bir başarıdır.** Halüsinasyon anı burada yaşanır — projenin kalbi | Hallucination / grounding |
| 4 — Eski bilgi | İki kart da "doğru" ama biri 2010 tarihli, biri güncel | Kaynağın tarihi önemli | Freshness |
| 5 — Kart limiti | 10 ilgili kart var, robota sadece 3'ü verilebilir; en kritik üçünü seç | Yer sınırlı, seçim kritik | Context window |

## "Saçmalayan Robot" Tasarımı

En kritik tasarım kararı. Her soru için elle yazılmış 3-4 cevap varyantı:

- Doğru kartlarla → **doğru cevap**
- Çeldirici kartla → **ilgili ama yanlış cevap**
- Alakasız kartla → **komik derecede saçma ama kendinden emin cevap**

İki ilke:
1. Saçma cevaplar **komik** olmalı — gülmek akılda tutturur.
2. Robot saçmalarken de **aynı özgüvenli tonda** konuşmalı — "emin görünmesi doğru olduğu anlamına gelmez" dersi kendiliğinden verilir.

## Atölye Kurgusu

1. **Analog açılış (10 dk):** Dijital oyundan önce kartlı-kâğıtlı versiyon — bir öğrenci "robot" olur, sadece eline verilen kâğıtlardaki bilgiyle cevap verebilir. Sınıf gülerken RAG'ı anlamış olur. Elektrik/tahta arızasına karşı da sigorta.
2. **Dijital oyun:** Akıllı tahtada 5 seviye, sınıfla birlikte.
3. **Ters köşe anı (kapanış):** Gerçek bir yapay zekâ sohbet ekran görüntüsü göster (uydurulmuş kaynak içeren bir cevap): "Robot hangi seviyedeki hatayı yaptı?" Oyun ile gerçek hayat arasındaki köprü.
4. **Rozet/sertifika:** "Yapay Zekâ Dedektifi" sertifikası. Ortaokulda çok iş görür, rapora somut çıktı olur.

## Etki Ölçümü

- **Ön test / son test:** 5 kısa soru. Örn: "Yapay zekâ neden bazen yanlış bilgi verir?", "Kaynak göstermesi ne demek?"
- **Transfer sorusu:** Son teste oyunda **hiç görmedikleri** bir senaryo koy: "Telefondaki asistan sana emin bir sesle yanlış tarih söyledi, neden olabilir?" — ezber değil, transfer ölçer.
- **Raporlama için baştan topla:** Ulaşılan öğrenci sayısı, test puanı değişimi, atölye fotoğrafları, öğrenci yorumları. Hedef cümle: *"X öğrencide doğru cevap oranı %40'tan %75'e çıktı."*

## Sunum Çerçevesi

Projeyi **"RAG öğretiyoruz"** diye değil, **"gençlere yapay zekâ okuryazarlığı kazandırıyoruz"** diye sun. Topluma hizmet dersinde değerlendirilen şey teknik derinlik değil, toplumsal etki.

## Tech Stack

**Çekirdek karar: Vanilla HTML + CSS + JavaScript (framework'süz, build'siz) + Supabase backend. İki dağıtım modu:**

1. **Atölye modu:** Tek `index.html`, internetsiz çalışır, veri yerelde (LocalAdapter). "Çift tıkla, çalışsın" garantisi korunur.
2. **Web modu:** GitHub Pages'te yayınlanan sürüm; sınıf kodu sistemi ve öğretmen panosuyla Supabase'e bağlanır.

| Katman | Seçim | Not |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS | Ölçek framework gerektirmiyor; en düşük giriş bariyeri |
| İçerik | Gömülü JSON (sorular, kartlar, cevap varyantları) | İçerik ekibi koda dokunmadan sadece bu bloğu düzenler |
| Görsel | Saf CSS + inline SVG robot karakteri; "juice" (yüz ifadeleri, harf harf yazma, konfeti, sarsıntı) | Three.js/oyun motoru yok: oyun kart seçme + arayüz, 3D'nin öğrenmeye katkısı sıfır, maliyeti büyük |
| Etkileşim | Tıkla-seç (sürükle-bırak yok) | Akıllı tahta kararının gereği |
| Backend | **Supabase** (Auth + Postgres + RLS) | Kendi sunucu yok, bakım yükü ~sıfır, ücretsiz katman fazlasıyla yeter |
| Kimlik | Öğretmen: Supabase Auth (e-posta). Öğrenci: **hesapsız** — sınıf kodu + rumuz (Kahoot modeli) | Öğrenciden sıfır kişisel veri; "rumuzuna gerçek adını yazma" uyarısı |
| Versiyon kontrolü | Git + GitHub | |
| Yayın | GitHub Pages | Atölyede ana dağıtım yine dosyanın kendisi |

**Bilinçli olarak kullanılmayanlar:**

- **Framework yok** — ölçek gerektirmiyor; supabase-js tek `<script>` ile gömülür, build zinciri kurulmaz.
- **Öğrenci hesabı yok** — reşit olmayanlardan kimliklendirilmiş veri toplamak KVKK yükü getirir; sınıf kodu + rumuz aynı analizi hesapsız sağlar.
- **Three.js / Phaser yok** — iyi hissettiren şey 3D değil, animasyon detayları (juice).
- **LLM API'si yok** — cevaplar elle yazılmış; ücretsiz, deterministik, sınıfta sürpriz yok.

## Mimari (Katmanlı)

```
┌─────────────────────────────────────────────┐
│  SUNUM KATMANI (UI)                         │
│  Ekranlar: giriş, oyun, sonuç, pano         │
├─────────────────────────────────────────────┤
│  OYUN MOTORU KATMANI                        │
│  Seviye akışı, kurallar, puanlama, robot    │
│  cevap seçimi — saf JS, I/O yok             │
├─────────────────────────────────────────────┤
│  İÇERİK KATMANI                             │
│  Soru/kart/cevap JSON'u                     │
├─────────────────────────────────────────────┤
│  SERVİS KATMANI (adapter arayüzü)           │
│  joinClass() · saveEvent() · endSession()   │
│  ├── LocalAdapter: localStorage + CSV indir │
│  └── SupabaseAdapter: canlı veri            │
├─────────────────────────────────────────────┤
│  BACKEND (Supabase)                         │
│  Auth (öğretmen) · Postgres · RLS · views   │
└─────────────────────────────────────────────┘
```

Kilit karar: **oyun motoru veriyi kimin sakladığını bilmez**, sadece servis katmanını çağırır. İnternet/Supabase yoksa LocalAdapter devreye girer — atölye modu hiçbir koşulda bozulmaz.

### Veritabanı şeması

```
teachers  → Supabase auth.users (hazır)
classes   → id, teacher_id, name, join_code, created_at
sessions  → id, class_id, nickname, grade, started_at, finished_at
events    → id, session_id, level, action, card_id, is_correct, ts
```

- **RLS politikaları:** Öğretmen yalnızca kendi sınıflarını okur. Anonim istemci yalnızca geçerli `join_code` ile session açar, sadece kendi session'ına event yazar, hiçbir şey okuyamaz.
- Öğretmen panosu için view'lar: `level_error_rates`, `class_summary`. Edge function gerekmez.

### Telemetri / analiz hedefi

Toplanan olaylarla cevaplanacak sorular: Hangi seviyede en çok hata yapılıyor? Seviye 3'te "bilmiyorum" seçeneğini kaç kişi kullandı? En çok düşülen çeldirici kart hangisi? → Rapor cümlesi: *"Öğrencilerin %X'i Seviye 3'te yanlış karta güvendi."*

### Kapsam uyarısı

Supabase katmanı (pano, RLS, sınıf yönetimi, ikinci adapter) kod yükünü yaklaşık ikiye katlar. **Sıralama bozulmamalı:** önce oyun LocalAdapter ile uçtan uca çalışır ve güzelleşir, Supabase ondan sonra eklenir. Oyun iyi değilse kimse login olmaz.

## Öncelik Sırası (Yol Haritası)

1. Seviye tasarımı (yukarıdaki 5'li yapı)
2. Soru/kart içeriklerinin yazımı ← *içerik kod kadar emek ister, ekipte sorumlusunu erken belirle*
3. Prototip: oyun + LocalAdapter ile uçtan uca çalışan tek dosya (atölye modu)
4. Görsel cila (robot karakteri, juice)
5. Supabase katmanı: şema + RLS → SupabaseAdapter → sınıf kodu akışı → öğretmen panosu
6. GitHub Pages yayını
7. Analog versiyon (kart/kâğıt seti)
8. Ön/son test soruları

## Açık Sorular

- [ ] Hedef kitle kesinleşti mi? (öneri: ortaokul temelli, lise uyumlu)
- [ ] Kart içeriklerini hangi ders konularından seçeceğiz? (müfredatla örtüşürse öğretmen desteği kolaylaşır)
- [ ] Atölye hangi okulda/okullarda yapılacak, kaç öğrenciye ulaşılacak?
- [ ] İçerik yazımı ve kod kimde?
