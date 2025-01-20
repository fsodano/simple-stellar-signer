import { getPublicKey, isConnected, signTransaction } from '@lobstrco/signer-extension-api';
import type { FeeBumpTransaction, Transaction } from '@stellar/stellar-sdk';

import { LobstrIcon } from '../../../assets';
import { StellarNetwork } from '../../stellar/StellarNetwork';
import type IStorage from '../../storage/IStorage';
import AbstractWallet from '../AbstractWallet';
import type IWallet from '../IWallet';

export default class Lobstr extends AbstractWallet implements IWallet {
    public static readonly NAME = 'lobstr';
    public static readonly FRIENDLY_NAME = 'Lobstr';
    public static readonly lobstrExtension = 'https://lobstr.co/signer-extension/';
    public lobstrNetwork = StellarNetwork.PUBLIC.toUpperCase();
    private readonly CONNECTION_KEY = 'LOBSTR_CONNECTION_KEY';

    constructor(storage: IStorage, private sessionStorage: IStorage) {
        super(storage);
    }

    public override async getPublicKey(): Promise<string> {
        const publicKey = await getPublicKey();
        super.persistWallet();

        const session = this.sessionStorage.getItem(this.CONNECTION_KEY);

        if (session) {
            this.storage.storeItem(this.CONNECTION_KEY, session);
        }

        return publicKey;
    }

    public override async sign(tx: Transaction | FeeBumpTransaction): Promise<string> {
        const session = this.storage.getItem(this.CONNECTION_KEY);

        if (session) {
            this.sessionStorage.storeItem(this.CONNECTION_KEY, session);
        }

        return signTransaction(tx.toXDR());
    }

    public override getFriendlyName(): string {
        return Lobstr.FRIENDLY_NAME;
    }

    public override getName(): string {
        return Lobstr.NAME;
    }

    public override getSvgIcon(): typeof LobstrIcon {
        return LobstrIcon;
    }

    public override getExtension(): string {
        return Lobstr.lobstrExtension;
    }

    public override async isInstalled(): Promise<boolean> {
        return isConnected();
    }
}
