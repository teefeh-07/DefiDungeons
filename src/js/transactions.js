import { openContractCall } from '@stacks/connect';
import {
    uintCV,
    stringAsciiCV,
    contractPrincipalCV,
    listCV,
    PostConditionMode,
} from '@stacks/transactions';
import { network, userSession } from './wallet.js';
import { CONTRACT_ADDRESS, CONTRACT_NAME, TOKEN_ADDRESS_MOCK, TOKEN_NAME_MOCK } from './constants.js';

console.log("Transactions module loaded");

function saveTx(txId, type) {
    const history = JSON.parse(localStorage.getItem('dd_tx_history') || '[]');
    history.unshift({
        txId,
        type,
        timestamp: Date.now(),
        status: 'pending'
    });
    localStorage.setItem('dd_tx_history', JSON.stringify(history.slice(0, 10))); // keep last 10
    document.dispatchEvent(new Event('tx-history-updated'));
}

export function enterDungeon() {
    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'enter-dungeon',
        functionArgs: [
            contractPrincipalCV(TOKEN_ADDRESS_MOCK, TOKEN_NAME_MOCK)
        ],
        postConditionMode: PostConditionMode.Allow,
        network,
        appDetails: {
            name: 'DefiDungeons',
            icon: window.location.origin + '/logo.png',
        },
        onFinish: (data) => {
            console.log('Transaction submitted:', data.txId);
            saveTx(data.txId, 'Enter Dungeon');
            window.open(`https://explorer.hiro.so/txid/${data.txId}?chain=testnet`, '_blank');
        },
    };

    openContractCall(options);
}

export function completeDungeon() {
    const tokenAddress = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
    const tokenName = 'my-token';

    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'complete-dungeon',
        functionArgs: [
            contractPrincipalCV(tokenAddress, tokenName)
        ],
        postConditionMode: PostConditionMode.Allow,
        network,
        appDetails: {
            name: 'DefiDungeons',
            icon: window.location.origin + '/logo.png',
        },
        onFinish: (data) => {
            console.log('Transaction submitted:', data.txId);
            saveTx(data.txId, 'Complete Dungeon');
            window.open(`https://explorer.hiro.so/txid/${data.txId}?chain=testnet`, '_blank');
        },
    };

    openContractCall(options);
}

export function craftItem(materialIds) {
    // materialIds is array of numbers
    const list = listCV(materialIds.map(m => uintCV(m)));

    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'craft-item',
        functionArgs: [list],
        postConditionMode: PostConditionMode.Allow,
        network,
        appDetails: {
            name: 'DefiDungeons',
            icon: window.location.origin + '/logo.png',
        },
        onFinish: (data) => {
            console.log('Transaction submitted:', data.txId);
            saveTx(data.txId, 'Craft Item');
            window.open(`https://explorer.hiro.so/txid/${data.txId}?chain=testnet`, '_blank');
        },
    };

    openContractCall(options);
}
