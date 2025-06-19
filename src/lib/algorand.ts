import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(
  '',
  'https://testnet-api.algonode.cloud',
  ''
);

const addr = import.meta.env.VITE_CREATOR_ADDR;
const mnemonic = import.meta.env.VITE_CREATOR_MNEMONIC;

if (!addr || !mnemonic) {
  throw new Error('Creator address or mnemonic not found in env vars.');
}

const CREATOR = {
  addr,
  sk: algosdk.mnemonicToSecretKey(mnemonic).sk,
};

export async function createCertificateAsset(
  studentName: string,
  courseName: string,
  date: string
): Promise<number> {
  const params = await algodClient.getTransactionParams().do();

  const note = new TextEncoder().encode(
    `Certificate for ${studentName}, ${courseName}, ${date}`
  );

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    sender: CREATOR.addr,
    suggestedParams: {
      ...params,
      fee: 1000,
      flatFee: true,
    },
    total: 1,
    decimals: 0,
    defaultFrozen: false,
    unitName: 'CERT',
    assetName: `Cert ${studentName}`,
    assetURL: `https://example.com/certs/${encodeURIComponent(studentName)}`,
    assetMetadataHash: undefined,
    manager: CREATOR.addr,
    reserve: CREATOR.addr,
    freeze: undefined,
    clawback: undefined,
    note,
  });

  const signedTxn = txn.signTxn(CREATOR.sk);
  const txId = txn.txID(); // ✅ Get txId here

  console.log('Submitting TX ID:', txId);

  await algodClient.sendRawTransaction(signedTxn).do();

  const result = await algosdk.waitForConfirmation(algodClient, txId, 3);

  console.log('Transaction confirmed:', result);

  return result['asset-index'];
}
