import { Asset, Operation, Transaction } from '@stellar/stellar-sdk';
import type { ITranslation } from 'src/lib/i18n/ITranslation';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class ChangeTrustComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.ChangeTrust) {
        let items: { title: keyof ITranslation; value: string; translatedValue?: keyof ITranslation }[];

        if (operation.line instanceof Asset) {
            items = [{ title: 'ASSET', value: operation.line.code }];
        } else {
            items = [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'ASSET_A', value: operation.line.assetA.code },
                { title: 'ASSET_B', value: operation.line.assetB.code },
            ];
        }

        items.unshift({
            title: 'SOURCE_ACCOUNT',
            value: operation.source || tx.source,
            translatedValue: 'YOUR_ACCOUNT',
        });
        items.push({ title: 'LIMIT', value: operation.limit });

        super({
            title: 'OPERATION_CHANGE_TRUST',
            operationItems: items,
        });
    }
}
