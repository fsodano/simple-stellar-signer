import type { Transaction } from 'stellar-sdk';
import AbstractWallet from './AbstractWallet';
import type IWallet from './interfaces/IWallet';
import { xBull } from '../../../../assets/index';
import { StellarNetwork } from '../../../../helpers/StellarNetwork';

export default class XBull extends AbstractWallet implements IWallet {
    public static NAME = 'xbull';
    public XBullNetwork: string;

    constructor() {
        super();
        const stellarNetwork = import.meta.env.VITE_STELLAR_NETWORK;

        if (stellarNetwork === StellarNetwork.PUBLIC) {
            this.XBullNetwork = StellarNetwork.PUBLIC;
        } else {
            this.XBullNetwork = StellarNetwork.TESTNET;
        }
    }

    getConnectObject() {
        return {
            name: 'xBull',
            connectMethod: async () => {
                this.logIn(await this.getPublicKey());
            },
            img: xBull,
            width: 35,
            height: 45,
        }; // this has to be an interface
    }

    async getPublicKey(): Promise<string> {
        await window.xBullSDK.connect({ canRequestPublicKey: true, canRequestSign: true });
        const publicKey = await window.xBullSDK.getPublicKey();
        return publicKey;
    }

    logIn(publicKey: string) {
        super.connectWithWallet(XBull.NAME, publicKey);
    }

    async sign(tx: Transaction) {
        const signedXdr = await window.xBullSDK.signXDR(tx.toXDR(), { network: this.XBullNetwork });
        return signedXdr;
    }
}
