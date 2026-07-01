import { StellarWalletsKit, Networks as WalletNetwork } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule, FREIGHTER_ID } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { rpc, Contract, Address, nativeToScVal, scValToNative, TransactionBuilder, Account, Networks } from '@stellar/stellar-sdk';

export const server = new rpc.Server('https://soroban-testnet.stellar.org');
export const XLM_CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
const contract = new Contract(XLM_CONTRACT_ID);

StellarWalletsKit.init({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [new FreighterModule()],
});

export const checkFreighterConnection = async () => {
  return true;
};

export const connectWallet = async () => {
  try {
    const result = await StellarWalletsKit.authModal();
    if (!result || !result.address) throw new Error("Cüzdan bulunamadı (Wallet not found).");
    return result.address;
  } catch (error) {
    throw new Error(error.message || "Bağlantı reddedildi veya hata oluştu.");
  }
};

export const getBalance = async (publicKey) => {
  try {
    const address = Address.fromString(publicKey);
    const txBuilder = await server.prepareTransaction(
      new TransactionBuilder(new Account(publicKey, "1"), {
        fee: "100",
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(contract.call('balance', nativeToScVal(address, { type: 'address' })))
      .setTimeout(100)
      .build()
    );
    const sim = await server.simulateTransaction(txBuilder);
    if (sim.result && sim.result.retval) {
      const stroops = scValToNative(sim.result.retval);
      return (Number(stroops) / 10000000).toFixed(2);
    }
    return "0.00";
  } catch (error) {
    console.error(error);
    throw new Error("Bakiye alınırken hata oluştu.");
  }
};

export const sendPayment = async (senderPublicKey, receiverPublicKey, amount) => {
  try {
    const amountInStroops = BigInt(Math.floor(parseFloat(amount) * 10000000));
    const senderAddress = Address.fromString(senderPublicKey);
    const receiverAddress = Address.fromString(receiverPublicKey);

    const rawTx = new TransactionBuilder(new Account(senderPublicKey, "1"), {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
    })
    .addOperation(contract.call(
      'transfer', 
      nativeToScVal(senderAddress, { type: 'address' }),
      nativeToScVal(receiverAddress, { type: 'address' }),
      nativeToScVal(amountInStroops, { type: 'i128' })
    ))
    .setTimeout(100)
    .build();

    let assembledTx;
    try {
        assembledTx = await server.prepareTransaction(rawTx);
    } catch (e) {
        throw new Error("Simülasyon başarısız oldu. Yetersiz bakiye (Insufficient Balance) olabilir.");
    }

    let result;
    try {
        result = await StellarWalletsKit.signTransaction(assembledTx.toXDR(), { networkPassphrase: Networks.TESTNET });
    } catch (e) {
        throw new Error("Kullanıcı işlemi reddetti (Rejected).");
    }
    
    if (!result || !result.signedTxXdr) {
       throw new Error("Kullanıcı işlemi reddetti (Rejected).");
    }

    let signedTx = TransactionBuilder.fromXDR(result.signedTxXdr, Networks.TESTNET);
    const response = await server.sendTransaction(signedTx);
    
    return { hash: response.hash, status: response.status }; // PENDING
  } catch (error) {
    const errStr = (error.message || "").toLowerCase();
    if (errStr.includes("yetersiz") || errStr.includes("insufficient") || errStr.includes("balance")) {
       throw new Error("Yetersiz Bakiye (Insufficient Balance)");
    }
    if (errStr.includes("rejected") || errStr.includes("declined") || errStr.includes("cancel")) {
       throw new Error("Kullanıcı işlemi reddetti (Rejected by User).");
    }
    throw error;
  }
};

// Polling for transaction status
export const pollTransactionStatus = async (hash) => {
  let status = "PENDING";
  let txResponse;
  while (status === "PENDING") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    txResponse = await server.getTransaction(hash);
    status = txResponse.status;
  }
  return txResponse;
};

// Polling for events
export const fetchRecentEvents = async () => {
    try {
        // Fetch recent transfer events for the contract
        const eventsResponse = await server.getEvents({
            startLedger: 0,
            filters: [
                {
                    type: "contract",
                    contractIds: [XLM_CONTRACT_ID],
                    topics: [
                        [nativeToScVal("transfer", { type: 'symbol' }).toXDR("base64")]
                    ]
                }
            ],
            limit: 5
        });
        
        return eventsResponse.events || [];
    } catch (e) {
        console.error("Event fetch error", e);
        return [];
    }
};
