require('dotenv').config();
const { Connection, clusterApiUrl } = require('@solana/web3.js');

const NETWORK = process.env.NETWORK;

async function getSolanaGas() {
    try {
        const url = clusterApiUrl(NETWORK);
        const connection = new Connection(url, 'confirmed');

        const { blockhash, feeCalculator } = await connection.getRecentBlockhash();

        return lamportsToSol(feeCalculator.lamportsPerSignature);
        
    } catch (error) {
        console.error('Error fetching Solana gas fee:', error);
        throw new Error('Failed to fetch Solana gas fee');
    }
}

function lamportsToSol(lamports) {
    return lamports / 1000000000;
}

module.exports = { getSolanaGas };