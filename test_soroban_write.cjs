const { rpc, Contract, Address, nativeToScVal, TransactionBuilder, Account, Networks } = require('@stellar/stellar-sdk');

async function test() {
  const server = new rpc.Server('https://soroban-testnet.stellar.org');
  const contractId = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
  const contract = new Contract(contractId);
  const sender = 'GABSZ2GS3R75WOYMQOGD5Z4IPXP6WKFH4H7ZYUMS4UJZ7ZEQV2H6VU4M';
  const receiver = 'GBDZQRC2Z5D2E4ZMBWBYR76G2Y2S5OEYLIXWIKJ3C6GZJXY3Q5X7G5G6'; // use a random generated one to avoid error
  const receiver2 = (require('@stellar/stellar-sdk').Keypair.random()).publicKey();

  const senderAddress = Address.fromString(sender);
  const receiverAddress = Address.fromString(receiver2);

  const rawTx = new TransactionBuilder(new Account(sender, "1"), { fee: "100", networkPassphrase: Networks.TESTNET })
    .addOperation(contract.call(
        'transfer',
        nativeToScVal(senderAddress, { type: 'address' }),
        nativeToScVal(receiverAddress, { type: 'address' }),
        nativeToScVal(10000000n, { type: 'i128' }) // 1 XLM
    ))
    .setTimeout(100)
    .build();

  console.log('Simulating...');
  try {
    const assembledTx = await server.prepareTransaction(rawTx);
    console.log('Assembled TX XDR:', assembledTx.toXDR());
  } catch (e) {
    console.error('Prepare error:', e.message);
  }
}
test().catch(console.error);
