import { useState, useEffect } from 'react';
import { connectWallet, getBalance, sendPayment, fundWithFriendbot } from './stellar-utils';
import './index.css';

function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [receiver, setReceiver] = useState('GBDZQRC2Z5D2E4ZMBWBYR76G2Y2S5OEYLIXWIKJ3C6GZJXY3Q5X7G5G6');
  const [amount, setAmount] = useState('10');
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  useEffect(() => {
    if (address) {
      fetchBalance(address);
    }
  }, [address]);

  const fetchBalance = async (pubKey) => {
    try {
      const bal = await getBalance(pubKey);
      setBalance(bal);
      setStatus({ type: '', message: '' }); // clear error if successful
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message });
      setBalance('0.00');
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setStatus({ type: '', message: '' });
    try {
      const pubKey = await connectWallet();
      setAddress(pubKey);
    } catch (error) {
      setStatus({ type: 'error', message: `Bağlantı hatası: ${error.message}` });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setBalance('0.00');
    setReceiver('');
    setAmount('');
    setStatus({ type: '', message: '' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!address) return;
    if (!receiver || !amount) {
      setStatus({ type: 'error', message: 'Lütfen alıcı adresi ve miktarı giriniz.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await sendPayment(address, receiver, amount);
      setStatus({ 
        type: 'success', 
        message: `İşlem Başarılı! Hash: ${response.hash}` 
      });
      // Refresh balance
      fetchBalance(address);
      setAmount('');
      setReceiver('');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFund = async () => {
    if (!address) return;
    setIsFunding(true);
    setStatus({ type: '', message: 'Test XLM yükleniyor, lütfen bekleyin...' });
    try {
      await fundWithFriendbot(address);
      setStatus({ type: 'success', message: 'Test XLM başarıyla yüklendi! Bakiye güncelleniyor...' });
      await fetchBalance(address);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsFunding(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setStatus({ type: 'success', message: 'Cüzdan adresi kopyalandı!' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const isAccountNotFound = status.message.includes("Hesap bulunamadı");

  return (
    <div className="app-container">
      <header>
        <h1>StellarPay</h1>
        {address ? (
          <button className="btn btn-secondary" onClick={handleDisconnect}>
            Bağlantıyı Kes
          </button>
        ) : (
          <button className="btn" onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? <span className="loader"></span> : 'Freighter Bağla'}
          </button>
        )}
      </header>

      <main className="glass-card">
        {address ? (
          <>
            <div className="balance-section">
              <div className="balance-title" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                Mevcut Bakiye (Testnet)
                <button 
                  onClick={() => fetchBalance(address)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }}
                  title="Bakiyeyi Yenile"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
              </div>
              <div className="balance-amount">
                {balance} <span className="balance-asset">XLM</span>
              </div>
              <div className="address-badge" onClick={handleCopyAddress} title="Kopyala">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {formatAddress(address)}
              </div>
            </div>

            {isAccountNotFound ? (
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Hesabınızda test parası olmadığı için aktif değil. Tek tıkla 10,000 Test XLM yükleyebilirsiniz.
                </p>
                <button onClick={handleFund} className="btn" disabled={isFunding}>
                  {isFunding ? <><span className="loader"></span> Yükleniyor...</> : 'Ücretsiz 10.000 Test XLM Yükle'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSend}>
                <div className="form-group">
                  <label>Alıcı Adresi (Public Key)</label>
                  <input 
                    type="text" 
                    placeholder="G..." 
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Miktar (XLM)</label>
                  <input 
                    type="number" 
                    step="0.0000001" 
                    min="0.0000001"
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn" 
                  style={{ width: '100%' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><span className="loader"></span> Lütfen Freighter Eklentisini Açıp Onaylayın...</>
                  ) : (
                    'Gönder'
                  )}
                </button>
              </form>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            <svg style={{ width: '48px', height: '48px', margin: '0 auto 1rem', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <p>Uygulamayı kullanmak için Freighter cüzdanınızı bağlayın.</p>
          </div>
        )}

        {status.message && !isAccountNotFound && (
          <div className={`status-message status-${status.type}`}>
            {status.message}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
