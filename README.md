# Metin Parçalama (Chunking) Stratejileri Demo Sitesi

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Canlı Demo](https://img.shields.io/badge/Demo-Canl%C4%B1_Yay%C4%B1n-success?style=flat-square&logo=github)](https://ismntr.github.io/-Chunking-Stratejileri/)

Bu proje, Büyük Dil Modelleri (LLM) ve Retrieval-Augmented Generation (RAG) sistemleri için hayati öneme sahip olan "Metin Parçalama (Chunking)" konseptini gerçek dünya senaryoları ve interaktif bir Canvas simülasyonu ile anlatan **premium, statik ve açık kaynaklı bir web sitesidir**.

## 📖 Proje Hakkında
RAG sistemlerinin başarısı büyük ölçüde verinin nasıl parçalandığına (chunking) bağlıdır. Bu proje, karmaşık chunking stratejilerini (sabit boyutlu, anlamsal, yapısal ve hiyerarşik) görselleştirerek anlaşılmasını kolaylaştırmayı hedefler. Sitede yer alan interaktif simülasyon sayesinde, metinlerin arka planda nasıl işlendiği ve vektör veritabanlarına nasıl hazırlandığı adım adım incelenebilir.

## 🎯 Projenin Amacı ve Hedef Kitlesi
Bu siteyi, karmaşık bir konu olan "Metin Parçalama (Chunking)" stratejilerini geliştiriciler, yapay zeka meraklıları ve bu alana yeni başlayan herkes için anlaşılır kılmak amacıyla hazırladım. Sitedeki interaktif simülasyonlar ve gerçek dünya örnekleri sayesinde, dümdüz metin okumak yerine arka planda algoritmaların metinleri nasıl parçalara ayırdığını görsel olarak deneyimleyebilir ve öğrenebilirsiniz.

## 🛠 Teknolojiler ve Dosya Yapısı

- **HTML5:** `index.html` içinde anlamsal (semantic) web standartları kullanılmıştır.
- **Vanilla (Saf) CSS:** `css/style.css` dosyası içinde herhangi bir kütüphane kullanılmadan modern *Glassmorphism* (buzlu cam), gradient text (geçişli metin) ve özel animasyon teknikleri kodlanmıştır.
- **Vanilla JS:** `js/simulation.js` dosyası ile HTML5 Canvas üzerinde çalışan canlı, interaktif parçalama laboratuvarı geliştirilmiştir.

## 🧠 Anlatılan Stratejiler

### 1. Sabit Boyutlu Parçalama (Fixed-Size Chunking)
Klasik ve en temel parçalama yöntemidir. Metinleri belirli bir karakter veya kelime (token) sayısına ulaşıldığında doğrudan keser.
- **Nasıl Çalışır?** Belirlenen bir limite (örneğin her 500 kelime) ulaşıldığında metni böler, kesişim (overlap) bırakarak önceki metinle bağlantı kurmaya çalışır.
- **Avantajları:** Uygulaması en kolay ve en hızlı yöntemdir. Hangi verinin geleceği belli olmayan dosyalarda işe yarar.
- **Dezavantajları:** Anlam bütünlüğüne hiç dikkat etmez. Cümleleri ortasından keserek yapay zekanın (LLM) bağlamı kaybetmesine yol açar.

### 2. Anlamsal Parçalama (Semantic Chunking)
Metni matematiksel sınırlarına göre değil, taşıdığı anlama göre parçalar.
- **Nasıl Çalışır?** Cümleleri ve paragrafları algılar. Kesme işlemini nokta (.), soru işareti (?) gibi mantıklı yerlerden yapar.
- **Avantajları:** Bağlam (context) asla bozulmaz. Hukuki belgeler ve sözleşmeler için kusursuzdur.
- **Dezavantajları:** Kod parçaları veya karmaşık tablolarda yetersiz kalabilir.

### 3. Hiyerarşik Parçalama (Parent-Child Chunking)
Büyük belgelerde arama hassasiyetini artırmak için metni önce küçük, sonra büyük parçalara ayıran gelişmiş bir mimaridir.
- **Nasıl Çalışır?** Arama işleminin "cümle" (Child) bazında, yapay zekaya okutma işleminin ise o cümlenin bulunduğu "sayfa" (Parent) bazında yapılmasını sağlar.
- **Avantajları:** Hem spesifik kelimeleri (hata kodları vb.) çok hızlı bulur, hem de yapay zekaya geniş bağlam sunar. Devasa kurumsal arşivler için endüstri standardıdır.
- **Dezavantajları:** Vektör veritabanı kurgusu karmaşıktır ve ekstra veri alanı gerektirir.

## 🚀 Çalıştırma ve Kurulum
Projeyi çalıştırmak için herhangi bir sunucu kurulumuna veya derleme aracına ihtiyacınız yoktur:
1. Proje dosyalarını bilgisayarınıza indirin.
2. `index.html` dosyasına çift tıklayarak tarayıcınızda açın.
3. Veya projenizi GitHub Pages üzerinden ücretsiz olarak kendi kullanıcı adınızla (`https://KULLANICI_ADINIZ.github.io/-Chunking-Stratejileri/`) kolayca yayınlayabilirsiniz.

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır. Tamamen açık kaynaktır; özgürce kullanabilir, değiştirebilir ve kendi projelerinizde (ticari dahil) dağıtabilirsiniz.
