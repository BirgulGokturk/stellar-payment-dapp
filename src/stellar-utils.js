import { requestAccess, signTransaction } from "@stellar/freighter-api";
import { Horizon, TransactionBuilder, Networks, Asset, Operation, Memo } from "@stellar/stellar-sdk";

// Use Stellar Testnet Horizon
const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export const checkFreighterConnection = async () => {
  // handled directly by requestAccess now
  return true;
};

export const connectWallet = async () => {
  try {
    const result = await requestAccess();
    if (typeof result === "string") {
      return result;
    }
    if (result && result.address) {
      return result.address;
    }
    if (result && result.error) {
      throw new Error(result.error);
    }
    throw new Error("Cüzdan adresi alınamadı.");
  } catch (error) {
    throw new Error(error.message || "Bağlantı isteği reddedildi veya hata oluştu.");
  }
};

export const getBalance = async (publicKey) => {
  try {
    const account = await server.loadAccount(publicKey);
    // Find the native XLM balance
    const balance = account.balances.find((b) => b.asset_type === "native");
    return balance ? balance.balance : "0.00";
  } catch (error) {
    if (error.response && error.response.status === 404) {
        throw new Error("Hesap bulunamadı. Lütfen Testnet üzerinden hesabınıza XLM yükleyin (Friendbot).");
    }
    throw new Error("Bakiye alınırken hata oluştu.");
  }
};

export const fundWithFriendbot = async (publicKey) => {
  try {
    const response = await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(publicKey)}`);
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Friendbot işlemi başarısız oldu.");
    }
    return true;
  } catch (error) {
    throw new Error(error.message || "Bilinmeyen bir hata oluştu.");
  }
};

  export const sendPayment = async (senderPublicKey, receiverPublicKey, amount) => {
    try {
      // 1. Load sender account
      const senderAccount = await server.loadAccount(senderPublicKey);
  
      // 2. Build the transaction
      const transaction = new TransactionBuilder(senderAccount, {
        fee: '100',
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: receiverPublicKey.trim(),
            asset: Asset.native(),
            amount: amount.toString().trim(),
          })
        )
        .addMemo(Memo.text("Stellar White Belt Task"))
        .setTimeout(100) // 100 seconds timeout
        .build();

    // 3. Convert transaction to XDR format
    const xdr = transaction.toXDR();

    // 4. Sign transaction via Freighter
    const result = await signTransaction(xdr, {
      networkPassphrase: Networks.TESTNET,
    });

    let signedTxXdr;
    if (typeof result === "string") {
      signedTxXdr = result;
    } else if (result && result.signedTxXdr) {
      signedTxXdr = result.signedTxXdr;
    } else if (result && result.error) {
      alert(`Freighter imza hatası: ${result.error}`);
      throw new Error(`İşlem imzalanmadı veya iptal edildi. Hata: ${result.error}`);
    } else {
      alert("Freighter'dan bilinmeyen yanıt geldi.");
      throw new Error("Beklenmeyen imza yanıtı alındı.");
    }

    // 5. Submit transaction to the network
    const signedTransaction = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
    const response = await server.submitTransaction(signedTransaction);

    return response;
  } catch (error) {
    console.error("Payment error:", error);
    if (error.response && error.response.data && error.response.data.extras) {
      const errCode = error.response.data.extras.result_codes.transaction;
      alert(`Ağ Hatası: ${errCode}`);
      throw new Error(`İşlem hatası: ${errCode}`);
    }
    alert(`Hata: ${error.message}`);
    throw new Error(error.message || "İşlem gönderilirken bilinmeyen bir hata oluştu.");
  }
};
