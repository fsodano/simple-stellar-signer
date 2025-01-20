import type { FeeBumpTransaction, Transaction } from '@stellar/stellar-sdk';
import type { SessionTypes } from '@walletconnect/types';
import type IStorage from 'src/lib/storage/IStorage';

import { WalletConnectIcon } from '../../../assets';
import { NoPublicKeyError } from '../../errors/WalletConnectErrors';
import {
    IWalletConnetConnectionParams,
    WalletConnectAllowedMethods,
    WalletConnectService,
} from '../../service/walletConnect';
import { StellarNetwork } from '../../stellar/StellarNetwork';
import AbstractWallet from '../AbstractWallet';
import type IWallet from '../IWallet';

export default class WalletConnect extends AbstractWallet implements IWallet {
    public static NAME = 'walletConnect';
    public static FRIENDLY_NAME = 'WalletConnect';
    public walletConnectNetwork = StellarNetwork.PUBLIC;
    private walletConnectService: WalletConnectService;

    constructor(storage: IStorage, walletConnectService: WalletConnectService) {
        super(storage);
        this.walletConnectService = walletConnectService;
    }

    private async connect(params: IWalletConnetConnectionParams): Promise<SessionTypes.Struct> {
        return this.walletConnectService.connect(params);
    }

    public override async getPublicKey(): Promise<string> {
        await this.walletConnectService.disconnectAllSessions();

        const session = await this.connect({
            network: this.walletConnectNetwork,
            methods: [WalletConnectAllowedMethods.SIGN],
        });

        const publicKey = session.namespaces['stellar']?.accounts[0]?.split(':')[2];

        if (!publicKey) {
            throw new NoPublicKeyError();
        }

        super.persistWallet();

        return publicKey;
    }

    public override async sign(tx: Transaction | FeeBumpTransaction): Promise<string> {
        const { signedXDR } = await this.walletConnectService.makeRequest({
            network: this.walletConnectNetwork,
            method: WalletConnectAllowedMethods.SIGN,
            xdr: tx.toXDR(),
        });

        return signedXDR;
    }

    public override getFriendlyName(): string {
        return WalletConnect.FRIENDLY_NAME;
    }

    public override getName(): string {
        return WalletConnect.NAME;
    }

    public override getSvgIcon(): typeof WalletConnectIcon {
        return WalletConnectIcon;
    }

    public override isInstalled(): Promise<boolean> {
        return new Promise((resolve) => resolve(true));
    }
}
