# Stellar Orange Belt Level 3 - StellarFund (Crowdfunding dApp)

Bu proje, **Stellar Orange Belt - Seviye 3** görevi kapsamında tam kapsamlı, "production-ready" (üretim düzeyinde) bir akıllı sözleşme dApp'i olarak geliştirilmiştir. Proje, Stellar Testnet üzerinde çalışan gelişmiş bir kitle fonlaması (Crowdfunding) uygulamasıdır.

## 🚀 Özellikler (Seviye 3)

- **Gelişmiş Akıllı Sözleşme (Rust / Soroban)**: Kitle fonlaması kampanyası yöneten, hedef miktar ve bitiş tarihine (deadline) sahip akıllı sözleşme (`contracts/crowdfund`).
- **Sözleşmeler Arası İletişim (Inter-contract Communication)**: Fonlama (pledge) ve para çekme (withdraw) işlemleri sırasında Crowdfund sözleşmesi, doğrudan Native XLM Token sözleşmesi (`token::Client`) ile iletişim kurarak para transferlerini kendi içerisinden tetikler.
- **Gerçek Zamanlı Olay Akışı (Event Streaming)**: Soroban RPC üzerinden yeni transfer olayları anlık olarak dinlenerek ekrana yansıtılır.
- **Mobil Uyumlu Arayüz (Mobile Responsive UI)**: Uygulama tasarımı tamamen responsive (duyarlı) olup mobil cihazlarda pürüzsüz çalışır.
- **Hata Yönetimi ve Yükleme Durumları**: Bekleyen işlemler için akıllı UI geri bildirimleri (Loading states) ve detaylı Soroban hata mesajları entegre edilmiştir.
- **Birim Testleri (3+ Passing Tests)**:
  - **Rust (Contract)**: Sözleşme mantığı ve para transferleri için `cargo test`.
  - **React (Frontend)**: UI bileşenleri için `Vitest` + `React Testing Library`.
- **CI/CD Pipeline (GitHub Actions)**: Her push işleminde otomatik olarak testler çalışır ve ardından uygulama **GitHub Pages**'e deploy edilir.

## 🔗 Canlı Demo (Live Demo)
👉 [StellarFund Canlı Uygulaması](https://BirgulGokturk.github.io/stellar-payment-dapp/)

## 📜 Sözleşme Detayları (Contract Info)
- **Ağ:** Stellar Testnet
- **Contract ID:** *(TBD - Deployment tamamlandığında eklenecektir)*
- **Örnek İşlem Hash (Transaction Hash):** *(TBD - İşlem yapıldığında eklenecektir)*

## 🛠 Kullanılan Teknolojiler
- Akıllı Sözleşme: Rust, Soroban SDK
- Frontend: React (Vite), Vitest
- Cüzdan: StellarWalletsKit (Freighter)
- CI/CD: GitHub Actions, GitHub Pages

## 📦 Kurulum ve Çalıştırma (Lokal Test İçin)

1. Depoyu klonlayın ve bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Testleri çalıştırın:
   ```bash
   npm run test
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## 📸 Ekran Görüntüleri ve Video (Kanıtlar)

Görev kapsamında istenilen kanıtlar aşağıda listelenmiştir:

### 1. Mobil Uyumlu Arayüz (Mobile Responsive UI)
*(Uygulamanın mobil cihazdaki görünümü)*

<img width="946" height="2048" alt="WhatsApp Image 2026-07-02 at 12 20 17" src="https://github.com/user-attachments/assets/ddb6ffe5-aa5e-4530-bd71-40a20f64f816" />


### 2. CI/CD Pipeline Çalışıyor (GitHub Actions)
*(GitHub Actions sekmesindeki başarılı deployment)*

<img width="1887" height="938" alt="Ekran görüntüsü 2026-07-02 121623" src="https://github.com/user-attachments/assets/a826fbf0-4956-4ae5-9e84-4e6b8d553c14" />


### 3. Test Sonuçları (3+ Passing Tests)
*(Rust veya Vitest'in yeşil tikli test sonuçları)*

<img width="1888" height="976" alt="Ekran görüntüsü 2026-07-02 121931" src="https://github.com/user-attachments/assets/d5b99823-6e13-443b-ba7c-46ce67973655" />

### 🎥 Demo Video (1-2 Dakika)

https://drive.google.com/file/d/1QbS9LVsAA1xhJVNKIRUy4FoxC9IbL04q/view?usp=sharing




---
Bu proje [@Birgül](https://github.com/BirgulGokturk) tarafından Stellar Orange Belt Challenge için oluşturulmuştur.
