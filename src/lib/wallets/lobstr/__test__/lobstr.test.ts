/* eslint-disable @typescript-eslint/no-var-requires */
import { expect } from '@jest/globals';
import { signTransaction } from '@lobstrco/signer-extension-api';
import { Networks, Transaction } from '@stellar/stellar-sdk';

import { StellarNetwork } from '../../../stellar/StellarNetwork';
import SessionStorage from '../../../storage/sessionStorage';
import LocalStorage from '../../../storage/storage';
import Lobstr from '../Lobstr';

const signedXdr =
    'AAAAAgAAAAA2jYMwhev3yM7P+JWOv6kRQZAssek5zytAbbyhJbOjNQAAAGQAATOSAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAA2jYMwhev3yM7P+JWOv6kRQZAssek5zytAbbyhJbOjNQAAAAAF9eEAAAAAAAAAAAA=';

const mockTx = {
    sign: jest.fn(),
    toXDR: jest.fn().mockReturnValue(signedXdr),
};

jest.mock('axios', () => ({
    get: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
    post: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
    create: jest.fn().mockImplementation(() => {
        return {
            interceptors: {
                response: {
                    use: jest.fn(),
                },
            },
        };
    }),
}));

jest.mock('../../../../constants', () => ({
    STELLAR_NETWORK: 'public',
}));

jest.mock('@lobstrco/signer-extension-api', () => ({
    signTransaction: jest.fn(),
}));

jest.mock('@stellar/stellar-sdk', () => {
    return {
        Transaction: jest.fn().mockImplementation(() => mockTx),
        Networks: {
            PUBLIC: 'Public Global Stellar Network ; September 2015',
        },
    };
});

describe('Lobstr management', () => {
    const localStorage = new LocalStorage();
    const sessionStorage = new SessionStorage();
    let lobstr: Lobstr;
    const lobstrNetwork = StellarNetwork.PUBLIC.toUpperCase();

    beforeEach(() => {
        jest.clearAllMocks();
        lobstr = new Lobstr(localStorage, sessionStorage);
    });

    it('Should sign a transaction successfully on the Public network', async () => {
        const tx = new Transaction(signedXdr, Networks.PUBLIC);
        await lobstr.sign(tx);

        expect(lobstr.lobstrNetwork).toEqual(lobstrNetwork);
        expect(signTransaction).toHaveBeenCalledWith(signedXdr);
        expect(signTransaction).toHaveBeenCalledTimes(1);
    });
});
