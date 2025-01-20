import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class ManageDataComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.ManageData) {
        super({
            title: 'OPERATION_MANAGE_DATA',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'NAME', value: operation.name },
                operation.value ? { title: 'DATA', value: operation.value } : undefined,
            ],
        });
    }
}
