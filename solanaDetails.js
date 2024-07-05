require('dotenv').config();
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

const NETWORK = process.env.NETWORK;

const MAX_RETRIES = 5;

async function getSolanaDetails(address) {
    try {
        const url = clusterApiUrl(NETWORK);
        const connection = new Connection(url, 'confirmed');
        const pubkey = new PublicKey(address);
        const balance = await connection.getBalance(pubkey);
        const transactions = await connection.getSignaturesForAddress(pubkey, { limit: 1 });

        if (transactions.length === 0) {
            return { balance: (balance / 1000000000).toString() , sender: 'Unknown', txHash: 'Unknown', gasFee: 'Unknown' };
        }

        const txHash = transactions[0].signature;

        if (txHash) {
            const txDetails = await fetchTransactionWithRetries(connection, txHash, MAX_RETRIES);
            if (!txDetails || !txDetails.transaction || !txDetails.meta) {
                throw new Error('Incomplete transaction details');
            }

            const feePayer = txDetails.transaction.feePayer.toBase58();
            const fee = txDetails.meta.fee;

            return {
                balance: (balance / 1000000000).toString(),
                sender: feePayer,
                txHash: txHash,
                gasFee: (fee / 1000000000).toString() 
            };
        } else {
            return { balance: (balance / 1000000000).toString(), sender: 'Unknown', txHash: 'Unknown', gasFee: 'Unknown' };
        }
    } catch (error) {
        console.error('Error fetching Solana details:', error);
        return { balance: 'Error', sender: 'Error', txHash: 'Error', gasFee: 'Error' };
    }
}

async function fetchTransactionWithRetries(connection, txHash, retries) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const txDetails = await connection.getConfirmedTransaction(txHash);
            if (txDetails) {
                return txDetails;
            }
        } catch (error) {
            if (error.cause && error.cause.code === 429) {
                const delay = Math.pow(2, attempt) * 1000;
                console.warn(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error(`Error fetching transaction details on attempt ${attempt + 1}:`, error);
            }
        }
    }
    console.error(`Failed to fetch transaction details after ${retries} retries`);
    return null;
}

module.exports = { getSolanaDetails };
