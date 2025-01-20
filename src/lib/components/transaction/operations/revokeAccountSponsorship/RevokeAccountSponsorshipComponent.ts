import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class RevokeAccountSponsorship extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.RevokeAccountSponsorship) {
        super({
            title: 'OPERATION_REVOKE_ACCOUNT_SPONSORSHIP',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'ACCOUNT', value: operation.account },
            ],
        });
    }
}
