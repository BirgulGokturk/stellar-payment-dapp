const { rpc, Contract, Address, nativeToScVal, scValToNative } = require('@stellar/stellar-sdk');

async function test() {
  const server = new rpc.Server('https://soroban-testnet.stellar.org');
  const contractId = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
  const contract = new Contract(contractId);
  const address = 'GABSZ2GS3R75WOYMQOGD5Z4IPXP6WKFH4H7ZYUMS4UJZ7ZEQV2H6VU4M';

  const txBuilder = await server.prepareTransaction(
      new (require('@stellar/stellar-sdk').TransactionBuilder)(
          new (require('@stellar/stellar-sdk').Account)(address, "1"),
          { fee: "100", networkPassphrase: require('@stellar/stellar-sdk').Networks.TESTNET }
      ).addOperation(contract.call('balance', nativeToScVal(address, { type: 'address' }))).setTimeout(100).build()
  );
  
  const sim = await server.simulateTransaction(txBuilder);
  if (sim.result && sim.result.retval) {
      console.log('Balance result:', scValToNative(sim.result.retval));
  } else {
      console.log('Error:', sim);
  }
}
test().catch(console.error);
