/* eslint-disable @typescript-eslint/no-var-requires */
import { expect } from '@jest/globals';
import StellarSdk from '@stellar/stellar-sdk';
import { TextDecoder, TextEncoder } from 'util';

import LocalStorage from '../../../storage/storage';
import Passkey from '../Passkey';

global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
global.TextDecoder = TextDecoder;

jest.mock('../../../../constants', () => ({
    SOROBANRPC_URL: 'https://soroban-testnet.stellar.org',
    CURRENT_NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
    FACTORY_COONTRACT_ID: 'CCPLERXCJZB7LX2VOSOCBNRN754FRLHI6Y2AVOQBA5L7C2ZJX5RFVVET',
    LAUNCHTUBE_URL: 'https://testnet.launchtube.xyz',
    LAUNCHTUBE_JWT:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjOGVlMjIwMjM2NjllZmY3MWYxNmMwNjc0MTZlZTgwNDM2OGViNjBmZDdmYzc1NmE3MjdjZWVmMGRiNjUwYmYzIiwiZXhwIjoxNzMzMjUxNzA1LCJjcmVkaXRzIjoxMDAwMDAwMDAwLCJpYXQiOjE3MjU5OTQxMDV9.0z6AZ_r2D_8r5l5jxG9JDRMDoi2IlYxAGq-nR9TzCm4',
}));

const mockTx = {
    sign: jest.fn(),
    toXDR: jest.fn(),
};

jest.mock('@stellar/stellar-sdk', () => {
    return {
        Transaction: jest.fn().mockImplementation(() => mockTx),
        Networks: {
            TESTNET: 'Test SDF Future Network ; October 2022',
        },
    };
});

const mockPasskeyKit = {
    connectWallet: jest.fn(),
    createWallet: jest.fn(),
    sign: jest.fn(),
};

const mockPasskeyServer = {
    send: jest.fn(),
    getContractId: jest.fn(),
};

jest.mock('passkey-kit', () => {
    return {
        PasskeyKit: jest.fn().mockImplementation(() => mockPasskeyKit),
        PasskeyServer: jest.fn().mockImplementation(() => mockPasskeyServer),
    };
});

describe('Passkey management', () => {
    const storage = new LocalStorage();
    let wallet: Passkey;
    const spContractId = 'mockedContractId';
    const signedTransaction = 'XDR_SIGNED_PASSKEY';

    beforeEach(() => {
        jest.clearAllMocks();
        wallet = new Passkey(storage);
    });

    it('Should get a keyId after connecting a passkey', async () => {
        mockPasskeyKit.connectWallet.mockResolvedValue({ contractId: spContractId });
        mockPasskeyServer.getContractId.mockResolvedValue({ contractId: spContractId });

        const contractId = await wallet.getPublicKey();

        expect(contractId).toEqual(spContractId);
        expect(mockPasskeyKit.connectWallet).toHaveBeenCalledTimes(1);
    });

    it('Should register a new passkey and return its keyId', async () => {
        mockPasskeyKit.createWallet.mockResolvedValue({ contractId: spContractId, xdr: signedTransaction });
        mockPasskeyServer.send.mockResolvedValue({ contractId: spContractId });

        const registeredContractId = await wallet.registerPasskey();

        expect(registeredContractId).toEqual(spContractId);
        expect(mockPasskeyServer.send).toHaveBeenCalledTimes(1);
        expect(mockPasskeyKit.createWallet).toHaveBeenCalledTimes(1);
    });

    it('Should sign a transaction successfully with the passkey', async () => {
        mockPasskeyKit.sign.mockResolvedValue(signedTransaction);

        const signedXdr =
            'AAAAAgAAAAA2jYMwhev3yM7P+JWOv6kRQZAssek5zytAbbyhJbOjNQAAAGQAATOSAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAA2jYMwhev3yM7P+JWOv6kRQZAssek5zytAbbyhJbOjNQAAAAAF9eEAAAAAAAAAAAA=';
        const tx = new StellarSdk.Transaction(signedXdr, StellarSdk.Networks.TESTNET);

        const transaction = await wallet.sign(tx);

        expect(transaction).toEqual(signedTransaction);
        expect(mockPasskeyKit.sign).toHaveBeenCalledTimes(1);
    });
});
