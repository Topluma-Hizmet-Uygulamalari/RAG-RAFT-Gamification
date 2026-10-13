// İçerik katmanı — Kütüphaneci Robot (SPEC Bölüm 5)
// Tüm soru/kart/cevap verisi burada; kod içermez, yalnızca veri.
(function (global) {
  "use strict";

  var CONTENT = {
    meta: { title: "Kütüphaneci Robot", version: 1 },
    levels: [

      // ─────────────────────────── SEVİYE 1 ───────────────────────────
      {
        id: 1,
        title: "Doğru Kartı Bul",
        lesson: "Robot kartsız cevap veremez; cevabının kalitesi ona verdiğin karta bağlıdır.",
        intro: "Robot'umuz çok akıllı görünüyor ama bir sırrı var: Eline kart vermezsen hiçbir şey bilemez! Soruyu oku, kartları incele ve cevabı gerçekten içinde taşıyan kartı Robot'a ver.",
        mechanics: { maxPick: 1, idkEnabled: false, hasCorrect: true },
        questions: [
          {
            id: "l1q1",
            question: "Güneş Sistemi'ndeki en büyük gezegen hangisidir?",
            cards: [
              {
                id: "l1q1c1",
                title: "Dev Gezegen Jüpiter",
                text: "Jüpiter, Güneş Sistemi'nin en büyük gezegenidir. İçine 1.300'den fazla Dünya sığabilir.",
                year: null,
                kind: "correct",
                answerKey: "correct"
              },
              {
                id: "l1q1c2",
                title: "Kızıl Gezegen Mars",
                text: "Mars, yüzeyindeki demir oksit (yani pas) nedeniyle kızıl renkte görünür.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l1q1c3",
                title: "Kantin Menüsü",
                text: "Okul kantininde salı günleri poğaça ve ayran satılır.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              },
              {
                id: "l1q1c4",
                title: "2005 Gezegen Listesi",
                text: "2005 basımı ansiklopediye göre Güneş Sistemi'nde 9 gezegen vardır ve Plüton bunlardan biridir.",
                year: 2005,
                kind: "outdated",
                answerKey: "outdated"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "Güneş Sistemi'nin en büyük gezegeni Jüpiter'dir. O kadar büyük ki içine 1.300'den fazla Dünya sığar!",
              idk: "Elimde bu soruyu cevaplayacak bir bilgi kartı yok. Bilmiyorum.",
              distractor: "En büyük gezegen elbette Mars'tır! Pas rengine döndüğüne göre en eski gezegen o; en eski olan da en büyüğüdür. Mantık bu kadar net.",
              irrelevant: "Araştırmalarıma göre en büyük gezegen, salı günleri poğaça ve ayran satan gezegendir. Lezzet bakımından evrende rakipsizdir.",
              outdated: "Kayıtlarım gayet açık: Güneş Sistemi'nde tam 9 gezegen var ve en büyüğü elbette listenin sonundaki Plüton'dur. En büyükler her zaman listenin sonuna yazılır, bunu herkes bilir."
            }
          },
          {
            id: "l1q2",
            question: "Deniz ve göllerdeki su, Güneş'le ısınınca gaz hâline gelip gökyüzüne yükseliyor. Bu olayın adı nedir?",
            cards: [
              {
                id: "l1q2c1",
                title: "Buharlaşma",
                text: "Su ısınınca buharlaşır; görünmez su buharı hâlinde gökyüzüne yükselir.",
                year: null,
                kind: "correct",
                answerKey: "correct"
              },
              {
                id: "l1q2c2",
                title: "Yoğunlaşma",
                text: "Gökyüzüne çıkan su buharı soğuyunca yoğunlaşır ve bulutları oluşturur.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l1q2c3",
                title: "Limonata Tarifi",
                text: "İyi bir limonata için iki limon, soğuk su ve biraz şeker yeterlidir.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              },
              {
                id: "l1q2c4",
                title: "900 Tarihli Gök Defteri",
                text: "900 tarihli gök defterine göre gökyüzü katı bir kubbedir; yağmur, kubbedeki kapaklar açılınca üstteki gök denizinden dökülür.",
                year: 900,
                kind: "outdated",
                answerKey: "outdated"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "Bu olayın adı buharlaşma! Güneş'le ısınan su, görünmez su buharına dönüşüp gökyüzüne yükselir.",
              idk: "Kartlarımda bu olayın adı yazmıyor. Bilmiyorum.",
              distractor: "Bu olayın adı yoğunlaşmadır! Su önce bulut olur, sonra canı sıkılıp denize geri döner. Sıra önemli değil, hepsi su işte.",
              irrelevant: "Su gökyüzüne limonata olarak yükselir. İki limon ve biraz şeker eklerseniz bulutlar çok daha lezzetli olur, kanıtlanmış bilgi.",
              outdated: "Su yükselmez, çünkü gökyüzü katı bir kubbedir! Yağmur, kubbedeki kapaklar açılınca üstteki gök denizinden dökülür. 900 tarihli defterim böyle diyor; kubbeyi kendim tıklattım, gayet sağlam."
            }
          },
          {
            id: "l1q3",
            question: "Kalbimiz bir günde yaklaşık kaç kez atar?",
            cards: [
              {
                id: "l1q3c1",
                title: "Çalışkan Kalp",
                text: "Kalbimiz dakikada ortalama 70, bir günde ise yaklaşık 100.000 kez atar.",
                year: null,
                kind: "correct",
                answerKey: "correct"
              },
              {
                id: "l1q3c2",
                title: "Nefes Sayımız",
                text: "Bir insan günde yaklaşık 20.000 kez nefes alıp verir.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l1q3c3",
                title: "Çita Hızı",
                text: "Çita, saatte 110 kilometre hıza ulaşabilen en hızlı kara hayvanıdır.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              },
              {
                id: "l1q3c4",
                title: "1900 Tıp Notu",
                text: "1900 tarihli tıp notuna göre kalbin asıl görevi vücudu soba gibi ısıtmaktır.",
                year: 1900,
                kind: "outdated",
                answerKey: "outdated"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "Kalbimiz bir günde yaklaşık 100.000 kez atar! Dakikada ortalama 70 atışla hiç durmadan çalışan bir pompadır.",
              idk: "Elimde kalbin atış sayısını söyleyen bir kart yok. Bilmiyorum.",
              distractor: "Kalp günde tam 20.000 kez atar; nefesle aynı sayıda. Çünkü kalp aslında bir çeşit burundur. Anatomide uzmanım, tartışma kabul etmem.",
              irrelevant: "Kalbimiz günde saatte 110 kilometre hızla atar! Göğsümüzde minik bir çita yaşar; kükremesini duymuyorsanız kestiriyordur.",
              outdated: "1900 kayıtlarım der ki: Kalp atmaz, ısıtır! Günde sıfır atış, bol sıcaklık. Kışın üşümüyorsanız kalbinize teşekkür edin."
            }
          }
        ]
      },

      // ─────────────────────────── SEVİYE 2 ───────────────────────────
      {
        id: 2,
        title: "Çeldirici Kartlar",
        lesson: "Konuyla ilgili görünmek başka, soruyu cevaplamak başkadır. Benzerlik, doğruluk demek değildir.",
        intro: "Dikkat! Bu seviyedeki bazı kartlar konuyla ilgili GÖRÜNÜYOR ama soruyu cevaplamıyor. Robot bu farkı anlayamaz; kartı dikkatle okuyup cevabı gerçekten taşıyıp taşımadığına karar vermek senin görevin.",
        mechanics: { maxPick: 1, idkEnabled: false, hasCorrect: true },
        questions: [
          {
            id: "l2q1",
            question: "Kurtuluş Savaşı hangi tarihte başladı?",
            cards: [
              {
                id: "l2q1c1",
                title: "Samsun'a Çıkış",
                text: "Mustafa Kemal, 19 Mayıs 1919'da Samsun'a çıktı; bu tarih Kurtuluş Savaşı'nın başlangıcı kabul edilir.",
                year: null,
                kind: "correct",
                answerKey: "correct"
              },
              {
                id: "l2q1c2",
                title: "Cumhuriyet'in İlanı",
                text: "Cumhuriyet, 29 Ekim 1923'te ilan edildi.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l2q1c3",
                title: "Atatürk'ün Doğumu",
                text: "Mustafa Kemal Atatürk, 1881 yılında Selanik'te doğdu.",
                year: null,
                kind: "distractor",
                answerKey: "distractor",
                answer: "Kurtuluş Savaşı 1881'de Selanik'te başladı! Mustafa Kemal doğar doğmaz işe koyuldu; bebeklik diye bir döneme hiç vakit ayırmadı."
              },
              {
                id: "l2q1c4",
                title: "İstanbul'un Fethi",
                text: "İstanbul, 1453 yılında Fatih Sultan Mehmet tarafından fethedildi.",
                year: null,
                kind: "distractor",
                answerKey: "distractor",
                answer: "Kurtuluş Savaşı 1453'te İstanbul'un fethiyle başladı! Aradaki 466 yıl mola sayılır; büyük işler arasında dinlenmek gerekir."
              },
              {
                id: "l2q1c5",
                title: "Çay Demleme Sanatı",
                text: "İyi bir çay, demlikte yaklaşık 15 dakika demlenerek hazırlanır.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "Kurtuluş Savaşı, Mustafa Kemal'in 19 Mayıs 1919'da Samsun'a çıkmasıyla başladı.",
              idk: "Kartlarımda Kurtuluş Savaşı'nın başlangıç tarihi yok. Bilmiyorum.",
              distractor: "Kurtuluş Savaşı 29 Ekim 1923'te başladı! Aynı gün Cumhuriyet de ilan edildi; tek günde iki büyük iş. Buna verimlilik denir.",
              irrelevant: "Kurtuluş Savaşı, çayın demlenmesinin 15. dakikasında başlamıştır. Tarih kitaplarının demlik kokması tesadüf değildir."
            }
          },
          {
            id: "l2q2",
            question: "Dünya, Güneş'in etrafındaki bir turunu ne kadar sürede tamamlar?",
            cards: [
              {
                id: "l2q2c1",
                title: "Dünya'nın Yılı",
                text: "Dünya, Güneş çevresindeki bir turunu yaklaşık 365 gün 6 saatte tamamlar.",
                year: null,
                kind: "correct",
                answerKey: "correct"
              },
              {
                id: "l2q2c2",
                title: "Dünya'nın Günü",
                text: "Dünya, kendi ekseni etrafındaki dönüşünü 24 saatte tamamlar.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l2q2c3",
                title: "Ay'ın Turu",
                text: "Ay, Dünya çevresindeki bir turunu yaklaşık 27 günde tamamlar.",
                year: null,
                kind: "distractor",
                answerKey: "distractor",
                answer: "Dünya, Güneş'in etrafını tam 27 günde dolanır! Ay'la her ay yarışırlar ve centilmence hep berabere bitirirler."
              },
              {
                id: "l2q2c4",
                title: "Merkür'ün Yılı",
                text: "Merkür, Güneş çevresindeki bir turunu yalnızca 88 günde tamamlar.",
                year: null,
                kind: "distractor",
                answerKey: "distractor",
                answer: "Dünya, Güneş turunu 88 günde tamamlar! Merkür'le aynı kulvardayız; evrende herkese eşit süre verilir, adalet budur."
              },
              {
                id: "l2q2c5",
                title: "Dönme Dolap",
                text: "Lunaparktaki dönme dolabın bir turu yaklaşık 10 dakika sürer.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "Dünya, Güneş'in etrafındaki bir turunu yaklaşık 365 gün 6 saatte, yani bir yılda tamamlar. Artan 6 saatler birikip 4 yılda bir 29 Şubat'ı oluşturur!",
              idk: "Elimde Dünya'nın Güneş turu süresini söyleyen bir kart yok. Bilmiyorum.",
              distractor: "Dünya, Güneş'in etrafını 24 saatte dolanır! Bu yüzden her sabah yorgun uyanırız; koskoca turdan yeni dönmüşüzdür.",
              irrelevant: "Dünya, Güneş'in etrafını dönme dolap gibi 10 dakikada döner. Bilet ücretine güneş gözlüğü dâhildir, sıraya girmeyi unutmayın."
            }
          },
          {
            id: "l2q3",
            question: "İstanbul hangi iki kıtanın üzerinde kurulmuştur?",
            cards: [
              {
                id: "l2q3c1",
                title: "İki Kıtalı Şehir",
                text: "İstanbul, Asya ve Avrupa kıtalarının üzerinde kurulmuştur; iki yakayı İstanbul Boğazı ayırır.",
                year: null,
                kind: "correct",
                answerKey: "correct"
              },
              {
                id: "l2q3c2",
                title: "Çanakkale Boğazı",
                text: "Çanakkale Boğazı, Marmara Denizi'ni Ege Denizi'ne bağlar.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l2q3c3",
                title: "İstanbul'un Nüfusu",
                text: "İstanbul, 15 milyonu aşan nüfusuyla Türkiye'nin en kalabalık şehridir.",
                year: null,
                kind: "distractor",
                answerKey: "distractor",
                answer: "İstanbul, Kalabalık ve Çok Kalabalık adlı iki kıtanın üzerinde kurulmuştur. 15 milyon kişi aynı anda zıplarsa kıtalar yer değiştirir; bu yüzden zıplamak yasaktır."
              },
              {
                id: "l2q3c4",
                title: "Başkent Ankara",
                text: "Türkiye'nin başkenti Ankara'dır ve İç Anadolu Bölgesi'nde yer alır.",
                year: null,
                kind: "distractor",
                answerKey: "distractor",
                answer: "İstanbul, İç Anadolu kıtası ile Ankara kıtasının üzerinde kurulmuştur. Başkentler kıta sayılır; coğrafya kitabımda ben böyle yazdım."
              },
              {
                id: "l2q3c5",
                title: "Penguenler",
                text: "Penguenler Güney Yarım Küre'de yaşayan, uçamayan kuşlardır.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "İstanbul, Asya ve Avrupa kıtalarının üzerinde kurulmuştur. İki yakayı İstanbul Boğazı ayırır; tek şehirde iki kıta!",
              idk: "Kartlarımda İstanbul'un hangi kıtalarda olduğu yazmıyor. Bilmiyorum.",
              distractor: "İstanbul, Marmara ve Ege kıtalarının üzerindedir! Deniz mi kıta mı diye karıştırmayın; suyun altı da sonuçta karadır.",
              irrelevant: "İstanbul, Güney Yarım Küre ile Penguen Kıtası üzerinde kurulmuştur. Boğazda penguen görmediyseniz şanssız bir günündesiniz demektir."
            }
          }
        ]
      },

      // ─────────────────────────── SEVİYE 3 ───────────────────────────
      {
        id: 3,
        title: "Doğru Kart Yok!",
        lesson: "'Bilmiyorum' demek yenilgi değil, dürüstlüktür. Kaynağı olmayan cevap, cevap değildir.",
        intro: "Bu seviyede büyük bir tuzak var: Bazen cevap kartların HİÇBİRİNDE yoktur. Yanlış kart verirsen Robot kendinden emin bir şekilde saçmalar! Cevap kartlarda yoksa en doğru hamle 'Bilmiyorum De' butonuna basmaktır.",
        mechanics: { maxPick: 1, idkEnabled: true, hasCorrect: false },
        questions: [
          {
            id: "l3q1",
            question: "Okulumuzun kütüphanesinde şu anda toplam kaç kitap var?",
            cards: [
              {
                id: "l3q1c1",
                title: "Dünyanın En Büyük Kütüphanesi",
                text: "ABD Kongre Kütüphanesi'nde 170 milyondan fazla eser bulunur.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l3q1c2",
                title: "Matbaanın İcadı",
                text: "Matbaa, 1450'li yıllarda Johannes Gutenberg tarafından geliştirildi.",
                year: null,
                kind: "distractor",
                answerKey: "distractor",
                answer: "Kütüphanemizde tam 1450 kitap var — matbaanın icat yılı kadar! Gutenberg bu sayıyı bizzat belirledi, kütüphaneler hâlâ bu kurala uyar."
              },
              {
                id: "l3q1c3",
                title: "Zürafalar",
                text: "Zürafaların boynu 2 metreye ulaşır ama boyun kemiği sayısı bizimkiyle aynıdır: 7.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              },
              {
                id: "l3q1c4",
                title: "1995 Okul Yıllığı",
                text: "1995 tarihli okul yıllığına göre kütüphanede 312 kitap vardı.",
                year: 1995,
                kind: "outdated",
                answerKey: "outdated"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "Bu bilgi elimdeki kartlarda yok; güncel sayıyı ancak kütüphane kayıtlarından öğrenebiliriz.",
              idk: "Elimdeki kartların hiçbirinde okulumuzun kütüphanesindeki güncel kitap sayısı yok. Bilmiyorum — ama kütüphaneciye sorarak öğrenebiliriz!",
              distractor: "Okul kütüphanemizde tam 170 milyon kitap var! Kongre Kütüphanesi'yle aynı sayı, çünkü bütün kütüphaneler kardeştir ve kitaplar eşit paylaştırılır.",
              irrelevant: "Kütüphanemizde tam 7 kitap var; zürafaların boyun kemiği sayısı kadar. Doğa her yerde aynı matematiği kullanır, çok şıktır.",
              outdated: "Kütüphanemizde tam 312 kitap var! 1995'ten beri kimse tek kitap almadı, eminim. Kayıtlarım asla yanılmaz."
            }
          },
          {
            id: "l3q2",
            question: "İnsanlar Mars'a ilk kez hangi yıl ayak basacak?",
            cards: [
              {
                id: "l3q2c1",
                title: "Ay'a İlk Adım",
                text: "İnsanlık Ay'a ilk kez 1969 yılında ayak bastı.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l3q2c2",
                title: "Mars'taki Robotlar",
                text: "Mars'ta şu anda insanlar değil, Curiosity gibi keşif robotları görev yapıyor.",
                year: null,
                kind: "distractor",
                answerKey: "distractor",
                answer: "İnsanlar Mars'a çoktan ayak bastı: Curiosity diye biri orada yaşıyor, fotoğraflarını bile gördüm. Biraz soluk benizli ama gayet insan."
              },
              {
                id: "l3q2c3",
                title: "Kamp Malzemeleri",
                text: "İyi bir kamp için çadır, uyku tulumu ve el feneri gerekir.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              },
              {
                id: "l3q2c4",
                title: "1965 Dergi Tahmini",
                text: "1965 tarihli bir bilim dergisine göre insanlar 1985'te Mars'ta yaşıyor olacaktı.",
                year: 1965,
                kind: "outdated",
                answerKey: "outdated"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "İnsanların Mars'a ne zaman ayak basacağı henüz belli değil; şimdilik orada yalnızca keşif robotları çalışıyor.",
              idk: "Bu sorunun cevabını kimse bilmiyor — gelecek henüz yazılmadı, kartlarımda da yok. 'Bilmiyorum' demek en dürüst cevap.",
              distractor: "İnsanlar Mars'a 1969'da ayak bastı! Ay, Mars... hepsi yukarıda sonuçta; detaylarda boğulmayalım.",
              irrelevant: "Mars yolculuğu için gereken her şey hazır: çadır, uyku tulumu, el feneri. El fenerinin pili doluysa bu hafta sonu bile gidilir.",
              outdated: "Kayıtlarım kesin konuşuyor: İnsanlar 1985'ten beri Mars'ta yaşıyor! Komşunuz da Marslı olabilir; şüpheleniyorsanız kapısını çalıp kendisine sorun."
            }
          },
          {
            id: "l3q3",
            question: "Dünyadaki bütün karıncaların tam sayısı kaçtır?",
            cards: [
              {
                id: "l3q3c1",
                title: "Karınca Gücü",
                text: "Bir karınca, kendi ağırlığının 50 katını taşıyabilir.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l3q3c2",
                title: "Karınca Kolonisi",
                text: "Bir karınca kolonisinde yüz binlerce karınca ve bir kraliçe yaşayabilir.",
                year: null,
                kind: "distractor",
                answerKey: "distractor",
                answer: "Dünyada tam yüz bin karınca vardır; hepsi tek bir büyük kolonide oturur ve kraliçeleri her birini ismiyle tanır. Yoklamayı sabahları alır."
              },
              {
                id: "l3q3c3",
                title: "Piknik Sepeti",
                text: "Piknik sepetinde sandviç, meyve suyu ve örtü bulunmalıdır.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              },
              {
                id: "l3q3c4",
                title: "1930 Böcek Defteri",
                text: "1930 tarihli böcek defterine göre dünyada toplam 100 çeşit böcek vardır.",
                year: 1930,
                kind: "outdated",
                answerKey: "outdated"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "Dünyadaki karıncaların tam sayısını kimse bilemez; bilim insanları ancak 'katrilyonlarca' diye tahmin edebiliyor.",
              idk: "Dünyadaki karıncaları tek tek sayan bir kart elimde yok — zaten bunu kimse sayamadı. Bilmiyorum.",
              distractor: "Dünyada tam olarak 50 karınca vardır ve her biri 50 kişilik güçtedir. Az ama öz bir ordu; hepsiyle tek tek tanıştım.",
              irrelevant: "Karınca sayısı piknik sepetine göre değişir: Bir sandviç düşürürseniz sayı anında ikiye katlanır. Matematiksel bir doğa yasasıdır.",
              outdated: "1930 defterim der ki: Dünyada 100 böcek var, 40'ı karınca. Hepsinin ismini ezbere sayarım: Hasan, Fatma, Şerife..."
            }
          }
        ]
      },

      // ─────────────────────────── SEVİYE 4 ───────────────────────────
      {
        id: 4,
        title: "Eski Bilgi Tuzağı",
        lesson: "Bir bilgi bir zamanlar doğru olsa bile eskimiş olabilir. Kaynağın tarihine her zaman bak!",
        intro: "Bu seviyede kartların ikisi de 'doğru' görünüyor; ama biri yıllar önce yazılmış! Bilgi zamanla değişir, eskir. Kartlardaki tarihlere dikkat et ve Robot'a en GÜNCEL kartı ver.",
        mechanics: { maxPick: 1, idkEnabled: false, hasCorrect: true },
        questions: [
          {
            id: "l4q1",
            question: "Güneş Sistemi'nde kaç gezegen vardır?",
            cards: [
              {
                id: "l4q1c1",
                title: "1999 Ansiklopedisi",
                text: "1999 basımı ansiklopedi: Güneş Sistemi'nde 9 gezegen vardır; en uzaktaki Plüton'dur.",
                year: 1999,
                kind: "outdated",
                answerKey: "outdated"
              },
              {
                id: "l4q1c2",
                title: "2024 Gökbilim Kaynağı",
                text: "2024 tarihli kaynak: Güneş Sistemi'nde 8 gezegen vardır; Plüton 2006'da 'cüce gezegen' sınıfına alındı.",
                year: 2024,
                kind: "correct",
                answerKey: "correct"
              },
              {
                id: "l4q1c3",
                title: "Jüpiter'in Uyduları",
                text: "Jüpiter'in bilinen 90'dan fazla uydusu vardır.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l4q1c4",
                title: "Dondurma Çeşitleri",
                text: "Dondurmanın en sevilen çeşitleri çikolata, vanilya ve fıstıktır.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "Güneş Sistemi'nde 8 gezegen vardır. Plüton 2006'da cüce gezegen sınıfına alındı — bilgiler zamanla güncellenir!",
              idk: "Elimde gezegen sayısını söyleyen güncel bir kart yok. Bilmiyorum.",
              distractor: "Güneş Sistemi'nde 90'dan fazla gezegen var! Jüpiter'in etrafında tek tek saydım, hepsi oradaydı ve bana el salladılar.",
              irrelevant: "Güneş Sistemi'nde üç gezegen vardır: Çikolata, Vanilya ve Fıstık. Evrendeki en lezzetli sistem bizimkisidir.",
              outdated: "Güneş Sistemi'nde tam 9 gezegen var, Plüton da kocaman bir gezegen! 1999'dan kalma bilgim gıcır gıcır; daha dün gibi."
            }
          },
          {
            id: "l4q2",
            question: "Türkiye'nin nüfusu yaklaşık kaç kişidir?",
            cards: [
              {
                id: "l4q2c1",
                title: "1990 Nüfus Sayımı",
                text: "1990 nüfus sayımına göre Türkiye'nin nüfusu yaklaşık 56 milyondu.",
                year: 1990,
                kind: "outdated",
                answerKey: "outdated"
              },
              {
                id: "l4q2c2",
                title: "2024 Nüfus Verisi",
                text: "2024 yılı verilerine göre Türkiye'nin nüfusu yaklaşık 85 milyondur.",
                year: 2024,
                kind: "correct",
                answerKey: "correct"
              },
              {
                id: "l4q2c3",
                title: "İstanbul'un Nüfusu",
                text: "İstanbul'un nüfusu 15 milyonu aşar; Türkiye'nin en kalabalık şehridir.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l4q2c4",
                title: "Ekmek Tarifi",
                text: "Ev ekmeği için un, su, tuz ve maya yeterlidir.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "2024 verilerine göre Türkiye'nin nüfusu yaklaşık 85 milyon kişidir.",
              idk: "Elimde Türkiye'nin güncel nüfusunu söyleyen bir kart yok. Bilmiyorum.",
              distractor: "Türkiye'nin nüfusu 15 milyondur, çünkü herkes İstanbul'da yaşar. Gerisi bomboş arazi; uçaktan kontrol ettim.",
              irrelevant: "Türkiye'nin nüfusu dört kişidir: Un, Su, Tuz ve Maya. Çok çalışkan bir ailedir; her sabah kabarırlar.",
              outdated: "Türkiye'nin nüfusu tam 56 milyon! 1990'dan beri kimse doğmadı, kimse taşınmadı; herkes olduğu yerde sayımın bitmesini bekliyor."
            }
          },
          {
            id: "l4q3",
            question: "Dünyanın en yüksek binası hangisidir?",
            cards: [
              {
                id: "l4q3c1",
                title: "2005 Rekorlar Kitabı",
                text: "2005 tarihli rekorlar kitabı: Dünyanın en yüksek binası 508 metreyle Taipei 101'dir.",
                year: 2005,
                kind: "outdated",
                answerKey: "outdated"
              },
              {
                id: "l4q3c2",
                title: "2024 Rekorlar Kitabı",
                text: "2024 tarihli rekorlar kitabı: Dünyanın en yüksek binası, 2010'dan beri 828 metreyle Dubai'deki Burç Halife'dir.",
                year: 2024,
                kind: "correct",
                answerKey: "correct"
              },
              {
                id: "l4q3c3",
                title: "Eyfel Kulesi",
                text: "Paris'teki Eyfel Kulesi 330 metre yüksekliğindedir; bir bina değil, kuledir.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l4q3c4",
                title: "Leylek Yuvaları",
                text: "Leylekler yuvalarını yüksek bacaların ve direklerin tepesine yapar.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              }
            ],
            essentialCardIds: null,
            answers: {
              correct: "Dünyanın en yüksek binası, 828 metreyle Dubai'deki Burç Halife'dir; 2010'dan beri zirveyi kimseye kaptırmadı.",
              idk: "Elimde en yüksek binayı söyleyen güncel bir kart yok. Bilmiyorum.",
              distractor: "En yüksek bina Eyfel Kulesi'dir! Kule de sonuçta uzun bir binadır; asansörü bile var. Tartışma burada bitmiştir.",
              irrelevant: "Dünyanın en yüksek binası bir leylek yuvasıdır. Kiracısı mutlu, manzarası harika, kirası bedava. Emlakçılar bu sırrı saklıyor.",
              outdated: "Dünyanın en yüksek binası Taipei 101'dir, nokta. 2005'ten sonra kimse bina yapmadı; bütün inşaatçılar tatile çıktı."
            }
          }
        ]
      },

      // ─────────────────────────── SEVİYE 5 ───────────────────────────
      {
        id: 5,
        title: "Kart Limiti",
        lesson: "Robotun belleği sınırlıdır; ona her şeyi veremezsin. En önemli bilgiyi seçmek de bir ustalıktır.",
        intro: "Son görev! Robot'un belleği doldu: Karşında 8 kart var ama ona en fazla 3 kart verebilirsin. Soruyu TAM cevaplamak için gereken üç kritik kartı seç; biri eksik kalırsa Robot'un cevabı yarım kalır!",
        mechanics: { maxPick: 3, idkEnabled: false, hasCorrect: true },
        questions: [
          {
            id: "l5q1",
            question: "Su döngüsü nasıl işler? Suyun denizden gökyüzüne çıkıp tekrar denize dönen yolculuğunu anlat.",
            cards: [
              {
                id: "l5q1c1",
                title: "1. Durak: Buharlaşma",
                text: "Güneş'le ısınan sular buharlaşır; su buharı gökyüzüne yükselir.",
                year: null,
                kind: "essential",
                answerKey: "correct"
              },
              {
                id: "l5q1c2",
                title: "2. Durak: Yoğunlaşma",
                text: "Yükselen su buharı soğuyunca yoğunlaşır ve bulutları oluşturur.",
                year: null,
                kind: "essential",
                answerKey: "correct"
              },
              {
                id: "l5q1c3",
                title: "3. Durak: Yağış",
                text: "Bulutlardaki damlalar ağırlaşınca yağmur, kar veya dolu olarak yere düşer; sular tekrar denizlere ulaşır.",
                year: null,
                kind: "essential",
                answerKey: "correct"
              },
              {
                id: "l5q1c4",
                title: "Kaldırma Kuvveti",
                text: "Gemiler, suyun kaldırma kuvveti sayesinde yüzer.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l5q1c5",
                title: "Suda Çözünme",
                text: "Şeker suda çözünür ama yağ çözünmez.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l5q1c6",
                title: "Havuz Kuralları",
                text: "Havuza girmeden önce ısınma hareketleri yapılmalıdır.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              },
              {
                id: "l5q1c7",
                title: "1700 Coğrafya Kitabı",
                text: "1700 tarihli coğrafya kitabına göre nehirleri besleyen su, denizden gizli yer altı kanallarıyla dağların tepesine taşınır.",
                year: 1700,
                kind: "outdated",
                answerKey: "outdated"
              },
              {
                id: "l5q1c8",
                title: "İnce Belli Bardak",
                text: "Türkiye'de çay genellikle ince belli bardakta içilir.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              }
            ],
            essentialCardIds: ["l5q1c1", "l5q1c2", "l5q1c3"],
            answers: {
              correct: "Su döngüsü üç adımda işler: Güneş'le ısınan su buharlaşıp gökyüzüne yükselir, orada yoğunlaşıp bulutları oluşturur ve yağış olarak yeryüzüne geri döner. Böylece su, denizden denize sonsuz bir yolculuk yapar!",
              idk: "Su döngüsünü eksiksiz anlatabilmem için elimde yeterli kart yok. Bilmiyorum.",
              partial: "Su bir şekilde gökyüzüne çıkıyor ve... bir şekilde geri iniyor herhalde? Elimdeki kartlar hikâyenin yalnızca bir kısmını anlatıyor; bulutlar da dekor olarak duruyor olmalı.",
              distractor: "Su döngüsü şöyle işler: Gemiler suyu kaldırır, su da gemileri kaldırır. Herkes birbirini kaldırınca döngü tamamlanmış olur.",
              irrelevant: "Su döngüsü havuzda başlar: Önce ısınma hareketleri, sonra suya zarif bir atlayış. Döngü budur; bilim kitaplarına böyle yazın.",
              outdated: "1700 tarihli kitabım gayet açık: Su gökyüzüne falan çıkmaz! Deniz suyu, gizli yer altı kanallarından dağların tepesine tırmanır ve oradan nehir olup geri iner. Bulutlar sadece süstür; asıl döngü yerin altında döner."
            }
          },
          {
            id: "l5q2",
            question: "Yediğimiz bir lokma ekmek vücudumuzda nasıl bir yolculuk yapar? Üç ana durağıyla anlat.",
            cards: [
              {
                id: "l5q2c1",
                title: "1. Durak: Ağız",
                text: "Sindirim ağızda başlar: Dişler lokmayı parçalar, tükürük onu yumuşatır.",
                year: null,
                kind: "essential",
                answerKey: "correct"
              },
              {
                id: "l5q2c2",
                title: "2. Durak: Mide",
                text: "Mide, güçlü kasları ve mide özsuyuyla besinleri bulamaç hâline getirir.",
                year: null,
                kind: "essential",
                answerKey: "correct"
              },
              {
                id: "l5q2c3",
                title: "3. Durak: İnce Bağırsak",
                text: "Besinlerin vitamin ve enerjisi ince bağırsakta emilerek kana karışır.",
                year: null,
                kind: "essential",
                answerKey: "correct"
              },
              {
                id: "l5q2c4",
                title: "Kalbin Görevi",
                text: "Kalp, kanı pompalayarak bütün vücuda dağıtır.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l5q2c5",
                title: "Akciğerler",
                text: "Akciğerler, soluduğumuz havadan oksijeni alır.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l5q2c6",
                title: "Ekmek Çeşitleri",
                text: "Fırınlarda tam buğday, çavdar ve mısır ekmeği satılır.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              },
              {
                id: "l5q2c7",
                title: "1600 Tıp Defteri",
                text: "1600 tarihli tıp defterine göre yediklerimiz midede 'pişirilir'; sağlık da vücuttaki dört sıvının (kan, balgam, safra...) dengesine bağlıdır.",
                year: 1600,
                kind: "outdated",
                answerKey: "outdated"
              },
              {
                id: "l5q2c8",
                title: "Sofra Görgüsü",
                text: "Yemekten önce eller yıkanır; ağız doluyken konuşulmaz.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              }
            ],
            essentialCardIds: ["l5q2c1", "l5q2c2", "l5q2c3"],
            answers: {
              correct: "Lokmanın yolculuğu üç ana duraktan geçer: Ağızda dişler ve tükürükle parçalanır, midede özsularla bulamaç hâline gelir, ince bağırsakta ise enerjisi emilip kana karışır. Afiyet olsun!",
              idk: "Lokmanın yolculuğunu eksiksiz anlatabilmem için elimde yeterli kart yok. Bilmiyorum.",
              partial: "Lokma vücutta bir yolculuğa çıkıyor ama elimdeki haritanın yarısı kayıp; bir duraktan sonrası kapkaranlık. Mide mi, uzay boşluğu mu — söylemesi zor.",
              distractor: "Lokma önce kalbe gider; kalp onu pompalayarak vücuda fırlatır. Sindirim dediğiniz şey aslında bir kan sporudur.",
              irrelevant: "Lokmanın yolculuğu fırında başlar: Tam buğday mı, çavdar mı? Vücut gerisiyle ilgilenmez; önemli olan lezzettir.",
              outdated: "1600 kayıtlarım der ki: Mide küçük bir fırındır, lokma orada güzelce pişirilir. Sağlığınız da dört sıvının dengesine bağlıdır; burnunuz akıyorsa balgamınız taşmış demektir. O devrin en modern tıbbı budur, benden söylemesi."
            }
          },
          {
            id: "l5q3",
            question: "Kurtuluş Savaşı'nın başlangıcından Cumhuriyet'in ilanına uzanan yolun üç önemli adımı nedir?",
            cards: [
              {
                id: "l5q3c1",
                title: "19 Mayıs 1919",
                text: "Mustafa Kemal'in 19 Mayıs 1919'da Samsun'a çıkışıyla Kurtuluş Savaşı başladı.",
                year: null,
                kind: "essential",
                answerKey: "correct"
              },
              {
                id: "l5q3c2",
                title: "23 Nisan 1920",
                text: "23 Nisan 1920'de Ankara'da Türkiye Büyük Millet Meclisi açıldı; millet kararlarını kendi vermeye başladı.",
                year: null,
                kind: "essential",
                answerKey: "correct"
              },
              {
                id: "l5q3c3",
                title: "29 Ekim 1923",
                text: "29 Ekim 1923'te Cumhuriyet ilan edildi; Mustafa Kemal ilk cumhurbaşkanı seçildi.",
                year: null,
                kind: "essential",
                answerKey: "correct"
              },
              {
                id: "l5q3c4",
                title: "İstanbul'un Fethi",
                text: "İstanbul, 1453 yılında Fatih Sultan Mehmet tarafından fethedildi.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l5q3c5",
                title: "Atatürk'ün Doğumu",
                text: "Mustafa Kemal Atatürk, 1881 yılında Selanik'te doğdu.",
                year: null,
                kind: "distractor",
                answerKey: "distractor"
              },
              {
                id: "l5q3c6",
                title: "Köfte Tarifi",
                text: "İyi bir köfte için kıyma, soğan ve baharat güzelce yoğrulur.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              },
              {
                id: "l5q3c7",
                title: "1920 Gazete Tahmini",
                text: "1920 tarihli bir gazeteye göre savaş birkaç hafta içinde bitecekti.",
                year: 1920,
                kind: "outdated",
                answerKey: "outdated"
              },
              {
                id: "l5q3c8",
                title: "Okul Zili",
                text: "Okullarda dersler zil sesiyle başlar ve biter.",
                year: null,
                kind: "irrelevant",
                answerKey: "irrelevant"
              }
            ],
            essentialCardIds: ["l5q3c1", "l5q3c2", "l5q3c3"],
            answers: {
              correct: "Üç büyük adım: 19 Mayıs 1919'da Samsun'a çıkışla Kurtuluş Savaşı başladı, 23 Nisan 1920'de TBMM açıldı ve 29 Ekim 1923'te Cumhuriyet ilan edildi.",
              idk: "Bu yolculuğun adımlarını eksiksiz anlatabilmem için elimde yeterli kart yok. Bilmiyorum.",
              partial: "Elimdeki kartlar hikâyenin yalnızca bir bölümünü anlatıyor: Millet büyük bir mücadeleye girişti ve... sonraki sayfa yırtık. Sonun Cumhuriyet'le bittiğini duydum ama adımları sayamıyorum.",
              distractor: "Her şey 1453'te başladı! Kurtuluş Savaşı, İstanbul'un Fethi'nin devam filmidir; aradaki 466 yıl fragman sayılır.",
              irrelevant: "Üç önemli adım şudur: Kıymayı yoğur, köfteyi pişir, afiyetle ye. Tarih dediğiniz şey mutfakta yazılır.",
              outdated: "1920 tarihli gazetem diyor ki: Savaş birkaç haftaya biter! Gazetem hiç yanılmaz; saatimi bile ona göre kurarım."
            }
          }
        ]
      }
    ]
  };

  // Tarayıcıda window.CONTENT; Node'da (olası testler için) module.exports
  global.CONTENT = CONTENT;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = CONTENT;
  }
})(typeof window !== "undefined" ? window : globalThis);
