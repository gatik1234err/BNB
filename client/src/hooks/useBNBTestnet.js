import { useState, useCallback } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';

// BNB Smart Chain Testnet Configuration
const BSC_TESTNET_CHAIN_ID = '0x61'; // 97 in hexadecimal
const BSC_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.bnbchain.org:8545';
const BSC_TESTNET_PARAMS = {
    chainId: BSC_TESTNET_CHAIN_ID,
    chainName: 'BNB Smart Chain Testnet',
    rpcUrls: [BSC_TESTNET_RPC],
    nativeCurrency: {
        name: 'Testnet BNB',
        symbol: 'tBNB',
        decimals: 18,
    },
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
};

const PREDICTION_MARKET_ABI = [
    "function resolveMarket(uint256 marketId, uint8 outcome) external",
    "function placeBet(uint256 marketId, uint8 outcome) external payable",
    "function claimWinnings(uint256 marketId) external",
    "event MarketResolved(uint256 indexed marketId, uint8 outcome)"
];

export function useBNBTestnet(contractAddress = '') {
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('0');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');

    const handleError = (err, defaultMsg) => {
        console.error(err);
        const userFriendlyMsg = err?.info?.error?.message || err?.message || defaultMsg;
        setError(userFriendlyMsg);
        return false;
    };

    const updateBalance = async (address, ethProvider) => {
        try {
            const bal = await ethProvider.getBalance(address);
            setBalance(formatEther(bal));
        } catch (err) {
            console.error('Failed to fetch balance:', err);
        }
    };

    const connectWallet = async (walletType = 'METAMASK') => {
        setIsConnecting(true);
        setError('');

        try {
            let rawProvider;

            if (walletType === 'BINANCE') {
                if (window.BinanceChain) {
                    rawProvider = window.BinanceChain;
                } else if (window.ethereum?.providers) {
                    rawProvider = window.ethereum.providers.find(p => p.isBinance);
                } else if (window.ethereum?.isBinance) {
                    rawProvider = window.ethereum;
                }

                if (!rawProvider) {
                    throw new Error('Binance Wallet extension not found. Please install it.');
                }
            } else {
                if (window.ethereum?.providers) {
                    rawProvider = window.ethereum.providers.find(p => p.isMetaMask) || window.ethereum;
                } else if (window.ethereum) {
                    rawProvider = window.ethereum;
                }

                if (!rawProvider) {
                    throw new Error('MetaMask extension not found. Please install it.');
                }
            }

            const browserProvider = new BrowserProvider(rawProvider);
            setProvider(browserProvider);

            // Switch to BNB Testnet
            try {
                await rawProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: BSC_TESTNET_CHAIN_ID }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await rawProvider.request({
                        method: 'wallet_addEthereumChain',
                        params: [BSC_TESTNET_PARAMS],
                    });
                } else {
                    throw new Error('Failed to switch to BNB Testnet network.');
                }
            }

            // Request Accounts
            const accounts = await browserProvider.send('eth_requestAccounts', []);
            const userAccount = accounts[0];
            const theSigner = await browserProvider.getSigner();

            setAccount(userAccount);
            setSigner(theSigner);
            await updateBalance(userAccount, browserProvider);

            // Setup listeners
            rawProvider.on('accountsChanged', (newAccounts) => {
                if (newAccounts.length > 0) {
                    setAccount(newAccounts[0]);
                    updateBalance(newAccounts[0], browserProvider);
                } else {
                    setAccount('');
                    setBalance('0');
                    setSigner(null);
                }
            });

            rawProvider.on('chainChanged', () => window.location.reload());

        } catch (err) {
            handleError(err, `Wallet connection failed for ${walletType}`);
        } finally {
            setIsConnecting(false);
        }
    };

    const sendBNB = async (recipientAddress, amountInBNB) => {
        if (!signer) return handleError(new Error('Signer not initialized'), 'Please connect your wallet first');
        setError('');
        try {
            const txResponse = await signer.sendTransaction({
                to: recipientAddress,
                value: parseEther(amountInBNB.toString()),
            });
            const receipt = await txResponse.wait();
            await updateBalance(account, provider);
            return receipt;
        } catch (err) {
            return handleError(err, 'Transaction failed');
        }
    };

    const resolveMarket = async (marketId, outcome) => {
        if (!signer || !contractAddress) return handleError(new Error('Signer missing'), 'Setup incomplete');
        setError('');
        try {
            const contract = new Contract(contractAddress, PREDICTION_MARKET_ABI, signer);
            const estimatedGas = await contract.resolveMarket.estimateGas(marketId, outcome);
            const gasLimit = (estimatedGas * 110n) / 100n;
            const txResponse = await contract.resolveMarket(marketId, outcome, { gasLimit });
            const receipt = await txResponse.wait();
            return receipt;
        } catch (err) {
            return handleError(err, 'Failed to resolve market');
        }
    };

    return {
        account,
        balance,
        isConnecting,
        error,
        connectWallet,
        sendBNB,
        resolveMarket,
        contractAddress
    };
}
