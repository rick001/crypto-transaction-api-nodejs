require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { getBitcoinDetails } = require('./bitcoinDetails.js'); // Importing the Bitcoin function
const { getDogecoinDetails } = require('./dogecoinDetails.js'); // Importing the Dogecoin function
const { getEthereumDetails } = require('./ethereumDetails.js'); // Importing the Ethereum function
const { getSolanaDetails } = require('./solanaDetails.js'); // Importing the Solana function
const { getXrpDetails } = require('./xrpDetails.js'); // Importing the XRP function


const { getBitcoinGas } = require('./bitcoinGas.js'); // Importing the Bitcoin function
const { getDogecoinGas } = require('./dogecoinGas.js'); // Importing the Dogecoin function
const { getEthereumGas } = require('./ethereumGas.js'); // Importing the Ethereum function
const { getSolanaGas } = require('./solanaGas.js'); // Importing the Solana function
const { getXrpGas } = require('./xrpGas.js'); // Importing the XRP function

const app = express();
const port = 3000;

const NETWORK = process.env.NETWORK;

app.use(bodyParser.json());

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Crypto Details API',
            version: '1.0.0',
            description: 'API to fetch details of various cryptocurrencies',
            contact: {
                name: 'Sayantan Roy'
            },
            servers: [{ url: `http://localhost:${port}` }]
        },
    },
    apis: [__filename], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /getCryptoDetails:
 *   post:
 *     summary: Get details of a cryptocurrency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: "tb1pv3vy8xgpag62u8h2s5l4xj8vvchj082kdl8pkftwqwl0mc0sa8vsndh9jy"
 *               chain:
 *                 type: string
 *                 example: "bitcoin"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: string
 *                 sender:
 *                   type: string
 *                 txHash:
 *                   type: string
 *                 gasFee:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
app.post('/getCryptoDetails', async (req, res) => {
    const { address, chain } = req.body;

    if (!address || !chain) {
        return res.status(400).json({ error: 'Address and chain are required' });
    }

    try {
        const details = await getCryptoDetails(address, chain);
        res.json(details);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

async function getCryptoDetails(address, chain) {
    switch (chain.toLowerCase()) {
        case 'bitcoin':
            return getBitcoinDetails(address);
        case 'dogecoin':
            return getDogecoinDetails(address);
        case 'ethereum':
            return getEthereumDetails(address);
        case 'solana':
            return getSolanaDetails(address);
        case 'xrp':
            return getXrpDetails(address);
        default:
            throw new Error('Unsupported chain');
    }
}

/**
 * @swagger
 * /fetchGasFee:
 *   post:
 *     summary: Fetch the gas fee for a given chain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chain:
 *                 type: string
 *                 example: "ethereum"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gasFee:
 *                   type: string
 *                   example: "100 Gwei"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
app.post('/fetchGasFee', async (req, res) => {
    const { chain } = req.body;

    if (!chain) {
        return res.status(400).json({ error: 'Chain is required' });
    }

    try {
        const gasFee = await getGasFee(chain);
        res.json({ gasFee });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

async function getGasFee(chain) {
    switch (chain.toLowerCase()) {
        case 'bitcoin':
            return getBitcoinGas();
        case 'dogecoin':
            return getDogecoinGas();
        case 'ethereum':
            return getEthereumGas();
        case 'solana':
            return getSolanaGas();
        case 'xrp':
            return getXrpGas();
        default:
            throw new Error('Unsupported chain');
    }
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
