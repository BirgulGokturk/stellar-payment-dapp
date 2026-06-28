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

Stellar White Belt görevi kapsamında istenen kanıtlar (2 ana ekran görüntüsü ile özetlenmiştir):

### 1. Wallet Connected & Balance Displayed
Cüzdanın başarıyla bağlandığı ve Testnet bakiyesinin uygulamada gösterildiği an:

<img width="1907" height="957" alt="Ekran görüntüsü" src="https://github.com/user-attachments/assets/04cd0fb7-7fe4-4c46-8bb0-393a11daa891" />

### 2. Successful Transaction & Result Shown to User
Test ağı üzerinden gönderilen işlemin başarıyla tamamlandığı, işlem detaylarının (Memo dahil) ve sonucunun kullanıcıya gösterildiği an:

*(Freighter Onay Ekranı ve İşlem Başarılı Görüntüsünü Buraya Yükleyiniz)*

---
Bu proje [@Birgül](https://github.com/BirgulGokturk) tarafından Stellar White Belt Challenge için oluşturulmuştur.
