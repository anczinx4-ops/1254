// Blockchain configuration for real network deployment
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Supported networks (choose one for deployment)
export const NETWORKS: { [key: string]: NetworkConfig } = {
  polygonMumbai: {
    chainId: 80001,
    name: 'Polygon Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    blockExplorer: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    }
  },
  bscTestnet: {
    chainId: 97,
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    blockExplorer: 'https://testnet.bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  },
  avalancheFuji: {
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    blockExplorer: 'https://testnet.snowtrace.io',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    }
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    }
  }
};

// Current network configuration (update after deployment)
export const CURRENT_NETWORK = NETWORKS.polygonMumbai; // Change this to your chosen network

// Contract addresses (update these after deployment in Remix)
export const CONTRACT_ADDRESSES = {
  ACCESS_CONTROL: '', // Paste AccessControl contract address here
  BATCH_REGISTRY: '', // Paste BatchRegistry contract address here
};

// Admin wallet configuration
export const ADMIN_CONFIG = {
  // This will be your MetaMask address that deployed the contracts
  address: '', // Paste your admin address here
};

export const BLOCKCHAIN_CONFIG = {
  network: CURRENT_NETWORK,
  contracts: CONTRACT_ADDRESSES,
  admin: ADMIN_CONFIG,
  gasPrice: '0', // Free transactions for users
  gasLimit: '500000'
};