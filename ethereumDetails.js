const { Web3 } = require('web3');
require('dotenv').config();
const axios = require('axios');


const ALCHEMY_MAINNET_URL = process.env.ALCHEMY_MAINNET_URL;
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
const NETWORK = process.env.NETWORK;

const alchemyUrl = NETWORK === 'testnet' ? ALCHEMY_SEPOLIA_URL : ALCHEMY_MAINNET_URL;
   	

// Alchemy endpoint URL for the Sepolia testnet

const web3 = new Web3(new Web3.providers.HttpProvider(alchemyUrl));



async function getFirstTransactionHash(address) {
    try {
        const response = await axios.post(alchemyUrl, {
            jsonrpc: "2.0",
            method: "alchemy_getAssetTransfers",
            params: [{
                fromBlock: "0x0",
                toBlock: "latest",
                toAddress: address,
                category: ["external", "erc20", "erc721", "erc1155"],
                maxCount: "0x1"  // Specify maxCount in hex format
            }],
            id: 1
        });
        
        const transfers = response.data.result.transfers;
        if (!transfers || transfers.length === 0) {
            console.log('No transactions found for this address.');
            return null;
        }

        return transfers[0].hash;
    } catch (error) {
        console.error('Error fetching transaction hash:', error);
        return null;
    }
}

async function getTransactionDetails(transactionHash) {
    try {
        const transaction = await web3.eth.getTransaction(transactionHash);

        if (!transaction) {
            console.log('Unable to fetch the transaction.');
            return;
        }

        const gasFee = transaction.gas * transaction.gasPrice;
        return {
            sender: transaction.from,
            amountTransferred: web3.utils.fromWei(transaction.value, 'ether'),
            gasFee: web3.utils.fromWei(gasFee.toString(), 'ether'),
            txHash: transaction.hash
        };
    } catch (error) {
        console.error('Error fetching the transaction:', error);
        return null;
    }
}

async function getEthereumDetails(address) {
    const transactionHash = await getFirstTransactionHash(address);
    if (transactionHash) {
        return await getTransactionDetails(transactionHash);
    }
    return { error: 'No transactions found for this address.' };
}

module.exports = { getEthereumDetails };
