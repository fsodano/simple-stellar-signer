/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Transaction } from '@stellar/stellar-sdk';
import { PasskeyKit, PasskeyServer } from 'passkey-kit';

import { PasskeyIcon } from '../../../assets';
import { FACTORY_COONTRACT_ID, LAUNCHTUBE_JWT, LAUNCHTUBE_URL, SOROBANRPC_URL } from '../../../constants';
import { CURRENT_NETWORK_PASSPHRASE } from '../../stellar/StellarNetwork';
import type IStorage from '../../storage/IStorage';
import AbstractWallet from '../AbstractWallet';
import type IWallet from '../IWallet';
import KeyIdStorageKeyNotFoundError from './errors/KeyIdStorageKeyNotFoundError';

export default class Passkey extends AbstractWallet implements IWallet {
    public static NAME = 'passKey';
    public static FRIENDLY_NAME = 'Passkey';
    private account: PasskeyKit;
    private server: PasskeyServer;
    private PASSKEY_USER_NAME = 'simple-signer-passkey';

    constructor(storage: IStorage) {
        super(storage);

        this.account = new PasskeyKit({
            rpcUrl: SOROBANRPC_URL,
            networkPassphrase: CURRENT_NETWORK_PASSPHRASE,
            factoryContractId: FACTORY_COONTRACT_ID,
        });

        this.server = new PasskeyServer({
            rpcUrl: SOROBANRPC_URL,
            launchtubeUrl: LAUNCHTUBE_URL,
            launchtubeJwt: LAUNCHTUBE_JWT,
        });
    }

    public override async getPublicKey(): Promise<string> {
        try {
            const { contractId } = await this.account.connectWallet({
                getContractId: (spKeyId) => this.server.getContractId(spKeyId),
            });

            super.persistWallet();
            return contractId;
        } catch (error: any) {
            if (!error.message.includes('No `contractId` was found')) {
                return await this.registerPasskey();
            }
            throw new KeyIdStorageKeyNotFoundError();
        }
    }

    public async registerPasskey(): Promise<string> {
        const { contractId, xdr } = await this.account.createWallet(this.PASSKEY_USER_NAME, this.PASSKEY_USER_NAME);

        await this.server.send(xdr as string);
        super.persistWallet();
        return contractId;
    }

    public override async sign(tx: Transaction): Promise<string> {
        return await this.account.sign(tx.toXDR());
    }

    public override getFriendlyName(): string {
        return Passkey.FRIENDLY_NAME;
    }

    public override getName(): string {
        return Passkey.NAME;
    }

    public override getExtension(): string {
        return '';
    }

    public override getSvgIcon(): typeof PasskeyIcon {
        return PasskeyIcon;
    }

    public override isInstalled(): Promise<boolean> {
        const passkeyPromise: Promise<boolean> = new Promise((resolve) => {
            resolve(true);
        });
        return passkeyPromise;
    }
}
