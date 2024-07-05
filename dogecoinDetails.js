require('dotenv').config();
const axios = require('axios');

const NETWORK = process.env.NETWORK;



async function getDogecoinDetails(address) {
    const url = (NETWORK === 'testnet'
        ? `https://api.blockcypher.com/v1/doge/test3/addrs/${address}/full?limit=1`
        : `https://api.blockcypher.com/v1/doge/main/addrs/${address}/full?limit=1`).replace(/\s+/g, '');

    

    try {
        const response = await axios.get(url);

        // Logging the response from BlockCypher
        //console.log('Dogecoin response:', response.data);

        const balance = response.data.final_balance;
        const txrefs = response.data.txrefs || response.data.txs;

        if (!txrefs || txrefs.length === 0) {
            return { balance: (satoshisToBitcoin(balance)).toString(), sender: 'Unknown', txHash: 'Unknown', gasFee: 'Unknown' };
        }

        const transaction = txrefs[0];
        const sender = transaction.inputs ? transaction.inputs[0].addresses[0] : 'Unknown';
        const txHash = transaction.hash;
        const gasFee = transaction.fees || 0;

        return { 
            balance: (satoshisToBitcoin(balance)).toString(), 
            sender, 
            txHash, 
            gasFee: (satoshisToBitcoin(gasFee)).toString() 
        };

    } catch (error) {
        console.error('Error fetching Dogecoin details:', error.message);
        throw new Error('Failed to fetch Dogecoin details');
    }
}

function satoshisToBitcoin(satoshis) {
    return satoshis / 100000000;
}

module.exports = { getDogecoinDetails };