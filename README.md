# Stellar White Belt Level 2 - Multi-Wallet Payment Tracker

Bu proje, **Stellar White Belt - Seviye 2** görevi kapsamında geliştirilmiş, çoklu cüzdan destekli ve doğrudan akıllı sözleşme (Smart Contract) ile etkileşime giren bir ödeme takip dApp'idir.

## 🚀 Özellikler (Seviye 2)

- **Çoklu Cüzdan Entegrasyonu (StellarWalletsKit)**: Kullanıcılar Freighter, Albedo vb. desteklenen cüzdanlar arasından seçim yaparak bağlanabilir.
- **Akıllı Sözleşme (Smart Contract) Etkileşimi (Soroban RPC)**: 
  - Bakiye sorgulamaları, Testnet üzerindeki Native XLM sözleşmesinden (`balance` fonksiyonu) okunur.
  - Ödemeler klasik işlem olarak değil, Soroban Native Sözleşmesindeki `transfer` fonksiyonu tetiklenerek gerçekleştirilir.
- **Gelişmiş Hata Yakalama (Error Handling)**: 
  - Cüzdan bulunamadı.
  - İşlem kullanıcı tarafından reddedildi (Rejected).
  - Yetersiz Bakiye (Insufficient Balance - Soroban Simülasyonu ile).
- **Gerçek Zamanlı Durum Senkronizasyonu (Live Events)**: Akıllı sözleşme üzerindeki transfer olayları (Events) anlık dinlenir ve ekrana yansıtılır. İşlem durumları (Pending -> Success/Fail) takip edilir.

## 🛠 Kullanılan Teknolojiler

- [React.js](https://reactjs.org/) (Vite)
- [Stellar SDK v12+](https://github.com/stellar/js-stellar-sdk) (Soroban RPC uyumlu)
- [StellarWalletsKit v2.5.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit)
- Vanilla CSS (Glassmorphism & Dark Mode)

## 📦 Kurulum ve Çalıştırma

1. Depoyu klonlayın:
   ```bash
   git clone <REPO_URL>
   cd stellar-payment-dapp
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## 📸 Ekran Görüntüleri (Screenshots)

Görev kapsamında istenilen 3 ana kanıt ekran görüntüsü:

### 1. Ana Ekran (Cüzdan Bağlı Değilken)
*(Wallet not connected state)*

<img width="320" height="142" alt="download" src="https://github.com/user-attachments/assets/580ed459-5e36-4bc5-8b9b-ed93eb26beeb" />


### 2. Mevcut Cüzdan Seçenekleri (Wallet Options)
*(StellarWalletsKit menüsünün açıldığı an)*

<img width="320" height="160" alt="download" src="https://github.com/user-attachments/assets/4fd5e439-846a-4d9a-b62e-caeb3dde2f54" />



### 3. İşlem Başarılı & Sonuç Gösterimi (Successful Transaction)
*(Cüzdan bağlantısı, bakiye gösterimi ve başarılı transfer mesajı)*

<img width="320" height="163" alt="download" src="https://github.com/user-attachments/assets/de9638c3-341e-49ea-b216-a839fd6df4f3" />


---
Bu proje [@Birgül](https://github.com/BirgulGokturk) tarafından Stellar White Belt Challenge için oluşturulmuştur.
