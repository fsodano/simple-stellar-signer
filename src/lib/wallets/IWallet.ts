import type { FeeBumpTransaction, Transaction } from '@stellar/stellar-sdk';
import type { ComponentType } from 'svelte';

export default interface IWallet {
    getPublicKey(privateKey?: string): Promise<string>;
    sign(tx: Transaction | FeeBumpTransaction): Promise<string>;
    getName(): string;
    getFriendlyName(): string;
    getSvgIcon(): ComponentType;
    getExtension(): string;
    isInstalled(): Promise<boolean>;
}
