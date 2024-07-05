require('dotenv').config();
const axios = require('axios');

const NETWORK = process.env.NETWORK;

async function getBitcoinGas() {
    const url = (NETWORK === 'testnet'
        ? 'https://mempool.space/testnet/api/v1/fees/recommended'
        : 'https://mempool.space/api/v1/fees/recommended'
    );

    try {
        const response = await axios.get(url);
        const { fastestFee, halfHourFee, hourFee, economyFee, minimumFee } = response.data;

        
            //fastestFee: fastestFee,      // Fee in satoshis per byte for fastest confirmation
            //halfHourFee: halfHourFee,    // Fee in satoshis per byte for confirmation within 30 minutes
            //hourFee: hourFee,            // Fee in satoshis per byte for confirmation within 1 hour
             //economyFee: economyFee,      // Economy fee in satoshis per byte
            //minimumFee: minimumFee       // Minimum fee in satoshis per byte
      return satoshisToBitcoin(fastestFee);
        
    } catch (error) {
        console.error('Error fetching Bitcoin network fee:', error.message);
        throw new Error('Failed to fetch Bitcoin network fee');
    }
}

function satoshisToBitcoin(satoshis) {
    return (satoshis / 100000000).toFixed(8); // Format to 8 decimal places
}

module.exports = { getBitcoinGas };

