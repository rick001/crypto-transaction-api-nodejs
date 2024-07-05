require('dotenv').config();
const xrpl = require('xrpl');

const NETWORK = process.env.NETWORK;

async function getXrpGas() {
    const server = NETWORK === 'testnet' ? 'wss://s.altnet.rippletest.net:51233' : 'wss://s1.ripple.com';
    const client = new xrpl.Client(server);
    await client.connect();

    try {
        const feeResponse = await client.request({
            command: 'fee'
        });

        const gasFee = feeResponse.result.drops.base_fee;

        await client.disconnect();

        return (gasFee / 1000000) // Convert drops to XRP
        
    } catch (error) {
        console.error('Error fetching XRP gas fee:', error);
        await client.disconnect();
        throw new Error('Failed to fetch XRP gas fee');
    }
}

module.exports = { getXrpGas };