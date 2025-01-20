import type { Transaction } from '@stellar/stellar-sdk';
import type { ComponentType } from 'svelte';

import NotImplementedError from '../errors/NotImplementedError';
import type IStorage from '../storage/IStorage';
import type IWallet from './IWallet';

export default abstract class AbstractWallet implements IWallet {
    protected readonly WALLET_STORAGE_KEY = 'wallet';
    constructor(protected storage: IStorage) {}

    public getFriendlyName(): string {
        throw new NotImplementedError();
    }

    public getName(): string {
        throw new NotImplementedError();
    }

    public getPublicKey(_privateKey?: string): Promise<string> {
        throw new NotImplementedError();
    }

    public sign(_tx: Transaction): Promise<string> {
        throw new NotImplementedError();
    }

    public getSvgIcon(): ComponentType {
        throw new NotImplementedError();
    }

    public getExtension(): string {
        throw new NotImplementedError();
    }

    public isInstalled(): Promise<boolean> {
        throw new NotImplementedError();
    }

    protected persistWallet(): void {
        this.storage.clearStorage(this.WALLET_STORAGE_KEY);
        this.storage.storeItem(this.WALLET_STORAGE_KEY, this.getName());
    }
}
