const { Web3 } = require('web3');

// Hyperledger Besu Configuration
const BESU_CONFIG = {
  RPC_URL: process.env.BESU_RPC_URL || 'http://localhost:8545',
  NETWORK_ID: process.env.BESU_NETWORK_ID || '2018',
  CONSENSUS: 'IBFT2',
  GAS_PRICE: '0', // No gas fees in permissioned network
  GAS_LIMIT: '0x1fffffffffffff'
};

// Contract addresses (to be updated after deployment)
const CONTRACT_ADDRESSES = {
  ACCESS_CONTROL: process.env.ACCESS_CONTROL_ADDRESS || '',
  BATCH_REGISTRY: process.env.BATCH_REGISTRY_ADDRESS || ''
};

// Initialize Web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(BESU_CONFIG.RPC_URL));

// Admin account (for contract deployment and management)
const ADMIN_ACCOUNT = {
  address: process.env.ADMIN_ADDRESS || '',
  privateKey: process.env.ADMIN_PRIVATE_KEY || ''
};

// Node validator addresses for IBFT2 consensus
const VALIDATOR_NODES = [
  process.env.VALIDATOR_1 || '0x627306090abab3a6e1400e9345bc60c78a8bef57',
  process.env.VALIDATOR_2 || '0xf17f52151ebef6c7334fad080c5704d77216b732',
  process.env.VALIDATOR_3 || '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
  process.env.VALIDATOR_4 || '0x821aea9a577a9b44299b9c15c88cf3087f3b5544'
];

// Genesis configuration for Besu IBFT2 network
const GENESIS_CONFIG = {
  config: {
    chainId: parseInt(BESU_CONFIG.NETWORK_ID),
    homesteadBlock: 0,
    eip150Block: 0,
    eip155Block: 0,
    eip158Block: 0,
    byzantiumBlock: 0,
    constantinopleBlock: 0,
    petersburgBlock: 0,
    istanbulBlock: 0,
    muirGlacierBlock: 0,
    berlinBlock: 0,
    londonBlock: 0,
    ibft2: {
      blockperiodseconds: 2,
      epochlength: 30000,
      requesttimeoutseconds: 4
    }
  },
  nonce: '0x0',
  timestamp: '0x58ee40ba',
  extraData: '0x0000000000000000000000000000000000000000000000000000000000000000' +
             VALIDATOR_NODES.map(addr => addr.slice(2)).join('') +
             '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: BESU_CONFIG.GAS_LIMIT,
  difficulty: '0x1',
  mixHash: '0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365',
  coinbase: '0x0000000000000000000000000000000000000000',
  alloc: {}
};

module.exports = {
  web3,
  BESU_CONFIG,
  CONTRACT_ADDRESSES,
  ADMIN_ACCOUNT,
  VALIDATOR_NODES,
  GENESIS_CONFIG
};