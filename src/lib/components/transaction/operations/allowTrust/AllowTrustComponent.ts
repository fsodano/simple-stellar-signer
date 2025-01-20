import type { Operation, Transaction } from '@stellar/stellar-sdk';
import type { ITranslation } from 'src/lib/i18n/ITranslation';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class AllowTrustComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.AllowTrust) {
        let authorization: keyof ITranslation;

        if (operation.authorize === 2) {
            authorization = 'AUTHORIZED_TO_MAINTAIN_ORDERS';
        } else if (operation.authorize) {
            authorization = 'AUTHORIZED_TO_TRANSACT';
        } else {
            authorization = 'NOT_AUTHORIZED_TO_TRANSACT';
        }

        super({
            title: operation.authorize ? 'ALLOW_TRUST' : 'DISALLOW_TRUST',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'ASSET', value: operation.assetCode },
                { title: 'AUTHORIZATION', value: '', translatedValue: authorization },
            ],
        });
    }
}
