import { getPublicKey, isConnected, signTransaction } from '@stellar/freighter-api';
import type { FeeBumpTransaction, Transaction } from '@stellar/stellar-sdk';

import { FreighterIcon } from '../../../assets';
import { CURRENT_STELLAR_NETWORK, StellarNetwork } from '../../stellar/StellarNetwork';
import type IStorage from '../../storage/IStorage';
import AbstractWallet from '../AbstractWallet';
import type IWallet from '../IWallet';

type FreighterNetwork = 'PUBLIC' | 'TESTNET' | 'FUTURENET';

export default class Freighter extends AbstractWallet implements IWallet {
    public static NAME = 'freighter';
    public static FRIENDLY_NAME = 'Freighter';
    public static freighterExtension = 'https://www.freighter.app/';
    public freighterNetwork: FreighterNetwork;

    constructor(storage: IStorage) {
        super(storage);

        if (CURRENT_STELLAR_NETWORK === StellarNetwork.PUBLIC) {
            this.freighterNetwork = StellarNetwork.PUBLIC.toUpperCase() as FreighterNetwork;
        } else if (CURRENT_STELLAR_NETWORK === StellarNetwork.TESTNET) {
            this.freighterNetwork = StellarNetwork.TESTNET.toUpperCase() as FreighterNetwork;
        } else {
            this.freighterNetwork = StellarNetwork.FUTURENET.toUpperCase() as FreighterNetwork;
        }
    }

    public override async getPublicKey(): Promise<string> {
        const publicKey = await getPublicKey();
        super.persistWallet();
        return publicKey;
    }

    public override async sign(tx: Transaction | FeeBumpTransaction): Promise<string> {
        return signTransaction(tx.toXDR(), { network: this.freighterNetwork });
    }

    public override getFriendlyName(): string {
        return Freighter.FRIENDLY_NAME;
    }

    public override getName(): string {
        return Freighter.NAME;
    }

    public override getSvgIcon(): typeof FreighterIcon {
        return FreighterIcon;
    }

    public override getExtension(): string {
        return Freighter.freighterExtension;
    }

    public override async isInstalled(): Promise<boolean> {
        return isConnected();
    }
}
