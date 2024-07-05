require('dotenv').config();
const axios = require('axios');

const NETWORK = process.env.NETWORK;



async function getBitcoinDetails(address) {
    const url = (NETWORK === 'testnet' 
        ? `https://api.blockcypher.com/v1/btc/test3/addrs/${address}?limit=1`
        : `https://blockchain.info/rawaddr/${address}?limit=1`
    ).replace(/\s+/g, '');
    
    

    try {
        const response = await axios.get(url);

        // Logging the response
        //console.log('Bitcoin response:', response.data);

        if (NETWORK === 'testnet') {
            // BlockCypher testnet response parsing
            const balance = response.data.final_balance;
            const txrefs = response.data.txrefs;

            if (!txrefs || txrefs.length === 0) {
                return { balance: satoshisToBitcoin(balance) , sender: null, txHash: null, gasFee: null };
            }

            const transaction = txrefs[0];
            const txHash = transaction.tx_hash;

            // Fetching detailed transaction information
            const txDetailUrl = `https://api.blockcypher.com/v1/btc/test3/txs/${txHash}`;
            const txDetailResponse = await axios.get(txDetailUrl);
            //console.log('Transaction Details:', txDetailResponse.data);

            const sender = txDetailResponse.data.inputs ? txDetailResponse.data.inputs[0].addresses[0] : null;
            const gasFee = txDetailResponse.data.fees || 0;

            return { 
                balance: (satoshisToBitcoin(balance)).toString(), 
                sender, 
                txHash, 
                gasFee: (satoshisToBitcoin(gasFee)).toString()
            };
        } else {
            // Blockchain.info mainnet response parsing
            const balance = response.data.final_balance;
            const txrefs = response.data.txs;

            if (!txrefs || txrefs.length === 0) {
                return { balance: (satoshisToBitcoin(balance)).toString() , sender: null, txHash: null, gasFee: null };
            }

            const transaction = txrefs[0];
            const sender = transaction.inputs ? transaction.inputs[0].prev_out.addr : null;
            const txHash = transaction.hash;
            const gasFee = transaction.fee || 0;

            return { 
                balance: (satoshisToBitcoin(balance)).toString(), 
                sender, 
                txHash, 
                gasFee: (satoshisToBitcoin(gasFee)).toString()
            };
        }
    } catch (error) {
        console.error('Error fetching Bitcoin details:', error.message);
        throw new Error('Failed to fetch Bitcoin details');
    }
}


function satoshisToBitcoin(satoshis) {
    return satoshis / 100000000;
}

module.exports = { getBitcoinDetails };