# Günce

Türkiye için günlük yaşam asistanı — hava durumu, döviz, spor, namaz vakitleri ve nöbetçi eczane bilgilerini tek bir yerde toplayan çoklu platform uygulaması.

Teknoloji yığını: Tauri v2, Vue 3, Vuetify, Vue Router, Pinia, VueUse, Vue I18n. Mimari ve yol haritası için [gunce-teknik-analiz-raporu.md](./gunce-teknik-analiz-raporu.md) dosyasına bakın.

## Geliştirme

```bash
npm install
npm run tauri dev
```

## Yayına Hazırlık

- [docs/release-checklist.md](./docs/release-checklist.md) — code signing, CI/CD secrets, store hesapları için yapılacaklar
- [docs/store-listing.md](./docs/store-listing.md) — Play Store / App Store açıklama metinleri

## Önerilen IDE Kurulumu

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
