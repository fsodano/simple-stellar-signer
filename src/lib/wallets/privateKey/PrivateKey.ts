import type { FeeBumpTransaction, Transaction } from '@stellar/stellar-sdk';
import { Keypair } from '@stellar/stellar-sdk';

import { PrivateKeyIcon } from '../../../assets';
import type IDecryptableValue from '../../security/IDecryptableValue';
import { decryptValue, encryptValue } from '../../security/securityHelper';
import AbstractWallet from '../AbstractWallet';
import type IWallet from '../IWallet';
import InvalidPrivateKeyError from './errors/InvalidPrivateKeyError';
import PrivateKeyStorageKeyNotFoundError from './errors/PrivateKeyStorageKeyNotFoundError';

export default class PrivateKey extends AbstractWallet implements IWallet {
    public static NAME = 'privateKey';
    public static FRIENDLY_NAME = 'Private Key';
    public static SVG_ICON = PrivateKeyIcon;
    private CRYPTO_KEY_ITEM_NAME = 'cryptoKey';
    private PRIVATE_KEY_ITEM_NAME = 'privateKey';
    private INITIALIZATION_VECTORS_KEY_ITEM_NAME = 'iv';

    public override async getPublicKey(privateKey?: string): Promise<string> {
        let publicKey: string;
        try {
            if (privateKey) {
                publicKey = Keypair.fromSecret(privateKey).publicKey();
                super.persistWallet();

                await this.storeEncryptedPrivateKey(privateKey);
            }
        } catch (e) {
            if (e instanceof InvalidPrivateKeyError) {
                console.error('Invalid key, please try again');
            }

            throw e;
        }
        publicKey = await this.getDecryptedStoredPrivateKey();
        return Keypair.fromSecret(publicKey).publicKey();
    }

    public override async sign(tx: Transaction | FeeBumpTransaction): Promise<string> {
        const privateKey = await this.getDecryptedStoredPrivateKey();
        const keyPair = Keypair.fromSecret(privateKey);

        tx.sign(keyPair);
        return tx.toXDR();
    }

    public override getFriendlyName(): string {
        return PrivateKey.FRIENDLY_NAME;
    }

    public override getName(): string {
        return PrivateKey.NAME;
    }

    public override getExtension(): string {
        return '';
    }

    public override getSvgIcon(): typeof PrivateKeyIcon {
        return PrivateKeyIcon;
    }

    public override isInstalled(): Promise<boolean> {
        const privateKeyPromise: Promise<boolean> = new Promise((resolve) => {
            resolve(true);
        });
        return privateKeyPromise;
    }
    private async storeEncryptedPrivateKey(key: string): Promise<void> {
        const decryptableValue = await encryptValue(key);
        this.storage.storeItem(this.CRYPTO_KEY_ITEM_NAME, decryptableValue.cryptoKey);
        this.storage.storeItem(this.PRIVATE_KEY_ITEM_NAME, decryptableValue.value);
        this.storage.storeItem(this.INITIALIZATION_VECTORS_KEY_ITEM_NAME, decryptableValue.initializationVectors);
    }

    private async getDecryptedStoredPrivateKey(): Promise<string> {
        try {
            const storedPrivateKey = this.storage.getItem(this.PRIVATE_KEY_ITEM_NAME);
            const storedCryptoKey = this.storage.getItem(this.CRYPTO_KEY_ITEM_NAME);
            const storedIv = this.storage.getItem(this.INITIALIZATION_VECTORS_KEY_ITEM_NAME);
            return decryptValue({
                value: storedPrivateKey,
                cryptoKey: storedCryptoKey,
                initializationVectors: storedIv,
            } as IDecryptableValue);
        } catch (e) {
            throw new PrivateKeyStorageKeyNotFoundError();
        }
    }
}
