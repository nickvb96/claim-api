import { TESTNET_RPC, RPC } from '@/config/secrets';
import Web3 from 'web3';
import axios from 'axios';
import { Contract } from 'web3-eth-contract';
import { NetworkProvider } from '../types/enums';
import { THXError } from './errors';
import { default as FeeCollector } from '../json/FeeCollector.json';
import { AbiItem } from 'web3-utils';
import { getContractConfig } from '@/config/contracts';
import { ContractName, currentVersion } from '@thxnetwork/artifacts';

export class MaxFeePerGasExceededError extends THXError {
    message = 'MaxFeePerGas from oracle exceeds configured cap';
}
export class NoFeeDataError extends THXError {
    message = 'Could not get fee data from oracle';
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

const testnet = new Web3(TESTNET_RPC);
const testnetAdmin = testnet.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
testnet.eth.defaultAccount = testnetAdmin.address;

const mainnet = new Web3(RPC);
const mainnetAdmin = mainnet.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
mainnet.eth.defaultAccount = mainnetAdmin.address;

export const getProvider = (npid: NetworkProvider) => {
    switch (npid) {
        default:
        case NetworkProvider.Test:
            return { web3: testnet, admin: testnetAdmin };
        case NetworkProvider.Main:
            return { web3: mainnet, admin: mainnetAdmin };
    }
};

// Type: safeLow, standard, fast
export async function getEstimatesFromOracle(npid: NetworkProvider, type = 'fast') {
    const url =
        npid === NetworkProvider.Main
            ? 'https://gasstation-mainnet.matic.network/v2'
            : 'https://gasstation-mumbai.matic.today/v2';
    const r = await axios.get(url);

    if (r.status !== 200) {
        throw new NoFeeDataError();
    }

    const estimatedBaseFee = r.data.estimatedBaseFee;
    const blockTime = r.data.blockTime;
    const blockNumber = r.data.blockNumber;

    return {
        baseFee: Number(estimatedBaseFee).toFixed(12),
        maxPriorityFeePerGas: r.data[type].maxPriorityFee,
        maxFeePerGas: r.data[type].maxFee,
        blockTime,
        blockNumber,
    };
}

export function getSelectors(contract: Contract) {
    const signatures = [];
    for (const sig of Object.keys(contract.methods)) {
        if (sig.indexOf('(') === -1) continue; // Only add selectors for full function signatures.
        signatures.push(testnet.eth.abi.encodeFunctionSignature(sig));
    }
    return signatures;
}

export const getContractFromName = (npid: NetworkProvider, contractName: ContractName, address?: string) => {
    const { web3 } = getProvider(npid);
    const contractConfig = getContractConfig(npid, contractName, currentVersion);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const abi = require(`@thxnetwork/artifacts/dist/exports/abis/${contractName}.json`);

    return new web3.eth.Contract(abi, address || contractConfig.address);
};

export const getFeeCollectorContract = (npid: NetworkProvider, address: string): Contract => {
    const { web3 } = getProvider(npid);
    const abi: any = FeeCollector;
    return new web3.eth.Contract(abi, address);
};

export const getContractFromAbi = (npid: NetworkProvider, abi: AbiItem[], address: string): Contract => {
    const { web3 } = getProvider(npid);
    return new web3.eth.Contract(abi, address);
};
