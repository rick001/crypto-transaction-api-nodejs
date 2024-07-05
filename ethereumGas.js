const { Web3 } = require('web3');
require('dotenv').config();
const axios = require('axios');

const ALCHEMY_MAINNET_URL = process.env.ALCHEMY_MAINNET_URL;
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
const NETWORK = process.env.NETWORK;

const alchemyUrl = NETWORK === 'testnet' ? ALCHEMY_SEPOLIA_URL : ALCHEMY_MAINNET_URL;

// Alchemy endpoint URL for the Sepolia testnet
const web3 = new Web3(new Web3.providers.HttpProvider(alchemyUrl));

async function getEthereumGas() {
    try {
        const gasPriceWei = await web3.eth.getGasPrice();
        const gasPriceEth = web3.utils.fromWei(gasPriceWei, 'ether');
        
        return gasPriceEth;
      
    } catch (error) {
        console.error('Error fetching Ethereum gas fee:', error);
        throw new Error('Failed to fetch Ethereum gas fee');
    }
}

module.exports = { getEthereumGas };
