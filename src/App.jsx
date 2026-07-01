import { useState, useEffect } from 'react';
import { connectWallet, getBalance, sendPayment, pollTransactionStatus, fetchRecentEvents, scValToNative } from './stellar-utils';
import './index.css';

function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [receiver, setReceiver] = useState('GABSZ2GS3R75WOYMQOGD5Z4IPXP6WKFH4H7ZYUMS4UJZ7ZEQV2H6VU4M');
  const [amount, setAmount] = useState('10');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      const bal = await getBalance(addr);
      setBalance(bal);
    } catch (error) {
      alert("Cüzdan bağlanamadı: " + error.message);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setBalance('0.00');
    setStatus({ type: '', message: '' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!address) {
      setStatus({ type: 'error', message: 'Lütfen önce cüzdanınızı bağlayın.' });
      return;
    }
    
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await sendPayment(address, receiver, amount);
      if (response.status === 'PENDING') {
        setStatus({ type: 'info', message: 'İşlem gönderildi, onay bekleniyor... Lütfen bekleyin.' });
        
        // Poll for success
        const finalStatus = await pollTransactionStatus(response.hash);
        
        if (finalStatus.status === 'SUCCESS') {
           setStatus({ type: 'success', message: `İşlem Başarılı! Hash: ${response.hash}` });
           // Refresh balance
           const newBal = await getBalance(address);
           setBalance(newBal);
        } else {
           setStatus({ type: 'error', message: `İşlem Başarısız (Durum: ${finalStatus.status})` });
        }
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Event Polling effect
  useEffect(() => {
    if (!address) return;
    const interval = setInterval(async () => {
       const recent = await fetchRecentEvents();
       if (recent && recent.length > 0) {
           setEvents(recent);
       }
    }, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [address]);

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">Stellar<span>Pay</span></h1>
        {address ? (
          <button className="btn btn-outline" onClick={handleDisconnect}>
            Bağlantıyı Kes
          </button>
        ) : (
          <button className="btn" onClick={handleConnect}>
            Cüzdan Bağla (WalletsKit)
          </button>
        )}
      </header>

      <main className="main-content">
        {!address ? (
          <div className="card empty-state">
            <div className="icon">🔒</div>
            <p>Çoklu Cüzdan uygulamasını kullanmak için cüzdanınızı bağlayın.</p>
          </div>
        ) : (
          <div className="dashboard">
            <div className="card balance-card">
              <h3>MEVCUT BAKİYE (TESTNET XLM SOROBAN) 🔃</h3>
              <div className="balance-amount">{balance} <span>XLM</span></div>
              <div className="wallet-badge">
                <span className="icon">💳</span> {address.substring(0, 6)}...{address.slice(-4)}
              </div>
            </div>

            <div className="card transfer-card">
              <form onSubmit={handleSend}>
                <div className="input-group">
                  <label>Alıcı Adresi (Public Key)</label>
                  <input 
                    type="text" 
                    placeholder="G..." 
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label>Miktar (XLM)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    min="1"
                    step="0.0000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn" 
                  style={{ width: '100%' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Cüzdanda Onay Bekleniyor / Ağ Onayı Bekleniyor...' : 'Gönder (Soroban Transfer)'}
                </button>
              </form>
              
              {status.message && (
                <div className={`status-message ${status.type}`}>
                  {status.message}
                </div>
              )}
            </div>

            <div className="card events-card">
                <h3>Son Testnet Transfer Olayları (Live Stream)</h3>
                {events.length === 0 ? (
                    <p style={{color: '#888'}}>Henüz yeni olay yok...</p>
                ) : (
                    <ul className="event-list">
                        {events.map((ev, i) => (
                           <li key={i} className="event-item">
                               <small>Ledger: {ev.ledger}</small><br/>
                               {ev.id}
                           </li>
                        ))}
                    </ul>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
