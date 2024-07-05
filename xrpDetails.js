require('dotenv').config();
const xrpl = require('xrpl');

const NETWORK = process.env.NETWORK;

async function getXrpDetails(address) {
    const server = NETWORK === 'testnet' ? 'wss://s.altnet.rippletest.net:51233' : 'wss://s1.ripple.com';
    const client = new xrpl.Client(server);
    await client.connect();
    const balance = await client.request({
        command: 'account_info',
        account: address
    });

    // Logging the response from Ripple
    //console.log('XRP response:', balance);

    const txs = await client.request({
        command: 'account_tx',
        account: address,
        ledger_index_min: -1,
        ledger_index_max: -1,
        limit: 1
    });

    // Logging the transactions response from Ripple
    //console.log('XRP transactions response:', txs);

    const transaction = txs.result.transactions.length > 0 ? txs.result.transactions[0] : null;

    if (!transaction) {
        return { balance: (balance.result.account_data.Balance / 1000000).toString() , sender: 'Unknown', txHash: 'Unknown', gasFee: 'Unknown' };
    }

    const sender = transaction.tx.Account;
    const txHash = transaction.tx.hash;
    const gasFee = transaction.tx.Fee;

    await client.disconnect();

    return { 
        balance: (balance.result.account_data.Balance / 1000000).toString() , 
        sender, 
        txHash, 
        gasFee: (gasFee / 1000000).toString()
    };
}


module.exports = { getXrpDetails };