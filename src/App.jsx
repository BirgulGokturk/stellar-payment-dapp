import { useState, useEffect } from 'react';
import { connectWallet, getBalance, sendPayment, pollTransactionStatus, fetchRecentEvents } from './stellar-utils';
import './index.css';

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const CAMPAIGN_ADDRESS = "GABSZ2GS3R75WOYMQOGD5Z4IPXP6WKFH4H7ZYUMS4UJZ7ZEQV2H6VU4M"; // Valid dummy address

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const pubKey = await connectWallet();
      setAddress(pubKey);
      const bal = await getBalance(pubKey);
      setBalance(bal);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePledge = async () => {
    if (!amount) return alert("Lütfen bir miktar girin.");
    try {
      setIsLoading(true);
      setStatus("Cüzdanda Onay Bekleniyor / Ağ Onayı Bekleniyor...");
      const { hash } = await sendPayment(address, CAMPAIGN_ADDRESS, amount);
      setStatus(`İşlem Ağda İşleniyor... Hash: ${hash}`);
      
      const finalStatus = await pollTransactionStatus(hash);
      if (finalStatus === "SUCCESS") {
         setStatus(`🎉 Destek Başarılı! İşlem Hash: ${hash}`);
         const newBal = await getBalance(address);
         setBalance(newBal);
      } else {
         setStatus(`❌ İşlem Başarısız: ${finalStatus}`);
      }
    } catch (error) {
      setStatus(`Hata: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const recent = await fetchRecentEvents();
      setEvents(recent);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">StellarFund (Seviye 3)</h1>
        {!address ? (
          <button className="btn" onClick={handleConnect} disabled={isLoading}>
            {isLoading ? "Bağlanıyor..." : "Cüzdan Bağla (WalletsKit)"}
          </button>
        ) : (
          <button className="btn btn-outline" onClick={() => setAddress('')}>Bağlantıyı Kes</button>
        )}
      </header>

      {!address && (
        <div className="welcome">
          <p>🔒</p>
          <p>Stellar ağı üzerinde merkeziyetsiz kitle fonlaması dApp'i.</p>
        </div>
      )}

      {address && (
        <div className="dashboard">
          <div className="card">
            <h3>MEVCUT BAKİYE (TESTNET XLM)</h3>
            <h2 className="balance">{balance} XLM</h2>
            <p className="address-display">💳 {address.slice(0,6)}...{address.slice(-4)}</p>
            
            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label>Hedef Proje Adresi</label>
              <input type="text" value={CAMPAIGN_ADDRESS} disabled className="input" />
            </div>
            <div className="form-group">
              <label>Destek Miktarı (XLM)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="input" 
                placeholder="Örn: 50"
                disabled={isLoading}
              />
            </div>
            
            <button className="btn btn-full" onClick={handlePledge} disabled={isLoading}>
              {isLoading ? "İşleniyor..." : "🚀 Projeyi Destekle (Pledge)"}
            </button>
            
            {status && (
              <div className="status-message">
                {status}
              </div>
            )}
          </div>

          <div className="card events-card">
            <h3>Son Destek Olayları (Live Stream)</h3>
            {events.length === 0 ? (
              <p style={{ opacity: 0.7 }}>Henüz yeni olay yok...</p>
            ) : (
              <div className="event-list">
                {events.map((ev, i) => (
                  <div key={i} className="event-item">
                    <span className="event-type">{ev.type}</span>
                    <span className="event-amount">{ev.amount} XLM</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
