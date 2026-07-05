# Günce — Yayın Hazırlığı Kontrol Listesi

Faz 5 kapsamında otomatik olarak kurulanlar ile sizin tamamlamanız gereken adımların ayrımı.

## Otomatik olarak kurulanlar

- **Otomatik güncelleme:** `tauri-plugin-updater` + imzalama anahtar çifti (`.tauri-keys/gunce-updater.key` — asla commit edilmez, `.gitignore`'da). Public key `tauri.conf.json`'a gömülü. Ayarlar sayfasında "Güncellemeleri Kontrol Et" butonu çalışıyor (masaüstünde).
- **CI/CD:** `.github/workflows/ci.yml` (her push/PR'da tip kontrolü + build doğrulaması), `release.yml` (bir `vX.Y.Z` tag'i push edildiğinde macOS/Linux/Windows için derleyip GitHub Release'e otomatik güncelleme dosyalarıyla (`latest.json`) yükler), `android.yml` (debug APK/AAB derleyip workflow artifact olarak yükler).
- **Store listing metni:** `docs/store-listing.md` — TR/EN kısa/uzun açıklama, anahtar kelimeler, gizlilik politikası taslağı.

## Sizin tamamlamanız gerekenler

### 1. GitHub Secrets (release.yml'nin çalışması için)
Repo → Settings → Secrets and variables → Actions:
- `TAURI_SIGNING_PRIVATE_KEY`: `.tauri-keys/gunce-updater.key` dosyasının içeriği
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: şu an boş (anahtar şifresiz üretildi) — üretimde bir şifre eklemeniz önerilir: `npx tauri signer generate -w .tauri-keys/gunce-updater.key`'i şifreyle tekrar çalıştırıp mevcut public key'i `tauri.conf.json`'da güncelleyin.

**Kritik:** `.tauri-keys/gunce-updater.key` dosyasını güvenli bir yerde (parola yöneticisi vb.) yedekleyin. Kaybederseniz mevcut kullanıcılara güncelleme gönderemezsiniz.

### 2. macOS code signing + notarization (opsiyonel ama App Store/dağıtım için gerekli)
- Apple Developer Program üyeliği ($99/yıl)
- `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD` (app-specific password), `APPLE_TEAM_ID` secret'larını ekleyin — `release.yml` bunlar mevcutsa otomatik kullanır.

### 3. iOS — App Store Connect
- Apple Developer Program üyeliği (yukarıdakiyle aynı hesap)
- App Store Connect'te "Günce" için bir app kaydı oluşturun (bundle identifier: `com.cyh.gunce`)
- `src-tauri/tauri.conf.json` → `bundle.iOS.developmentTeam` alanına Team ID'nizi ekleyin
- TestFlight'a yüklemek için: `npm run tauri ios build -- --export-method app-store-connect` (imza sertifikası Xcode'da Apple ID'nizle otomatik yönetilebilir)

### 4. Android — Google Play Console
- Google Play Console hesabı ($25 tek seferlik)
- Bir release keystore oluşturun: `keytool -genkey -v -keystore gunce-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias gunce`
- `src-tauri/gen/android/app/build.gradle.kts`'e signingConfig eklenmesi gerekiyor (keystore hazır olduğunda bu adımı birlikte yaparız)
- Play App Signing'i etkinleştirin (Google'ın önerdiği yöntem)

### 5. Genel
- Gerçek uygulama ikonu tasarlayın (şu an `src-tauri/icons/` altında varsayılan Tauri şablonu ikonu duruyor)
- Ekran görüntüleri alın (masaüstü + mobil)
- `docs/store-listing.md`'deki gizlilik politikası metnini bir URL'de yayınlayın (ör. GitHub Pages)
- Microsoft Store'a çıkmak isterseniz bir geliştirici hesabı gerekir (opsiyonel, rapor bunu isteğe bağlı işaretlemişti)

## Bir sürüm nasıl yayınlanır

```bash
git tag v0.2.0
git push origin v0.2.0
```

Bu, `release.yml` ve `android.yml`'yi tetikler. macOS/Linux/Windows derlemeleri taslak (draft) bir GitHub Release'e yüklenir — yayınlamadan önce release notlarını gözden geçirip "Publish" demeniz gerekir.
