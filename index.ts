import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import { argv } from 'process';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const getUserInput = () => {
  const publicKey = argv[2];
  return { publicKey };
};

const getWalletBalance = async (publicKey: string) => {
  try {
    const walletBalance = await connection.getBalance(new PublicKey(publicKey));
    console.log(`Wallet balance: ${walletBalance / LAMPORTS_PER_SOL} SOL`);
  } catch (error) {
    console.log(error);
  }
};

const airDropSol = async (publicKey: string) => {
  try {
    console.log('Requesting airdrop of 2 SOL...');

    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(publicKey),
      2 * LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      ...latestBlockHash,
      signature: fromAirDropSignature,
    });
  } catch (error) {
    console.log(error);
  }
};

const mainFunction = async () => {
  const { publicKey } = getUserInput();

  if (typeof publicKey !== 'string' || publicKey.length === 0) {
    throw new Error('Please provide a public key');
  }

  await getWalletBalance(publicKey);
  await airDropSol(publicKey);
  await getWalletBalance(publicKey);
};

mainFunction();
