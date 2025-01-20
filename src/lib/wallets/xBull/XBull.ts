import { xBullWalletConnect } from '@creit.tech/xbull-wallet-connect';
import type { FeeBumpTransaction, Transaction } from '@stellar/stellar-sdk';

import { XBullIcon } from '../../../assets';
import { CURRENT_NETWORK_PASSPHRASE, CURRENT_STELLAR_NETWORK, StellarNetwork } from '../../stellar/StellarNetwork';
import type IStorage from '../../storage/IStorage';
import AbstractWallet from '../AbstractWallet';
import type IWallet from '../IWallet';

type XBullNetwork = 'public' | 'testnet' | 'futurenet';
export default class XBull extends AbstractWallet implements IWallet {
    public static NAME = 'xbull';
    public static FRIENDLY_NAME = 'xBull';
    public static XBullExtension = 'https://wallet.xbull.app';
    public XBullNetwork: XBullNetwork;

    constructor(storage: IStorage) {
        super(storage);
        if (CURRENT_STELLAR_NETWORK === StellarNetwork.PUBLIC) {
            this.XBullNetwork = StellarNetwork.PUBLIC as XBullNetwork;
        } else if (CURRENT_STELLAR_NETWORK === StellarNetwork.TESTNET) {
            this.XBullNetwork = StellarNetwork.TESTNET as XBullNetwork;
        } else {
            this.XBullNetwork = StellarNetwork.FUTURENET as XBullNetwork;
        }
    }

    public override async getPublicKey(): Promise<string> {
        const bridge = new xBullWalletConnect();
        const publicKey = await bridge.connect();
        bridge.closeConnections();
        super.persistWallet();
        return publicKey;
    }

    public override async sign(tx: Transaction | FeeBumpTransaction): Promise<string> {
        const bridge = new xBullWalletConnect();
        const signedXdr = await bridge.sign({
            xdr: tx.toXDR(),
            network: CURRENT_NETWORK_PASSPHRASE,
        });
        bridge.closeConnections();
        return signedXdr;
    }

    public override getFriendlyName(): string {
        return XBull.FRIENDLY_NAME;
    }

    public override getName(): string {
        return XBull.NAME;
    }

    public override getSvgIcon(): typeof XBullIcon {
        return XBullIcon;
    }

    public override getExtension(): string {
        return XBull.XBullExtension;
    }

    public override isInstalled(): Promise<boolean> {
        const xBullPromise: Promise<boolean> = new Promise((resolve) => {
            resolve(true);
        });
        return xBullPromise;
    }
}
