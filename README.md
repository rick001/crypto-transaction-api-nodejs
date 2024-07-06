# Crypto Transaction API with Node.js and Express

Build a Cryptocurrency Transaction Details API with Node.js and Express. This project covers the setup, implementation, and Swagger integration to fetch transaction details for Bitcoin, Ethereum, Dogecoin, Solana, and XRP.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction
In the world of cryptocurrencies, accessing detailed transaction information is crucial for both developers and users. Whether you're tracking the movement of funds, auditing transactions, or building applications on top of blockchain data, having a reliable way to fetch transaction details is essential. This project walks you through building a Cryptocurrency Transaction Details API with Node.js and Express. This API fetches transaction details for various cryptocurrencies like Bitcoin, Ethereum, Dogecoin, Solana, and XRP.

## Features
- Fetch transaction details for multiple cryptocurrencies.
- Node.js and Express backend.
- Swagger integration for interactive API documentation.
- Easy to extend and maintain.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/crypto-transaction-api-nodejs.git
   cd crypto-transaction-api-nodejs
2. Install dependencies:
   ```sh
   npm install
3. Create a .env file in the root directory and add your environment variables:
   ALCHEMY_URL=your_alchemy_url

## Usage
1. Start Server
   ```sh
   node server.js
2. The server will run at http://localhost:3000. Visit http://localhost:3000/api-docs to access the Swagger UI for interactive API documentation.
3. You can test the /getCryptoDetails endpoint by sending a POST request with the following JSON body:
   ```json
    {
     "crypto": "ethereum",
     "address": "your_ethereum_address"
   }

## API Documentation
Access the Swagger UI for detailed API documentation and testing at http://localhost:3000/api-docs.

## Project Structure
   ```plaintext
   crypto-transaction-api-nodejs/
   │
   ├── server.js               # Main server file
   ├── bitcoinDetails.js       # Bitcoin transaction details logic
   ├── dogecoinDetails.js      # Dogecoin transaction details logic
   ├── ethereumDetails.js      # Ethereum transaction details logic
   ├── solanaDetails.js        # Solana transaction details logic
   ├── xrpDetails.js           # XRP transaction details logic
   ├── package.json            # Project metadata and dependencies
   ├── .env                    # Environment variables
   └── README.md               # Project documentation
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License.







