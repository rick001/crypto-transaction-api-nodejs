require('dotenv').config();
const axios = require('axios');

const NETWORK = process.env.NETWORK;

async function getDogecoinGas() {
    const url = (NETWORK === 'testnet'
        ? 'https://api.blockcypher.com/v1/doge/test3'
        : 'https://api.blockcypher.com/v1/doge/main').replace(/\s+/g, '');

    try {
        const response = await axios.get(url);

        // Logging the response from BlockCypher
        // console.log('Dogecoin response:', response.data);

        const gasFeePerKB = response.data.high_fee_per_kb; // fee in satoshis per kilobyte
        const gasFeePerByte = gasFeePerKB / 1000; // fee in satoshis per byte

        return satoshisToDogecoin(gasFeePerByte);
        

    } catch (error) {
        console.error('Error fetching Dogecoin gas fee:', error.message);
        throw new Error('Failed to fetch Dogecoin gas fee');
    }
}

function satoshisToDogecoin(satoshis) {
    return satoshis / 100000000;
}

module.exports = { getDogecoinGas };

// Example usage:
getDogecoinGas().then(fee => {
    console.log('Current Dogecoin Gas Fee:', fee);
}).catch(error => {
    console.error('Error:', error.message);
});
