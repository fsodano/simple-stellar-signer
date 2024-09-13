import type { WalletConnectService } from '../service/walletConnect';
import LocalStorage from '../storage/storage';
import type IWallet from './IWallet';
import InvalidWalletError from './InvalidWalletError';
import Albedo from './albedo/Albedo';
import Freighter from './freighter/Freighter';
import Passkey from './passkey/Passkey';
import PrivateKey from './privateKey/PrivateKey';
import Rabet from './rabet/Rabet';
import WalletConnect from './walletConnect/WalletConnect';
import XBull from './xBull/XBull';

export default class WalletFactory {
    createAll(): IWallet[] {
        return [Albedo.NAME, XBull.NAME, Rabet.NAME, Freighter.NAME, PrivateKey.NAME, Passkey.NAME].map(this.create);
    }

    create(name: string) {
        let wallet: IWallet;
        const storage = new LocalStorage();
        switch (name) {
            case Albedo.NAME:
                wallet = new Albedo(storage);
                break;
            case XBull.NAME:
                wallet = new XBull(storage);
                break;
            case Rabet.NAME:
                wallet = new Rabet(storage);
                break;
            case Freighter.NAME:
                wallet = new Freighter(storage);
                break;
            case PrivateKey.NAME:
                wallet = new PrivateKey(storage);
                break;
            case Passkey.NAME:
                wallet = new Passkey(storage);
                break;
            default:
                throw new InvalidWalletError();
        }
        return wallet;
    }

    createWalletConnect(walletConnectService: WalletConnectService): IWallet {
        const storage = new LocalStorage();
        return new WalletConnect(storage, walletConnectService);
    }
}
