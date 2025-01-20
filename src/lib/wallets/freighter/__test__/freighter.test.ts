/* eslint-disable @typescript-eslint/no-var-requires */
import { expect } from '@jest/globals';
import { signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

import { StellarNetwork } from '../../../stellar/StellarNetwork';
import LocalStorage from '../../../storage/storage';
import Freighter from '../Freighter';

const signedXdr =
    'AAAAAgAAAAA2jYMwhev3yM7P+JWOv6kRQZAssek5zytAbbyhJbOjNQAAAGQAATOSAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAA2jYMwhev3yM7P+JWOv6kRQZAssek5zytAbbyhJbOjNQAAAAAF9eEAAAAAAAAAAAA=';
const mockTx = {
    sign: jest.fn(),
    toXDR: jest.fn().mockReturnValue(signedXdr),
};

jest.mock('../../../../constants', () => ({
    STELLAR_NETWORK: 'futurenet',
}));

jest.mock('@stellar/freighter-api', () => ({
    signTransaction: jest.fn(),
}));

jest.mock('@stellar/stellar-sdk', () => {
    return {
        Transaction: jest.fn().mockImplementation(() => mockTx),
        Networks: {
            FUTURENET: 'Test SDF Future Network ; October 2022',
        },
    };
});

describe('Freighter management', () => {
    const storage = new LocalStorage();
    let freighter: Freighter;
    const freighterNetwork = StellarNetwork.FUTURENET.toUpperCase();

    beforeEach(() => {
        jest.clearAllMocks();
        freighter = new Freighter(storage);
    });
    it('Should sign a transaction successfully from the Futurenet network', async () => {
        const tx = new StellarSdk.Transaction(signedXdr, StellarSdk.Networks.FUTURENET);
        await freighter.sign(tx);

        expect(freighter.freighterNetwork).toEqual(freighterNetwork);
        expect(signTransaction).toHaveBeenCalledWith(signedXdr, {
            network: freighterNetwork,
        });
        expect(signTransaction).toHaveBeenCalledTimes(1);
    });
});
