import dotenv from 'dotenv';

dotenv.config();

const required = [
    'API_URL',
    'WALLET_URL',
    'RPC',
    'TESTNET_RPC',
    'MONGODB_URI',
    'PRIVATE_KEY',
    'PORT',
    'MAINNET_NETWORK_NAME',
    'TESTNET_NETWORK_NAME',
];

required.forEach((value: string) => {
    if (!process.env[value]) {
        console.log(`Set ${value} environment variable.`);
        process.exit(1);
    }
});

// This allows you to use a single process.env file with both regular and test configuration. This allows for an
// easy to use setup locally without having hardcoded credentials during test runs.
if (process.env.NODE_ENV === 'test') {
    if (process.env.PORT_TEST_OVERRIDE !== undefined) process.env.PORT = process.env.PORT_TEST_OVERRIDE;
    if (process.env.MONGODB_URI_TEST_OVERRIDE !== undefined)
        process.env.MONGODB_URI = process.env.MONGODB_URI_TEST_OVERRIDE;
    if (process.env.RPC_TEST_OVERRIDE !== undefined) process.env.RPC = process.env.RPC_TEST_OVERRIDE;
}

export const VERSION = 'v1';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const ISSUER = process.env.ISSUER;
export const AUTH_URL = process.env.AUTH_URL;
export const API_URL = process.env.API_URL;
export const WALLET_URL = process.env.WALLET_URL;
export const DASHBOARD_URL = process.env.DASHBOARD_URL;
export const WIDGETS_URL = process.env.WIDGETS_URL;
export const RPC = process.env.RPC;
export const TESTNET_RPC = process.env.TESTNET_RPC;
export const MONGODB_URI = process.env.MONGODB_URI;
export const MONGODB_URI_CLUSTER = process.env.MONGODB_URI_CLUSTER;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const PORT = process.env.PORT;
export const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
export const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
export const RATE_LIMIT_REWARD_GIVE = Number(process.env.RATE_LIMIT_REWARD_GIVE);
export const RATE_LIMIT_REWARD_CLAIM = Number(process.env.RATE_LIMIT_REWARD_CLAIM);
export const RATE_LIMIT_REWARD_GIVE_WINDOW = Number(process.env.RATE_LIMIT_REWARD_GIVE_WINDOW);
export const RATE_LIMIT_REWARD_CLAIM_WINDOW = Number(process.env.RATE_LIMIT_REWARD_CLAIM_WINDOW);
export const INITIAL_ACCESS_TOKEN = process.env.INITIAL_ACCESS_TOKEN;
export const CIRCULATING_SUPPLY = process.env.CIRCULATING_SUPPLY;
export const MAX_FEE_PER_GAS = String(process.env.MAX_FEE_PER_GAS);
export const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
export const MAINNET_NETWORK_NAME = process.env.MAINNET_NETWORK_NAME;
export const TESTNET_NETWORK_NAME = process.env.TESTNET_NETWORK_NAME;
export const MINIMUM_GAS_LIMIT = 54680;
export const TESTNET_INFURA_GAS_TANK = process.env.TESTNET_INFURA_GAS_TANK;
export const INFURA_GAS_TANK = process.env.INFURA_GAS_TANK;
export const ITX_ACTIVE = process.env.ITX_ACTIVE === 'true' || process.env.ITX_ACTIVE === '1';
export const COV_PRIVATE_KEY = process.env.COV_PRIVATE_KEY;
export const INSERT_WALLET_KEY = process.env.KEYPHRASE_ADD_TOKEN;
export const FEE_COLLECTOR_ADDRESS = process.env.FEE_COLLECTOR_ADDRESS || '0xD4702511e43E2b778b34185A59728B57bE61aEd1';
export const MAIN_TRANSFER_ADDRESS = process.env.MAIN_TRANSFER_ADDRESS || '0x08302cf8648a961c607e3e7bd7b7ec3230c2a6c5';
