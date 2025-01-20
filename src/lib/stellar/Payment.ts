import { Asset, BASE_FEE, Operation, TransactionBuilder } from '@stellar/stellar-sdk';

import { CURRENT_NETWORK_PASSPHRASE } from './StellarNetwork';
import { server } from './utils';

export async function checkTrustline(receiver: string, assetCode: string, issuer: string) {
    try {
        const account = await server.loadAccount(receiver);

        for (const balance of account.balances) {
            if (
                (assetCode === 'native' && balance.asset_type === 'native') ||
                ('asset_code' in balance && balance.asset_code === assetCode && balance.asset_issuer === issuer)
            ) {
                return true;
            }
        }
        return false;
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export async function createPaymentTransaction(
    publicKey: string,
    receiver: string,
    amount: string,
    assetCode: string,
    issuer?: string,
) {
    const asset = assetCode === 'native' ? Asset.native() : new Asset(assetCode, issuer);

    try {
        const account = await server.loadAccount(publicKey);
        return new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: CURRENT_NETWORK_PASSPHRASE,
        })
            .addOperation(
                Operation.payment({
                    destination: receiver,
                    asset: asset,
                    amount: amount,
                }),
            )
            .setTimeout(30)
            .build();
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}
