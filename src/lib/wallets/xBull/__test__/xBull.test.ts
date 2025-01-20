import { expect } from '@jest/globals';
import * as StellarSdk from '@stellar/stellar-sdk';

import { StellarNetwork } from '../../../stellar/StellarNetwork';
import LocalStorage from '../../../storage/storage';
import XBull from '../XBull';

const signedXdr =
    'AAAAAgAAAAA2jYMwhev3yM7P+JWOv6kRQZAssek5zytAbbyhJbOjNQAAAGQAATOSAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAA2jYMwhev3yM7P+JWOv6kRQZAssek5zytAbbyhJbOjNQAAAAAF9eEAAAAAAAAAAAA=';
const networkPassphrase = 'Test SDF Future Network ; October 2022';
const mockTx = {
    sign: jest.fn(),
    toXDR: jest.fn().mockReturnValue(signedXdr),
};

jest.mock('../../../../constants', () => ({
    STELLAR_NETWORK: 'futurenet',
    HORIZON_NETWORK_PASSPHRASE: 'Test SDF Future Network ; October 2022',
}));

jest.mock('@stellar/stellar-sdk', () => {
    return {
        Transaction: jest.fn().mockImplementation(() => mockTx),
        Networks: {
            FUTURENET: 'Test SDF Future Network ; October 2022',
        },
    };
});

const mockBridge = {
    sign: jest.fn(),
    closeConnections: jest.fn(),
};

jest.mock('@creit.tech/xbull-wallet-connect', () => {
    return {
        xBullWalletConnect: jest.fn().mockImplementationOnce(() => mockBridge),
    };
});

describe('xBull management', () => {
    const storage = new LocalStorage();
    const xBull = new XBull(storage);
    const xBullNetwork = StellarNetwork.FUTURENET;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should sign a transaction successfully from the Futurenet network', async () => {
        const responseXdr = 'XDR_FUTURENET';
        jest.spyOn(mockBridge, 'sign').mockImplementationOnce(() => responseXdr);
        jest.spyOn(mockBridge, 'closeConnections').mockReturnValue(() => '');

        const tx = new StellarSdk.Transaction(signedXdr, StellarSdk.Networks.FUTURENET);

        const result = await xBull.sign(tx);

        expect(result).toBe(responseXdr);
        expect(xBull.XBullNetwork).toEqual(xBullNetwork);
        expect(mockBridge.sign).toHaveBeenCalledTimes(1);
        expect(mockBridge.sign).toHaveBeenLastCalledWith({ xdr: signedXdr, network: networkPassphrase });
    });
});
