import type { WalletConnectService } from '../service/walletConnect';
import SessionStorage from '../storage/sessionStorage';
import LocalStorage from '../storage/storage';
import type IWallet from './IWallet';
import InvalidWalletError from './InvalidWalletError';
import Albedo from './albedo/Albedo';
import Freighter from './freighter/Freighter';
import Lobstr from './lobstr/Lobstr';
import Passkey from './passkey/Passkey';
import PrivateKey from './privateKey/PrivateKey';
import Rabet from './rabet/Rabet';
import WalletConnect from './walletConnect/WalletConnect';
import XBull from './xBull/XBull';

export default class WalletFactory {
    createAll(): IWallet[] {
        return [Albedo.NAME, XBull.NAME, Rabet.NAME, Freighter.NAME, Lobstr.NAME, PrivateKey.NAME, Passkey.NAME].map(
            this.create,
        );
    }

    create(name: string) {
        let wallet: IWallet;
        const localStorage = new LocalStorage();
        const sessionStorage = new SessionStorage();

        switch (name) {
            case Albedo.NAME:
                wallet = new Albedo(localStorage);
                break;
            case XBull.NAME:
                wallet = new XBull(localStorage);
                break;
            case Rabet.NAME:
                wallet = new Rabet(localStorage);
                break;
            case Freighter.NAME:
                wallet = new Freighter(localStorage);
                break;
            case Lobstr.NAME:
                wallet = new Lobstr(localStorage, sessionStorage);
                break;
            case PrivateKey.NAME:
                wallet = new PrivateKey(localStorage);
                break;
            case Passkey.NAME:
                wallet = new Passkey(localStorage);
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
