# Topluma Hizmet Uygulamaları — Final Raporu (TASLAK)

> Bu dosya bir **iskelettir**. `[ ... ]` köşeli parantezli alanları ve `______` boşluklarını
> ekip dolduracak. Doldurma sırasında köşeli parantezleri silin; bölüm başlıklarını ve
> tablo yapılarını korumanız önerilir. Atölye ve ölçme ayrıntıları için kardeş dosyalar:
> `docs/ATOLYE-PLANI.md` ve `docs/OLCME-TESTI.md`.

---

## Kapak

| Alan | Bilgi |
|---|---|
| Üniversite / Fakülte | [ ______ ] |
| Bölüm | [ ______ ] |
| Ders | Topluma Hizmet Uygulamaları |
| Proje adı | **Kütüphaneci Robot** — Yapay Zekâ Okuryazarlığı Oyunu |
| Danışman öğretim elemanı | [ Unvan, Ad Soyad ] |
| Ekip üyeleri | [ Ad Soyad — öğrenci no ] <br> [ Ad Soyad — öğrenci no ] <br> [ Ad Soyad — öğrenci no ] |
| Dönem / Tarih | [ 2025-2026 Güz — ______ ] |

---

## 1. Özet

[150-250 kelime. Şablon: *Bu projede, ortaokul öğrencilerinin yapay zekâ araçlarını
yoğun biçimde kullanmasına karşın bu araçların nasıl çalıştığını bilmemesinden doğan
dezenformasyon riskine karşı, "Kütüphaneci Robot" adlı Türkçe, oyunlaştırılmış bir web
uygulaması geliştirilmiş ve ______ okulunda ______ öğrenciyle bir atölye uygulanmıştır.
Oyunda öğrenci, bir robota bilgi kartları seçip veren "kütüphaneci" rolünü üstlenerek,
yapay zekânın yalnızca kendisine verilen bilgiye dayanabildiğini yaşayarak öğrenir.
Atölye öncesi ve sonrası uygulanan 5+1 soruluk testte doğru cevap oranı %__'den %__'ye
çıkmıştır. Proje ücretsizdir, internetsiz çalışır ve öğrenciden hiçbir kişisel veri
toplamaz.*]

---

## 2. Toplumsal İhtiyaç ve Amaç

### 2.1 İhtiyaç

Üretken yapay zekâ araçları (sohbet robotları, telefon asistanları) ortaokul ve lise
öğrencilerinin günlük hayatına ödevden oyuna kadar girmiş durumda; ancak bu araçları en
yoğun kullanan yaş grubu, araçların **nasıl çalıştığını** büyük ölçüde bilmiyor. Bu
bilgisizliğin iki somut riski var:

1. **Kendinden emin yanlış bilgi (halüsinasyon):** Yapay zekâ, cevabı bilmediğinde bile
   emin bir tonda konuşur. "Emin görünmek = doğru olmak" sanan bir öğrenci, uydurma
   kaynakları ve yanlış tarihleri sorgulamadan ödevine taşır.
2. **Dezenformasyona açıklık:** Kaynağın ne olduğunu, güncel olup olmadığını ve "konuyla
   ilgili görünmenin" doğru olmak anlamına gelmediğini sorgulamayan kullanıcı, yalnızca
   yapay zekâ karşısında değil, sosyal medya ve haber akışı karşısında da savunmasızdır.

[Buraya isterseniz 1-2 cümlelik güncel bir gözlem/istatistik ekleyin: sınıfta yapılan
küçük el kaldırma anketi bile olur — "X kişiden Y'si ödevde yapay zekâ kullandığını,
ancak hiçbiri cevabın kaynağını kontrol etmediğini söyledi."]

### 2.2 Amaç ve çerçeve

Projenin amacı teknik bir kavram öğretmek değil, **yapay zekâ okuryazarlığı**
kazandırmaktır: Hedef kitlenin, bir yapay zekâ cevabı karşısında "Bu bilgiyi nereden
buldu? Kaynağı güncel mi? Emin konuşması doğru olduğu anlamına gelir mi?" sorularını
refleks hâline getirmesi. Bunun için modern yapay zekâ sistemlerinin bilgiye dayanma
mekanizması (RAG — Bölüm 5 ve Kaynakça) bir oyuna çevrilmiş, tüm proje şu tek cümleye
hizmet edecek şekilde kurgulanmıştır:

> **"Yapay zekâ cevap vermeden önce doğru bilgiyi bulmak zorunda — bulamazsa ya da
> yanlış bulursa saçmalar."**

Hedefler:

- [ ] En az ______ öğrenciye yüz yüze atölyeyle ulaşmak
- [ ] Ön test / son test karşılaştırmasında ölçülebilir öğrenme kazanımı göstermek
- [ ] Oyunu herkese açık, ücretsiz ve internetsiz de çalışır biçimde yayımlamak (yapıldı)
- [ ] [ Ekibin ekleyeceği diğer hedefler ]

---

## 3. Hedef Kitle

**Birincil:** Ortaokul öğrencileri (5-8. sınıf). Tüm içerik bu düzeye göre yazılmıştır;
ortaokul için anlaşılır olan lisede de çalışır, tersi doğru değildir.

**İkincil:** Lise öğrencileri ve atölyeye eşlik eden öğretmenler (öğretmen paneli
sayesinde kendi sınıflarıyla tekrar uygulayabilirler).

| Alan | Bilgi |
|---|---|
| Uygulama yapılan okul(lar) | [ ______ ] |
| Sınıf düzey(ler)i | [ ______ ] |
| Ulaşılan öğrenci sayısı | [ ______ ] |
| Dolaylı ulaşılan kişi (öğretmen, veli, web) | [ ______ ] |

---

## 4. Yöntem: "Kütüphaneci Robot" Oyunu

Oyuncu bir **kütüphanecidir**. Okulun asistan robotuna öğrencilerden sorular gelir;
robot hiçbir şeyi ezbere bilmez, yalnızca oyuncunun seçip verdiği **bilgi kartlarına**
dayanarak cevap üretir. Doğru kart doğru cevabı, yanlış kart ise **kendinden emin ama
komik bir saçmalamayı** getirir. Böylece oyuncu, gerçek yapay zekâ sistemlerindeki
"bilgi bulma" katmanının ta kendisi olur ve dersi yaşayarak öğrenir. Komik yanlış
cevaplar bilinçli bir tasarım kararıdır: gülmek akılda tutturur ve robotun saçmalarken
bile aynı özgüvenli tonda konuşması, "emin görünmek ≠ doğru olmak" dersini kendiliğinden
verir.

Oyun 5 seviyedir; her seviye, yapay zekânın bir gerçeğini hiçbir teknik terim
kullanmadan öğretir:

| Seviye | Mekanik | Çocuğun diliyle öğrendiği | Teknik karşılığı |
|---|---|---|---|
| 1 — Doğru Kartı Bul | 4 kart, biri bariz doğru | "Robot kartsız cevap veremiyor; bilgiyi ben buluyorum." | Bilgi getirme (retrieval) |
| 2 — Çeldirici Kartlar | Konuyla ilgili *görünen* ama soruyu cevaplamayan kartlar | "Konuyla ilgili görünmek, cevap olmak demek değil." | Semantik benzerlik tuzağı |
| 3 — Doğru Kart Yok! | Cevap kartlarda yok; doğru hamle robota "Bilmiyorum" dedirtmek | "'Bilmiyorum' demek başarıdır; yanlış kartla robot emin emin saçmalar." | Halüsinasyon / kaynağa dayanma (grounding) |
| 4 — Eski Bilgi Tuzağı | İki "doğru" kart, biri eski tarihli | "Bilgi eskir; kaynağın tarihine bakarım." | Güncellik (freshness) |
| 5 — Kart Limiti | 8 karttan yalnızca 3'ü verilebilir | "Robotun eline sınırlı kart sığıyor; en önemlileri seçmek ustalıktır." | Bağlam penceresi (context window) |

Projenin kalbi 3. seviyedir: öğrenci, "halüsinasyon" kelimesini hiç duymadan
halüsinasyon anını bizzat yaşar ve "bilmiyorum" demenin bir dürüstlük (ve puan!)
kaynağı olduğunu görür.

Oyun iki modda çalışır:

- **Atölye Modu:** Tek HTML dosyası, internetsiz, çift tıkla-çalışsın; sonuçlar CSV
  olarak indirilir.
- **Sınıf Modu:** Öğretmenin tahtaya yazdığı 6 haneli kod + rumuzla katılım; veriler
  canlı olarak öğretmen panosuna düşer (Kahoot modeli).

---

## 5. Atölye Uygulaması

Atölyenin dakika dakika akışı, malzeme listesi, analog kart seti ve "ters köşe anı"
kurgusu **`docs/ATOLYE-PLANI.md`** dosyasındadır. Özet akış: analog açılış (bir öğrenci
"robot" olur, yalnızca eline verilen kâğıtlardaki bilgiyle cevap verir) → dijital oyun
(akıllı tahtada 5 seviye) → ters köşe anı (gerçek yapay zekâ hatalarını örnekleyen
**kurgu** bir sohbet — uydurma kitap önerisi: "Robot hangi seviyedeki hatayı yaptı?") →
"Yapay Zekâ Dedektifi" sertifikası.

Gerçekleşen uygulama(lar):

| # | Okul | Tarih | Sınıf | Katılımcı sayısı | Süre | Uygulayan ekip üyeleri | Not |
|---|---|---|---|---|---|---|---|
| 1 | [ ______ ] | [ __.__.2026 ] | [ ______ ] | [ __ ] | [ __ dk ] | [ ______ ] | [ ______ ] |
| 2 | | | | | | | |

[Her uygulama için 1 kısa paragraf gözlem yazın: sınıfın en çok güldüğü an, en çok
zorlanılan seviye, öğretmenin yorumu, beklenmedik bir soru/olay. 2-3 atölye fotoğrafı
ekleyin (veli/okul izni olan, öğrenci yüzü seçilmeyecek şekilde).]

---

## 6. Etki Ölçümü

Ölçme aracı (5 soruluk ön/son test + oyunda hiç görülmemiş 1 transfer sorusu), uygulama
yönergesi ve cevap anahtarı **`docs/OLCME-TESTI.md`** dosyasındadır. Test atölyeden
hemen önce ve hemen sonra, isimsiz (rumuzlu) kâğıtlarla uygulanır.

### 6.1 Sonuç tabloları (doldurulacak)

**Toplu sonuç:**

| Ölçüt | Ön test | Son test | Değişim |
|---|---|---|---|
| Katılımcı sayısı | [ __ ] | [ __ ] | — |
| Ortalama doğru sayısı (5 üzerinden) | [ __,_ ] | [ __,_ ] | [ +__,_ ] |
| Doğru cevap oranı | [ %__ ] | [ %__ ] | [ +__ puan ] |
| Transfer sorusunda tam puan (2) alanların oranı | — (sorulmaz) | [ %__ ] | — |

**Soru bazında doğru cevap oranı:**

| Soru | Ölçtüğü kavram | Ön test | Son test |
|---|---|---|---|
| S1 | [ ______ ] | [ %__ ] | [ %__ ] |
| S2 | [ ______ ] | [ %__ ] | [ %__ ] |
| S3 | [ ______ ] | [ %__ ] | [ %__ ] |
| S4 | [ ______ ] | [ %__ ] | [ %__ ] |
| S5 | [ ______ ] | [ %__ ] | [ %__ ] |
| Transfer | Kavramın yeni duruma aktarımı — 0-1-2 rubrikte tam puan (2) oranı | — | [ %__ ] |

Oyun telemetrisi (öğretmen panosu / CSV) ayrıca şu soruları cevaplar; ilgili sayıları
buraya işleyin:

- En çok hata yapılan seviye: [ Seviye __, hata oranı %__ ]
- Seviye 3'te "Bilmiyorum" seçeneğini ilk denemede kullananlar: [ %__ ]
- En çok tuzağa düşüren kart: [ kart adı / id ]

### 6.2 Örnek yorum cümlesi şablonları

[Sayılar geldikten sonra aşağıdaki kalıplardan uygun olanları doldurup kullanın:]

- *"______ öğrencide doğru cevap oranı %__'den %__'ye çıktı."*
- *"Öğrencilerin %__'si, oyunda hiç görmedikleri transfer sorusunu doğru cevapladı; bu,
  kazanımın ezber değil kavrayış olduğunu gösteriyor."*
- *"En büyük sıçrama '______' kavramını ölçen S_'de yaşandı (%__ → %__); bu, oyunun
  __. seviyesinin hedefine ulaştığını gösteriyor."*
- *"Oyun verilerine göre öğrencilerin %__'si Seviye 3'te yanlış karta güvendi; son
  testte ise %__'si 'yapay zekâ emin konuşsa da yanlış olabilir' seçeneğini işaretledi."*

---

## 7. Teknik Mimari Özeti

Uygulama; framework'süz, derleme adımı olmayan saf HTML/CSS/JavaScript ile yazılmış,
katmanlı bir web uygulamasıdır. **Sunum katmanı** (öğrenci oyunu ve öğretmen paneli
olmak üzere iki ayrı arayüz) altındaki **oyun motoru** saf mantıktır: ekranı, ağı ve
veritabanını bilmez; bu sayede birim testleri tarayıcısız koşar. Sorular, kartlar ve
robotun tüm cevap varyantları **içerik katmanında** veri olarak durur — yeni soru
eklemek kod yazmak değildir. Kilit tasarım kararı **servis katmanıdır**: oyun, veriyi
kimin sakladığını bilmez; internetsiz Atölye Modu'nda veriler cihazda kalıp CSV ile
teslim edilirken, Sınıf Modu'nda aynı arayüz üzerinden buluttaki veritabanına (Supabase:
PostgreSQL + öğretmen kimlik doğrulaması + satır düzeyi güvenlik) yazılır. Oyun gerçek
bir yapay zekâ modeline **bağlanmaz**; tüm cevaplar elle yazılmıştır — ücretsiz,
deterministik ve sınıfta sürprizsizdir.

```
┌─────────────────────────────────────────────┐
│  SUNUM — Öğrenci oyunu  │  Öğretmen paneli  │
├─────────────────────────────────────────────┤
│  OYUN MOTORU — seviye akışı, puanlama,      │
│  robot cevap seçimi (saf mantık)            │
├─────────────────────────────────────────────┤
│  İÇERİK — 5 seviye, 15 soru, 75 kart,       │
│  elle yazılmış cevap varyantları (yalnız veri)│
├─────────────────────────────────────────────┤
│  SERVİS KATMANI (ortak arayüz)              │
│  ├── Yerel: cihazda sakla + CSV indir       │
│  └── Bulut: canlı sınıf verisi              │
├─────────────────────────────────────────────┤
│  VERİ — Supabase (PostgreSQL + Auth + RLS)  │
│  sınıflar · oturumlar · olaylar · pano      │
└─────────────────────────────────────────────┘
```

Ayrıntılı şema, katman kuralları ve kurulum adımları proje deposundaki `README.md` ve
`SPEC.md` dosyalarındadır. Oyun GitHub Pages üzerinden herkese açık yayımlanmıştır:
[ yayın adresi: ______ ]

---

## 8. Etik ve KVKK Yaklaşımı

Hedef kitle reşit olmayan öğrenciler olduğundan veri yaklaşımı baştan "sıfır kişisel
veri" ilkesiyle kurgulanmıştır:

- **Öğrenci hesabı yoktur.** Öğrenci; e-posta, ad-soyad, telefon gibi hiçbir kimlik
  bilgisi girmez. Sınıf Modu'na katılım, öğretmenin tahtaya yazdığı 6 haneli kod +
  öğrencinin seçtiği **rumuz** iledir; arayüz rumuz alanının yanında açıkça
  **"Gerçek adını yazma!"** uyarısı gösterir.
- **Atölye Modu'nda veri cihaz dışına hiç çıkmaz.** Oyun internetsiz çalışır; olay
  günlüğü yalnızca cihazın yerel deposunda tutulur ve ekip isterse CSV olarak elden
  teslim alır.
- **Toplanan veri yalnızca oyun olaylarıdır:** hangi seviyede hangi kart seçildi, doğru
  muydu, skor kaçtı. Bu veriler kişiyle değil rumuzla ilişkilidir ve yalnızca öğrenme
  analizi (Bölüm 6) için kullanılır.
- **Hesap modeli yalnızca öğretmen içindir.** Öğretmen kendi e-postasıyla kayıt olur ve
  satır düzeyi güvenlik (RLS) sayesinde **yalnızca kendi sınıflarının** verisini görür;
  anonim istemcinin veritabanı tablolarına doğrudan erişimi yoktur.
- **Gerçek yapay zekâ modeli kullanılmaz:** öğrenci girdileri hiçbir üçüncü taraf yapay
  zekâ servisine gönderilmez; robotun tüm cevapları önceden elle yazılmıştır.
- **İçerik güvenliği:** Tüm sorular 5-8. sınıf düzeyinde genel kültür/fen/sosyal
  konulardan seçilmiştir; siyaset, din ve şiddet içeriği yoktur.
- **Atölye izinleri:** [ Okul idaresi onayı, öğretmen bilgilendirmesi ve fotoğraf
  kullanımı için alınan izinlerin tarih/sayı bilgilerini buraya yazın. Fotoğraflarda
  öğrenci yüzlerinin seçilmemesine dikkat edildiğini belirtin. ]

---

## 9. Görev Dağılımı

| Ekip üyesi | Üstlendiği görevler | Katkı açıklaması |
|---|---|---|
| [ Ad Soyad ] | [ örn. içerik yazımı (sorular/kartlar), ölçme testi ] | [ 1-2 cümle ] |
| [ Ad Soyad ] | [ örn. yazılım geliştirme, teknik altyapı ] | [ 1-2 cümle ] |
| [ Ad Soyad ] | [ örn. okul iletişimi, izinler, atölye sunumu ] | [ 1-2 cümle ] |
| [ Ad Soyad ] | [ örn. analog kart seti, sertifika tasarımı, fotoğraf/rapor ] | [ 1-2 cümle ] |

[Görev başlıkları öneridir; gerçekte kim ne yaptıysa onu yazın. Ortak yapılan işleri
"tüm ekip" satırıyla gösterebilirsiniz.]

---

## 10. Sonuç ve Öneriler

### 10.1 Sonuç

[2-3 paragraf. Şablon iskelet:]

- *Ulaşılan kitle ve kazanım:* [ "______ okulunda ______ öğrenciye uygulanan atölyede
  doğru cevap oranı %__'den %__'ye çıktı; transfer sorusunda %__ başarı, kazanımın
  günlük hayata aktarıldığını gösterdi." ]
- *Toplumsal katkı:* [ Oyunun herkese açık yayımlandığı, öğretmenlerin kendi
  sınıflarıyla bağımsızca uygulayabildiği, dezenformasyona karşı erken yaşta
  farkındalık oluşturduğu... ]
- *Ekibin kazanımı:* [ Proje yönetimi, yaş grubuna uygun içerik üretme, sahada atölye
  yürütme deneyimi... ]

### 10.2 Öneriler ve sürdürülebilirlik

[Uygulama deneyiminize göre seçin/çoğaltın:]

- [ ] Oyunun başka okullarda da uygulanması için [ il MEM / okul ağı ] ile paylaşılması
- [ ] İçeriğin öğretmenlerce genişletilmesi (soru ekleme kod gerektirmez; depodaki
      içerik rehberi yeterlidir)
- [ ] [ Atölyede gözlenen iyileştirme önerisi: örn. "Seviye __ için ek ipucu ekranı" ]
- [ ] Gelecek dönem ekiplerine devir: [ depo erişimi, öğretmen hesabı, kalan işler ]

---

## Kaynakça

1. Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H.,
   Lewis, M., Yih, W., Rocktäschel, T., Riedel, S. ve Kiela, D. (2020).
   "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks".
   *Advances in Neural Information Processing Systems 33 (NeurIPS 2020)*.
2. [ MEB dijital okuryazarlık / bilişim teknolojileri öğretim programına atıf —
   kullandığınız güncel belgenin tam adını, yılını ve erişim adresini ekleyin;
   örn. MEB'in dijital okuryazarlık çerçeve belgesi veya ilgili dersin öğretim
   programı. **Erişip doğrulamadan künye yazmayın.** ]
3. [ Varsa ek kaynak: yapay zekâ okuryazarlığı üzerine erişilen rapor/makale —
   tam künyesiyle. ]

---

## Ekler (rapora iliştirilecek)

- **Ek A:** Atölye planı (`docs/ATOLYE-PLANI.md` çıktısı)
- **Ek B:** Ön/son test formu ve cevap anahtarı (`docs/OLCME-TESTI.md` çıktısı)
- **Ek C:** [ Atölye fotoğrafları — izinli ]
- **Ek D:** [ "Yapay Zekâ Dedektifi" sertifika örneği ]
- **Ek E:** [ Okul izin yazıları ]
- **Ek F:** [ Öğretmen panosu ekran görüntüsü / CSV özeti ]
