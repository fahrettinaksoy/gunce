# Günce — Kapsamlı Teknik Analiz ve Mimari Raporu

**Proje:** Günce — Türkiye Odaklı Çoklu Platform Günlük Yaşam Asistanı
**Hedef Platformlar:** Linux, macOS, Windows, Android, iOS
**Tarih:** Temmuz 2026

---

## 1. Yönetici Özeti

Günce; hava durumu, döviz kurları, spor sonuçları, namaz vakitleri ve nöbetçi eczane bilgilerini tek bir uygulamada birleştiren, Türkiye kullanıcı kitlesine odaklanmış çoklu platform bir uygulamadır. Belirlenen teknoloji yığını — **Tauri v2, Vue 3, Vuetify, Vue Router, Pinia, VueUse, Vue I18n** — tek bir web tabanlı kod tabanından hem masaüstü (Linux/macOS/Windows) hem de mobil (Android/iOS) hedeflere derleme yapılmasına imkân tanır. Bu, senin Connexa ve Antiphon projelerinde izlediğin "tek codebase, native shell" felsefesiyle birebir örtüşüyor; Antiphon'da Tauri v2'yi zaten değerlendirmiştin, Günce bu kararı mobil tarafa da taşıyor.

Tauri v2'nin resmi konumlandırması tam olarak bu ihtiyaca hizmet ediyor: <cite index="1-1">tek bir kod tabanından Linux, macOS, Windows, Android ve iOS için uygulama geliştirilebiliyor; frontend JavaScript ile, uygulama mantığı Rust ile yazılıyor, sisteme derin entegrasyon için Swift ve Kotlin kullanılabiliyor.</cite> Bu mimari, Günce'nin ihtiyaç duyduğu native entegrasyonlar (konum servisleri, bildirimler, arka plan senkronizasyonu, widget'lar) için doğru temeli sağlıyor.

Rapor; teknoloji yığını analizini, önerilen mimariyi, veri kaynağı stratejisini, tasarım sistemini, geliştirme sürecini ve yol haritasını kapsıyor.

---

## 2. Teknoloji Yığını Analizi

### 2.1 Tauri v2 — Uygulama Çatısı

**Neden Tauri v2:**
- Rust tabanlı native shell → Electron'a göre çok daha küçük binary boyutu (bazı senaryolarda 600KB'a kadar düşebiliyor) ve daha düşük bellek tüketimi.
- **Tek codebase, 5 platform**: Linux, macOS, Windows, Android, iOS resmi olarak destekleniyor. Bu, ayrı native mobil ekip kurma zorunluluğunu ortadan kaldırıyor.
- Sistemin native web renderer'ını kullanması (WebView2/WebKit/WebKitGTK) sayesinde Chromium bundling gerektirmiyor — bu da kurulum boyutunu ciddi şekilde düşürüyor.
- Güvenlik, Tauri ekibinin en öncelikli tasarım kriteri; capability-based permission sistemi ile frontend'in native API'lere erişimi granüler şekilde kısıtlanabiliyor. Bu, Connexa'daki vault mimarine benzer bir "az yetki, çok kontrol" felsefesiyle uyumlu.

**Riskler / Dikkat Noktaları:**
- Mobil tarafta (Android/iOS) WebView motoru farklılıkları (Android WebView vs. iOS WKWebView) CSS/JS uyumluluk testleri gerektirir.
- Native modül geliştirmek istersen (örn. arka planda konum takibi, push notification) Rust + Kotlin/Swift plugin yazımı öğrenme eğrisi getirir — ancak resmi Tauri plugin ekosistemi (`tauri-plugin-geolocation`, `tauri-plugin-notification`, `tauri-plugin-store` vb.) bunun büyük kısmını hazır sunuyor.
- iOS App Store ve Google Play politikaları, WebView tabanlı uygulamalara bazen ekstra inceleme getirebilir; bu nedenle "sadece web sarmalayıcısı" değil, gerçek native özellik kullanan (bildirim, widget, konum) bir uygulama olarak konumlandırmak önemli.

### 2.2 Vue 3 (Composition API) — Frontend Framework

Belirtilmemiş olsa da Vuetify/Router/Pinia/VueUse/I18n hepsi Vue 3 ekosistemine ait. Composition API + `<script setup>` sözdizimi öneriyorum:
- Habertürk'teki Vue.js/Vuetify deneyimin doğrudan buraya taşınabilir.
- TypeScript ile strict typing (senin Laravel tarafındaki strict typing prensibinle tutarlı) — özellikle API response tiplerini (hava durumu, döviz, namaz vakti) modelleme için kritik.

### 2.3 Vuetify — UI Component Kütüphanesi

- Material Design 3 tabanlı, hazır component seti (kart, liste, bottom navigation, dialog) sayesinde 5 platformda tutarlı bir "app-like" his sağlar.
- Dark/Light tema desteği yerleşik — namaz vakti bildirimleri gece modunda özellikle önemli bir UX detayı.
- Grid sistemi responsive tasarımı hem masaüstü geniş ekranlarda hem mobilde dar ekranlarda kolaylaştırır.
- Dikkat: Vuetify'ın bundle boyutu görece büyük olabilir; tree-shaking ve `vite-plugin-vuetify` ile otomatik import kullanımı şart, aksi halde mobilde ilk açılış süresi zarar görür.

### 2.4 Vue Router — Navigasyon

- SPA içi sayfa geçişleri (Ana Sayfa, Hava Durumu, Döviz, Spor, Namaz Vakitleri, Eczane, Ayarlar) için standart çözüm.
- Mobilde "sekme tabanlı" (bottom navigation) bir yapı düşünüldüğünde, route'ları modüler tutup her modülü lazy-load etmek (`() => import(...)`) başlangıç yükleme süresini optimize eder.
- Nested route yapısı, örneğin `/eczane/:sehir/:ilce` gibi konum bazlı derinlemesine sayfalar için uygun.

### 2.5 Pinia — State Management

- Vuex'in yerini alan resmi state yönetim çözümü; Composition API ile doğal uyum.
- Günce için önerilen store yapısı:
  - `useLocationStore` — kullanıcının şehir/ilçe/GPS konumu
  - `useWeatherStore` — hava durumu verisi + cache timestamp
  - `useCurrencyStore` — döviz kurları + favori kur listesi
  - `useSportsStore` — favori takımlar, maç sonuçları
  - `usePrayerTimesStore` — namaz vakitleri, bildirim ayarları
  - `usePharmacyStore` — nöbetçi eczane listesi, konum bazlı filtre
  - `useSettingsStore` — tema, dil, bildirim tercihleri
- Pinia'nın `persist` eklentisi (`pinia-plugin-persistedstate`) ile local state'in cihazda kalıcı hale getirilmesi, özellikle offline-first yaklaşım için gerekli (örn. son çekilen namaz vakti verisi internet olmasa da gösterilebilmeli).

### 2.6 VueUse — Composable Yardımcı Kütüphane

Günce'nin veri yoğun doğası düşünüldüğünde VueUse'un şu composable'ları doğrudan işine yarayacak:
- `useGeolocation` — konum bazlı eczane/namaz vakti hesaplama
- `useIntervalFn` / `useTimeoutPoll` — döviz kurlarının periyodik güncellenmesi
- `useOnline` — offline/online durum takibi, cache fallback tetikleme
- `useStorage` — basit key-value ayarların (tema, dil, favori şehir) localStorage/cihaz depolamasına yazılması
- `useDark` — sistem temasıyla senkron dark mode
- `usePreferredLanguages` — cihaz dili tespiti, i18n varsayılan dili belirleme

### 2.7 Vue I18n — Çoklu Dil Desteği

- Uygulama birincil olarak Türkçe olsa da, İstanbul'daki turist yoğunluğu ve global App Store/Play Store potansiyeli göz önüne alınırsa İngilizce (ve belki Arapça — namaz vakitleri özelliği düşünüldüğünde bölgesel talep yaratabilir) ikinci öncelikli dil olabilir.
- Sayı/tarih formatlaması (`Intl` entegrasyonu) döviz ve namaz vakti gösteriminde kritik — Vue I18n'in built-in number/datetime formatting özellikleri kullanılmalı.
- Lazy-loaded dil paketleri, başlangıç bundle boyutunu küçük tutar.

---

## 3. Önerilen Mimari

### 3.1 Genel Katmanlı Yapı

```
gunce/
├── src/
│   ├── app/
│   │   ├── router/            (Vue Router tanımları, route guard'lar)
│   │   ├── stores/             (Pinia store'ları)
│   │   ├── plugins/             (Vuetify, i18n, pinia-persist init)
│   │   └── App.vue
│   ├── modules/
│   │   ├── weather/
│   │   │   ├── components/
│   │   │   ├── composables/     (useWeatherData, useWeatherIcon)
│   │   │   ├── services/        (weather API adapter)
│   │   │   └── types/
│   │   ├── currency/
│   │   ├── sports/
│   │   ├── prayer-times/
│   │   ├── pharmacy/
│   │   └── settings/
│   ├── shared/
│   │   ├── components/          (BaseCard, EmptyState, ErrorBoundary)
│   │   ├── composables/         (useNetworkStatus, useCache)
│   │   └── utils/
│   ├── locales/                 (tr.json, en.json)
│   └── main.ts
├── src-tauri/
│   ├── src/                     (Rust: komutlar, arka plan görevler)
│   ├── capabilities/             (Tauri v2 izin/capability tanımları)
│   ├── gen/
│   │   ├── android/
│   │   └── apple/
│   └── tauri.conf.json
└── tests/
```

Bu yapı, senin TransferCab'de kullandığın modüler/adapter pattern felsefesini frontend tarafına taşıyor: her veri kaynağı (hava durumu, döviz, spor vb.) kendi izole modülü, kendi servis adaptörü ve kendi tipleriyle var oluyor — birbirine sıkı bağlı değil.

### 3.2 Veri Katmanı — Adapter Pattern

NewsPull ve PodcastDistributor projelerinde kullandığın adapter pattern burada da doğal bir fit:

```
IWeatherProvider (interface)
  ├── OpenMeteoAdapter
  └── (yedek sağlayıcı, gerekirse) MgmAdapter

ICurrencyProvider
  ├── TCMBAdapter (Türkiye Cumhuriyet Merkez Bankası)
  └── ExchangeRateApiAdapter (yedek)

IPrayerTimesProvider
  └── DiyanetAdapter (Diyanet İşleri Başkanlığı resmi API/veri seti)

IPharmacyProvider
  └── EczaneBulAdapter (il/ilçe bazlı nöbetçi eczane kaynağı)
```

Bu yaklaşımın avantajı: bir veri sağlayıcı API'si değiştiğinde veya kota/erişim sorunu yaşandığında sadece adapter katmanı değişir, iş mantığı ve UI etkilenmez — tıpkı NewsPull'daki AA/İHA/DHA adaptörlerinde olduğu gibi.

### 3.3 Cache ve Offline Stratejisi

Habertürk'teki Redis→MongoDB→MySQL waterfall cache mimarini burada istemci tarafına uyarlamak mantıklı:

1. **Bellek içi (Pinia state)** — anlık kullanım, en hızlı erişim
2. **Cihaz depolama (Tauri Store plugin / VueUse `useStorage`)** — son başarılı veri, offline fallback
3. **Ağ isteği** — arka planda tazeleme, stale-while-revalidate deseni

Namaz vakitleri ve döviz kurları gibi "günlük değişen ama kritik" veriler için özellikle offline-first yaklaşım şart — kullanıcı metroda/uçakta interneti olmasa bile son bilinen veriyi görebilmeli.

### 3.4 Arka Plan Görevleri ve Bildirimler

Tauri v2'nin Rust tarafı, arka planda periyodik veri çekme (örn. günde 1 kez namaz vakti güncelleme, saatte 1 kez döviz kuru) için native scheduler kullanılmasına olanak tanır. Bildirim tetikleme (`tauri-plugin-notification`) ile:
- Namaz vakti yaklaşma bildirimi
- Belirlenen döviz kuru eşik bildirimi (örn. "Dolar 35 TL'yi geçti")
- Favori takımın maç başlangıç bildirimi

Bu özellikler masaüstünde sistem tepsisi (tray) entegrasyonuyla, mobilde ise native push/local notification API'leriyle sağlanır.

---

## 4. Platform Stratejisi

| Platform | Dağıtım Kanalı | Özel Dikkat Noktaları |
|---|---|---|
| Windows | MSI/NSIS installer, Microsoft Store (opsiyonel) | WebView2 runtime bağımlılığı, otomatik güncelleme (Tauri Updater) |
| macOS | .dmg, Mac App Store (opsiyonel) | Code signing + notarization zorunlu, Apple Developer hesabı gerekir |
| Linux | .deb, .rpm, AppImage, Flatpak | Dağıtım çeşitliliği nedeniyle AppImage öncelikli olabilir |
| Android | Google Play, APK (yan yükleme) | Play Store politikaları (bildirim izinleri, arka plan konum kısıtları) |
| iOS | App Store | Apple'ın WebView tabanlı uygulamalara yaklaşımı — native hissiyat şart, review süreci daha sıkı |

Masaüstü ve mobil arasında **UI yoğunluğu farkı** gözetilmeli: Vuetify'ın responsive grid'i temel çözümü sağlasa da, masaüstünde çoklu sütun dashboard görünümü (hava durumu + döviz + namaz vakti aynı ekranda), mobilde ise tek sütun + bottom navigation tercih edilmeli. Bu, tek codebase içinde `useDisplay()` (Vuetify composable) ile platform/ekran boyutuna göre koşullu render ile çözülebilir.

---

## 5. Veri Kaynakları ve API Stratejisi

| Modül | Önerilen Birincil Kaynak | Not |
|---|---|---|
| Hava Durumu | Open-Meteo (ücretsiz, API key gerektirmez) veya MGM açık veri | Türkiye şehir/ilçe granülaritesi test edilmeli |
| Döviz | TCMB EVDS API | Resmi ve güvenilir, günlük kur için ideal; anlık kur için ek ticari API gerekebilir |
| Spor | API-Football veya benzeri ticari API | Süper Lig + popüler Avrupa ligleri kapsamı fiyatlandırmaya göre değerlendirilmeli |
| Namaz Vakitleri | Diyanet İşleri Başkanlığı resmi veri seti | 81 il + ilçe bazlı hesaplama; Habertürk Radyo projendeki 81 il yapısıyla doğrudan örtüşüyor |
| Nöbetçi Eczane | İl bazlı eczacı odası API'leri / açık veri | Standart bir ulusal API yok, il bazlı entegrasyon karmaşıklığı en yüksek modül olacak |

**Kritik risk:** Nöbetçi eczane verisi Türkiye'de merkezi/standart bir API ile sunulmuyor; çoğu il eczacı odası kendi sistemine sahip. Bu modül, kapsamı MVP'de büyükşehirlerle (İstanbul, Ankara, İzmir) sınırlı tutup kademeli genişletme gerektirebilir.

---

## 6. Tasarım Sistemi

- **Marka dili:** "Günce" ismi zaten bir günlük/yol arkadaşı metaforu taşıyor; tasarımda sıcak, güven veren, "her sabah açtığın" bir his hedeflenmeli — aşırı kurumsal değil.
- **Renk paleti:** Vuetify tema sistemi üzerinden, gündüz/gece moduna duyarlı iki ayrı palet. Namaz vakti modülü özelinde yeşil/toprak tonları, döviz modülünde nötr mavi/gri, hava durumu modülünde dinamik (bulutlu/güneşli durumla değişen) renk vurguları düşünülebilir.
- **Tipografi:** Türkçe karakter desteği (ğ, ş, ı, ö, ü, ç) tam uyumlu bir font ailesi (Inter, Roboto veya Noto Sans) — Vuetify varsayılanı Roboto zaten güvenli bir seçim.
- **İkonografi:** Hava durumu için animasyonlu SVG ikon seti (statik yerine) kullanıcı deneyimini belirgin şekilde iyileştirir.
- **Bottom Navigation (mobil) / Sidebar (masaüstü):** Vuetify'ın `v-bottom-navigation` ve `v-navigation-drawer` bileşenleri, aynı route yapısını iki farklı düzende sunmaya izin verir.

---

## 7. Geliştirme Süreci

### Faz 1 — Temel (4-6 hafta)
- Proje iskeleti: Tauri v2 + Vue 3 + Vite kurulumu, Vuetify/Router/Pinia/VueUse/I18n entegrasyonu
- Masaüstü hedefleri (Windows/macOS/Linux) için ilk build pipeline
- Tek modül uçtan uca: Namaz Vakitleri (en az dış bağımlılık gerektiren, konum bazlı basit modül)

### Faz 2 — Çekirdek Modüller (6-8 hafta)
- Hava durumu, döviz modüllerinin adapter pattern ile entegrasyonu
- Cache/offline katmanının devreye alınması
- Tema sistemi (dark/light), i18n (TR/EN) tamamlanması

### Faz 3 — Mobil Genişleme (6-8 hafta)
- `tauri android init` / `tauri ios init` ile mobil hedeflerin eklenmesi
- Native izinler (konum, bildirim) capability tanımları
- Mobil-özel UI ayarlamaları (bottom navigation, touch hedefleri)

### Faz 4 — Spor + Eczane + Cilalama (4-6 hafta)
- Spor modülü (favori takım, canlı skor)
- Nöbetçi eczane modülü (büyükşehir MVP kapsamı)
- Bildirim sistemi, widget/tray entegrasyonu
- Performans optimizasyonu, bundle boyutu analizi

### Faz 5 — Yayın Hazırlığı (2-4 hafta)
- Code signing (macOS notarization, Windows Authenticode)
- Store listing (Play Store, App Store, Microsoft Store)
- Otomatik güncelleme (Tauri Updater) kurulumu
- Beta test (TestFlight, Play Console kapalı test)

**CI/CD önerisi:** GitHub Actions ile senin TransferCab'de kurduğun multi-environment pipeline yaklaşımına benzer şekilde, her platform için ayrı build matrix (`ubuntu-latest`, `macos-latest`, `windows-latest`) + mobil için ayrı Android/iOS runner konfigürasyonu.

---

## 8. Güvenlik Değerlendirmesi

- Tauri v2'nin capability/permission sistemi, her modülün (örn. eczane modülünün konum API'sine, döviz modülünün ise hiçbir native API'ye ihtiyacı olmadığı gibi) yalnızca gerekli izinlere erişmesini sağlayacak şekilde yapılandırılmalı — Connexa'daki "en az yetki" vault felsefesiyle tutarlı.
- API anahtarları (spor, döviz ticari API'leri) client-side'da açık tutulmamalı; basit bir backend proxy (kendi sunucularında, mevcut Habertürk altyapı deneyiminle hızlıca kurulabilir) anahtar sızıntısını önler ve rate-limit yönetimini merkezi hale getirir.
- Otomatik güncelleme mekanizmasında imza doğrulama (Tauri'nin built-in updater signature kontrolü) zorunlu tutulmalı.

---

## 9. Riskler ve Açık Sorular

1. **Nöbetçi eczane veri kaynağı standardizasyonu** — en yüksek belirsizlik taşıyan modül, il bazlı özel entegrasyon gerektirebilir.
2. **Spor API maliyeti** — canlı skor verisi genelde ücretli API gerektirir; kullanıcı sayısı büyüdükçe maliyet ölçeklenmesi planlanmalı.
3. **iOS App Store inceleme riski** — WebView tabanlı uygulamaların "yeterince native" görünmesi gerekiyor; bildirim, widget, native paylaşım gibi özelliklerin öne çıkarılması bu riski azaltır.
4. **Tauri mobil olgunluğu** — Tauri v2'nin mobil desteği masaüstüne göre daha yeni; plugin ekosisteminin bazı native özellikler (arka plan konum, karmaşık widget) için macOS/Windows kadar olgun olmayabileceği göz önünde bulundurulmalı, kritik native ihtiyaçlar için erken prototipleme önerilir.

---

## 10. Sonuç

Seçilen yığın (Tauri v2 + Vue 3 + Vuetify + Pinia + Vue Router + VueUse + Vue I18n), Günce'nin "tek kod tabanı, beş platform" hedefine teknik olarak tam uyumlu. En kritik başarı faktörü kod tabanının teknik olgunluğundan çok, **veri kaynağı güvenilirliği** (özellikle nöbetçi eczane ve namaz vakitleri gibi resmi/dağınık kaynaklı veriler) ve **platform-özel UX inceliği** olacak. Modüler adapter mimarisi, ileride veri sağlayıcı değişse veya yeni bir modül (örn. trafik yoğunluğu, deprem uyarısı) eklense bile mimarinin esnek kalmasını sağlıyor.
