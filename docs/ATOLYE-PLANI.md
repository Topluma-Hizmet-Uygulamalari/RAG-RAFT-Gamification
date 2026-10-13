# Atölye Planı — "Kütüphaneci Robot" (40 dakika / tek ders saati)

> Topluma Hizmet Uygulamaları projesi atölye kılavuzu.
> Hedef kitle: 5-8. sınıf (lise grubuyla da aynen çalışır).
> Kolaylaştırıcı: en az 1 ekip üyesi + sınıf öğretmeni. İdeal: 2 ekip üyesi (biri akışı yönetir, biri süre/veri takibi yapar).

---

## 1. Hedefler

Bu atölyenin konusu **yapay zekâ okuryazarlığı**dır. Öğrenci atölyeden şu dört cümleyi içselleştirmiş çıkar:

1. Yapay zekâ cevap vermeden önce **doğru bilgiyi bulmak zorundadır**; bulamazsa ya da yanlış bulursa saçmalar.
2. **Kendinden emin konuşmak, doğru söylemek demek değildir.** Yapay zekâ yanlışken de aynı özgüvenli tonda konuşur.
3. **"Bilmiyorum" demek bir başarıdır.** Kaynağı olmayan cevap, cevap değildir.
4. Bir bilginin **kaynağına ve tarihine bakmak** her zaman bizim işimizdir.

> **Altın kural:** "RAG", "retrieval", "halüsinasyon", "bağlam penceresi" gibi teknik terimler öğrencilere **hiçbir aşamada söylenmez**. Her şey "robot, kart, kütüphaneci" diliyle anlatılır. Teknik karşılıklar yalnızca bu kılavuzda ve proje raporunda geçer.

---

## 2. Atölye öncesi hazırlık (atölye gününden ÖNCE)

- [ ] Öğretmen hesabı açılmış, sınıf oluşturulmuş, **sınıf kodu not edilmiş** (`app/teacher.html` → Sınıflarım → Yeni Sınıf). Kod atölye günü tahtaya yazılacak.
- [ ] Analog kart seti **basılmış ve kesilmiş** (`app/analog.html` — o sayfadaki kartlar yazdırılır; mümkünse kalın kâğıt/laminasyon).
- [ ] Ön test / son test kâğıtları çoğaltılmış (`docs/OLCME-TESTI.md` — sınıf mevcudu + %10 yedek).
- [ ] "Yapay Zekâ Dedektifi" sertifikaları hazır (`app/sertifika.html` — sınıf mevcudu kadar baskı; isimler atölye sonunda elle yazılır).
- [ ] Akıllı tahtada / projeksiyonda `app/index.html` **önceden açılıp denenmiş** (okul ağı bazı siteleri engelleyebilir — mutlaka yerinde test edin).
- [ ] USB bellekte projenin tamamının bir kopyası (internet yoksa Atölye Modu sigortası).
- [ ] Ters köşe senaryosu (bölüm 3.3'teki sohbet metni) büyük puntoyla bir slayta ya da A3 kâğıda alınmış.

---

## 3. Dakika dakika akış

### 3.0 · 0-5 dk — Ön test

- Öğrenciler yerleşir yerleşmez ön test kâğıdı dağıtılır (`docs/OLCME-TESTI.md` Bölüm 2'deki 5 soru; transfer sorusu ön testte sorulmaz).
- Kolaylaştırıcı: **"Bu bir sınav değil, not verilmeyecek. Sadece atölyeden önce ne düşündüğünüzü merak ediyoruz. İsim yerine kâğıdın köşesine kendinize bir rumuz yazın — ders sonunda aynı rumuzu tekrar kullanacaksınız."**
- Rumuz uyarısı: **"Gerçek adınızı yazmayın, uydurma bir isim seçin."**
- 4. dakikada kâğıtlar toplanır. Geciken olursa son sorular boş kalabilir, sorun değil.

> Süre tüyosu: Kâğıtları sıra başlarına önceden ters kapalı koymak 1-2 dakika kazandırır.

### 3.1 · 5-15 dk — Analog açılış: "Sınıfın Robotu"

**Kurulum (1 dk).** İki gönüllü seçilir:

- **Robot:** Sınıfın önünde oturur. Kuralı: **yalnızca eline verilen kâğıttaki bilgiyle** cevap verebilir ve **robot sesiyle** konuşur (düz, kesik kesik, her zaman kendinden emin). Kâğıtta olmayan hiçbir şeyi söyleyemez — kendi bildiklerini kullanması **yasaktır**.
- **Kütüphaneci:** Masadaki kartlardan (`app/analog.html` çıktısı) birini seçip Robot'a verir.

Kolaylaştırıcı açılış repliği:

> "Karşınızda okulumuzun yeni robotu! Çok güçlü ama bir sorunu var: **kafasının içi bomboş.** Bildiği tek şey, eline verdiğimiz kartlarda yazanlar. Kütüphanecimiz ona doğru kartı verirse harika cevaplar veriyor. Yanlış kart verirse... göreceksiniz. Dikkat edin: **robot yanlış söylerken de asla 'emin değilim' demez.** Hadi deneyelim!"

**Örnek Tur 1 — doğru kartla (3 dk).**

- Kolaylaştırıcı soruyu sınıfa sorar: *"Robot, Güneş Sistemi'nin en büyük gezegeni hangisi?"*
- Kütüphaneci masadaki 3-4 karttan **doğru kartı** seçer (ör. "Jüpiter, Güneş Sistemi'nin en büyük gezegenidir; içine 1300'den fazla Dünya sığar.") ve Robot'un eline verir.
- Robot (robot sesiyle, karttan okuyarak): **"CE-VAP VE-Rİ-YO-RUM. EN BÜ-YÜK GE-ZE-GEN JÜ-Pİ-TER-DİR. İ-Çİ-NE 1300 DÜN-YA SI-ĞAR."**
- Kolaylaştırıcı: "Doğru mu? Doğru! Peki robot bunu nereden bildi? Akıllı olduğu için mi?" — Sınıftan beklenen cevap: **"Hayır, kart doğruydu!"**
- Kolaylaştırıcı: "Aynen öyle. Robotun cevabı, verdiğimiz kart kadar iyi."

**Örnek Tur 2 — çeldirici kartla saçmalama (4 dk).**

- Yeni gönüllüler alınabilir (katılımı artırır). Soru aynıdır: *"Robot, Güneş Sistemi'nin en büyük gezegeni hangisi?"* — "Aynı soruyu bir daha soruyoruz; bakalım bu sefer ne olacak?"
- Kolaylaştırıcı bu kez Kütüphaneci'ye **gizlice** setteki alakasız kartı işaret eder ("Kantin Menüsü" kartı: "Okul kantininde salı günleri poğaça ve ayran satılır.") ya da kart destesini çeldiricilerden kurar.
- Robot kuralı gereği eldeki kartla, **tam bir özgüvenle** cevap üretmek zorundadır: **"CE-VAP VE-Rİ-YO-RUM. EN BÜ-YÜK GE-ZE-GEN, SA-LI GÜN-LE-Rİ PO-ĞA-ÇA VE AY-RAN SA-TAN GE-ZE-GEN-DİR."**
- (Robot rolündeki öğrenci tutulursa kolaylaştırıcı fısıldayarak yardım eder: "Karttaki bilgiyi cevapmış gibi, hiç duraksamadan söyle.")
- Sınıf güler. Kolaylaştırıcı tartışmayı açar:
  - "Robot az önce **hiç utanmadan** yanlış cevap verdi. Sesinde en ufak bir şüphe var mıydı?" → Yok.
  - "Suç robotta mı, kartta mı, kartı verende mi?" → Kısa tartışma; hedef çıkarım: **robot eline ne verilirse onu söyler.**
  - Kapanış repliği: "Telefonunuzdaki yapay zekâ da aynen böyle çalışıyor. O da cevaplamadan önce bilgi arıyor; yanlış ya da eksik bilgi bulursa, az önceki robot gibi **kendinden emin bir sesle saçmalıyor.** Şimdi kütüphaneci koltuğuna hepiniz geçeceksiniz."

> Not: Analog kartların tam listesi ve basım düzeni `app/analog.html` sayfasındadır; buradaki iki tur senaryosu o setin ilk sorusu ve kartlarıyla ("Dev Gezegen Jüpiter" + "Kantin Menüsü") birebir oynanır.

### 3.2 · 15-30 dk — Dijital oyun (akıllı tahtada, sınıfça)

- Akıllı tahtada `app/index.html` açılır (GitHub Pages linki ya da USB'deki dosya).
- **Sınıf Modu:** "Sınıf Koduyla Katıl" seçilir; **sınıf kodu tahtanın köşesine büyük harflerle yazılır** (telefonu/tableti olan öğrenciler evden de aynı kodla oynayabilir — dersin sonunda hatırlatın). Rumuz olarak sınıfın ortak rumuzu girilir (ör. "6A-TAHTA"). İnternet yoksa bölüm 5'teki B planına geçilir.
- **Oynatma düzeni (her soruda aynı döngü):**
  1. Soru balonu sınıfa **yüksek sesle okutulur** (bir öğrenciye okutmak katılımı artırır).
  2. Kartlar tek tek okunur. Kolaylaştırıcı: "Hangi kartı verelim? **El kaldırın!**" — kart başına oy sayılır, en çok oyu alan kart seçilip "Robota Ver"e basılır. (Alternatif: her soruda bir öğrenci tahtaya kalkıp sınıf adına seçer.)
  3. Robotun cevabı daktiloyla yazılırken sınıf izler; doğru/yanlış tepkisi yaşanır.
- **Seviye geçişlerinde 1 cümlelik köprüler** (ekrandaki ders cümlesini sınıfa okutup eklenir):
  - Seviye 2'ye girerken: "Dikkat! Bundan sonra bazı kartlar konuyla ilgili **görünecek** ama soruyu cevaplamayacak."
  - Seviye 3'e girerken: "Bu seviyede bir tuzak var, söylemiyorum. Gözünüz **bütün butonlarda** olsun." (Doğru kart yok; hedef, sınıfın "Bilmiyorum De" butonunu keşfetmesi. Keşfederlerse büyük alkış — projenin kalbi burasıdır.)
  - Seviye 4'e girerken: "Bu seviyede iki kart da doğru **görünüyor**. İpucu: kartların **yıllarına** dikkat!"
  - Seviye 5'e girerken: "Robotun beyninde sadece 3 karta yer var. En önemli 3'ünü sınıfça seçin."
- **Süre yönetimi:** 5 seviye × 3 soru = 15 soru, hepsine vakit yetmeyebilir. Öncelik sırası: **Seviye 1 (1 soru) → Seviye 2 (2 soru) → Seviye 3 (3 sorunun hepsi — asla kısaltma) → Seviye 4 (1-2 soru) → Seviye 5 (1 soru).** 26. dakikada hâlâ Seviye 3'teyseniz 4 ve 5'ten birer soru oynayıp geçin. (Motor soru atlamayı desteklemez; "kısaltmak" = kalan sorularda oylamayı hızlandırmak, tartışmayı seviye sonuna saklamak demektir.)
- Oyun sonu ekranındaki skor ve "Yapay Zekâ Dedektifi" kartı sınıfa gösterilir: "Bu skoru siz kazandınız!"

### 3.3 · 30-35 dk — Ters köşe anı: "Gerçek hayatta da oldu!"

Kolaylaştırıcı: **"Oyun bitti ama size bir şey göstereceğim. Bu, gerçek bir yapay zekâ sohbetine çok benzeyen bir yazışma. Dikkatle okuyun."**

Aşağıdaki sohbet metni slayttan/A3 kâğıttan **aynen** gösterilir ve bir öğrenciye sesli okutulur:

---

> **Kullanıcı:** Kitap okumayı seviyorum. Bana uzayı ve gezegenleri anlatan güzel bir macera romanı önerir misin?
>
> **Asistan:** Elbette! Tam sana göre bir kitap var: **Selin Korkmaz**'ın **"Yıldız Haritası'nın Sırrı"** adlı romanı (**2011**). Kitapta 12 yaşındaki Deniz, dedesinden kalan eski bir teleskopla Jüpiter'in bilinmeyen bir uydusunu keşfeder ve uluslararası bir uzay yarışmasına katılır. Kitap 2012'de Yılın En İyi Çocuk Romanı ödülünü kazanmıştır ve okullarda sıkça okutulur. Keyifli okumalar!

---

*(Bu kitap, yazar ve ödül tamamen uydurmadır — asistan var olmayan bir kitabı yazarı, yılı ve ödülüyle, kendinden emin biçimde önermektedir.)*

Tartışma soruları (sırayla):

1. **"Bu cevapta size güven veren şeyler neler?"** → Yazar ismi var, yıl var, ödül var, konu özeti var, ton çok emin.
2. **"Kötü haber: bu kitap, bu yazar ve bu ödül GERÇEKTE YOK. Asistan hepsini uydurdu."** (Şaşkınlık anını bekleyin.)
3. **"Peki söyleyin bakalım: Robot, bizim oyundaki hangi seviyenin hatasını yaptı?"**
   - Beklenen cevap: **Seviye 3 — Doğru Kart Yok!** Elinde doğru bilgi yokken "bilmiyorum" demek yerine kendinden emin bir cevap uydurdu.
   - Derinleştirme: "Seviye 2'nin izi de var mı?" → Evet; uzay, çocuk kahraman, macera gibi **konuyla ilgili görünen** parçaları birleştirip inandırıcı bir paket yaptı.
4. Kapanış repliği: **"Bundan sonra bir yapay zekâ size yazar, yıl, kaynak sayarak çok emin bir cevap verdiğinde ne yapacaksınız?"** → "Kaynağına bakacağız / başka yerden doğrulayacağız / kütüphaneciye-öğretmene soracağız." — "İşte bugün hepiniz Yapay Zekâ Dedektifi oldunuz."

### 3.4 · 35-40 dk — Son test + sertifika

- Son test dağıtılır (`docs/OLCME-TESTI.md` Bölüm 2'deki 5 soru + Bölüm 3'teki, oyunda hiç görülmeyen **transfer sorusu**). Kolaylaştırıcı: **"Kâğıdın köşesine ders başındaki RUMUZUNUZU yazın — aynısını."**
- 38-39. dakikada kâğıtlar toplanırken "Yapay Zekâ Dedektifi" sertifikaları dağıtılır (`app/sertifika.html` çıktısı; isimler elle yazılır ya da ders sonrası öğretmene teslim edilir).
- Son cümle: "Sınıf kodunuz tahtada — evde ailenize de oynatın, bakalım onlar kaç puan alacak!"

---

## 4. Malzeme listesi

| Malzeme | Adet | Not |
|---|---|---|
| Analog kart seti (`app/analog.html` çıktısı) | 1 set (yedekli 2) | Kalın kâğıt ya da laminasyon önerilir |
| Ön test + son test kâğıtları (`docs/OLCME-TESTI.md`) | Mevcut + %10 | Önceden çoğaltılmış |
| "Yapay Zekâ Dedektifi" sertifikası (`app/sertifika.html`) | Mevcut kadar | İsim alanı boş basılır |
| Ters köşe sohbeti (bölüm 3.3 metni) | 1 slayt ya da A3 | Büyük punto |
| Akıllı tahta / projeksiyon + internet | 1 | Önceden yerinde test edilmeli |
| USB bellek (projenin tam kopyası) | 1 | İnternet sigortası |
| Sınıf kodu (önceden alınmış) | 1 | `app/teacher.html`'den |
| Tahta kalemi, yedek kalemler | — | Rumuz yazamayan öğrenciler için |
| (İsteğe bağlı) Robot aksesuarı | 1 | Karton kafa bandı / "ROBOT" yaka kartı — analog açılışı güçlendirir |

---

## 5. B planları

**B1 — Elektrik/tahta/projeksiyon yok → tamamen analog sürüm.**
Analog açılış (bölüm 3.1) 10 dakikadan ~25 dakikaya genişletilir: `app/analog.html` setindeki kartlarla 5 seviyenin mantığı sırayla sahnelenir — doğru kart turu, çeldirici turu, **doğru kartın hiç olmadığı tur** ("Robot'a ne dedirtmeliydik?" → bilmiyorum), eski tarihli kart turu (iki kart, biri eski yıl), 3-kart-limiti turu (destede 6-8 kart, yalnız 3'ü verilebilir). Robot ve Kütüphaneci rolleri her turda değişir. Ön test, ters köşe (A3 kâğıttan) ve son test aynen kalır. Veri: oyun verisi yerine tur sonuçları kâğıda çetele tutulur.

**B2 — İnternet yok ama tahta var → Atölye Modu.**
USB'deki `app/index.html` çift tıklanarak açılır, "Atölye Modu (internetsiz)" seçilir. Oyun aynı akışla oynanır. **Ders bitmeden oyun sonu ekranındaki "Sonuçları İndir (CSV)" butonuna basıp dosyayı USB'ye kaydetmeyi unutmayın** — pano verisi olmayacağı için ölçümün tek dijital kaydı budur.

**B3 — Süre 40 dakikanın altına düşerse (geç başlama vb.).**
Kısaltma sırası: önce dijital oyunun soru sayısı azaltılır (bölüm 3.2'deki öncelik sırası), sonra analog açılış tek tura (çeldirici turu — Tur 2) indirilir. **Asla kısaltılmayacaklar:** ön test, son test, ters köşe anı. (Ölçüm ve transfer, projenin rapor edilen etkisidir.)

---

## 6. Sık yaşanan sorunlar ve çözümleri

| Sorun | Çözüm |
|---|---|
| "Sınıf kodu bulunamadı" hatası | Kodu tahtadakiyle harf harf karşılaştırın (O/0, I/1 karışır). Kod doğruysa internete bakın; olmuyorsa Atölye Modu'na geçin — oyun hiçbir koşulda durmaz. |
| Sayfa açılıyor ama "Sınıf Koduyla Katıl" butonu pasif | İnternet/okul ağı Supabase'i engelliyor demektir. Atölye Modu'yla devam edin (B2); CSV'yi almayı unutmayın. |
| Robot rolündeki öğrenci utandı / donup kaldı | Kolaylaştırıcı yanına çömelip fısıldayarak suflörlük yapar; olmazsa rolü gönüllü başka öğrenciye ya da ekip üyesine devredin. Robot rolü asla zorla verilmez. |
| Seviye 3'te sınıf "Bilmiyorum De" butonunu görmüyor, ısrarla kart seçiyor | Müdahale etmeyin — bir kez yanlış kartla saçmalamayı yaşasınlar (ders tam da bu). İkinci soruda hâlâ görmezlerse: "Ekranda kartlardan başka bir şey var mı?" diye sorun. |
| Sınıf cevabı oyundan önce biliyor, "Jüpiteeer!" diye bağırıyor | "Robot sizi duyamıyor; o sadece kart okuyabiliyor. Ona hangi kartı vereceğiz?" diyerek odağı cevaptan **kart seçimine** çevirin. |
| Oylamada kaos / herkes aynı anda bağırıyor | "Sessiz oylama" kuralı: kolaylaştırıcı kartları tek tek işaret eder, yalnız el sayılır. Ya da her soruda tek bir öğrenci "sınıf sözcüsü" olur. |
| Ters köşe anında kimse şaşırmadı ("zaten uydurma olduğu belli") | Harika — "Nereden anladınız?" diye sorun; verdikleri ipuçları (doğrulanamayan ödül, çok emin ton) zaten dersin kendisidir. |
| Öğrenci ön/son teste gerçek adını yazdı | Kâğıdı değiştirmeyin; rapor aşamasında o kâğıdın rumuz alanını karartın. Sonraki sınıfta rumuz uyarısını kâğıt dağıtılmadan yapın. |
| Süre taştı, son test yetişmiyor | Son test asla atlanmaz: öğretmenle anlaşıp teneffüsün ilk 3 dakikasını isteyin ya da son testi öğretmene bırakıp aynı gün uygulatın (aynı rumuz hatırlatmasıyla). |

---

## 7. Veri toplama hatırlatması (atölye çıkışında kontrol et)

Rapor için her atölyeden şu dört şey çıkmalı:

1. **Ön test + son test kâğıtları** — aynı rumuzla eşleşecek şekilde iki ayrı zarfta (`docs/OLCME-TESTI.md`'deki puanlama yönergesiyle değerlendirilecek).
2. **Oyun verisi:**
   - Sınıf Modu'nda oynandıysa: veri kendiliğinden panoya düşer — atölye sonrası `app/teacher.html` → sınıfı seç → panoyu kontrol et, **"CSV indir"** ile yedeğini al.
   - Atölye Modu'nda oynandıysa: oyun sonu ekranındaki **"Sonuçları İndir (CSV)"** dosyası tek kayıttır — **tahta kapatılmadan önce** USB'ye alın.
3. **Katılım sayısı:** sınıf, şube, öğrenci sayısı, tarih (rapordaki "ulaşılan öğrenci" rakamı buradan).
4. **Fotoğraf:** okul yönetiminin izniyle ve **öğrenci yüzleri görünmeyecek şekilde** (arkadan, ya da sadece tahta/kartlar). İzin yoksa yalnızca malzeme ve ekran fotoğrafı çekilir.

Hedef rapor cümlesi formatı: *"N öğrenciyle yapılan atölyede doğru cevap oranı ön testte %X iken son testte %Y oldu; öğrencilerin %Z'si Seviye 3'te 'bilmiyorum' seçeneğini kullandı."*
