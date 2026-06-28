# Stellar White Belt Level 1 - Simple Payment dApp

Bu proje, **Stellar White Belt - Seviye 1** görevi kapsamında geliştirilmiş basit bir ödeme (Payment) dApp'idir. Kullanıcılar **Freighter** cüzdanlarını bağlayarak Stellar Testnet üzerindeki bakiyelerini görüntüleyebilir ve herhangi bir public key'e XLM gönderebilirler.

## 🚀 Özellikler

- **Freighter Cüzdan Entegrasyonu**: Cüzdan bağlama ve bağlantıyı kesme.
- **Bakiye Sorgulama**: Cüzdan bağlandığında Testnet ağından XLM bakiyesinin anlık gösterimi.
- **XLM Gönderme**: Testnet üzerinde güvenli bir şekilde XLM gönderme işlemi.
- **Modern Arayüz**: Glassmorphism ve Dark Mode estetiğiyle şık kullanıcı arayüzü.

## 🛠 Kullanılan Teknolojiler

- [React.js](https://reactjs.org/) (Vite)
- [Stellar SDK](https://github.com/stellar/js-stellar-sdk)
- [Freighter API](https://docs.freighter.app/)
- Vanilla CSS (Glassmorphism)

## 📦 Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edin:

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

4. Tarayıcınızda `http://localhost:5173` (veya terminalde belirtilen adres) adresine gidin.

> **Not:** Uygulamayı kullanabilmek için tarayıcınızda [Freighter](https://freighter.app/) eklentisinin kurulu olması ve ağ olarak **Testnet**'in seçili olması gerekmektedir. Eğer cüzdanınızda XLM yoksa [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test) üzerinden Friendbot ile Testnet XLM alabilirsiniz.

## 📸 Ekran Görüntüleri

*(Projenin ekran görüntülerini buraya ekleyebilirsiniz)*


- **Bakiye Gösterimi**: `<img width="1907" height="957" alt="Ekran görüntüsü 2026-06-28 184235" src="https://github.com/user-attachments/assets/8e9890de-e815-4068-8c0f-bd5fb4218245" />
`
- **İşlem Başarı Mesajı**: `[Ekran Görüntüsü Yolu]`

---
Bu proje [@Birgül](https://github.com/YOUR_GITHUB_USERNAME) tarafından Stellar Front-End Challenge için oluşturulmuştur.
