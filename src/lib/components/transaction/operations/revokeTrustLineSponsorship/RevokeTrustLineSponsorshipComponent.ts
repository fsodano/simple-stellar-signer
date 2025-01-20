import { Asset, Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class AllowTrustComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.RevokeTrustlineSponsorship) {
        let asset;
        if (operation.asset instanceof Asset) {
            asset = operation.asset.code;
        } else {
            asset = operation.asset;
        }

        super({
            title: 'OPERATION_REVOKE_TRUSTLINE_SPONSORSHIP',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'ACCOUNT', value: operation.account },
                { title: 'ASSET', value: asset },
            ],
        });
    }
}
