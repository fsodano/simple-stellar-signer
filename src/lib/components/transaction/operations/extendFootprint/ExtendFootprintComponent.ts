import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class ExtendFootprintComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.ExtendFootprintTTL) {
        super({
            title: 'OPERATION_EXTEND_FOOTPRINT_TTL',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'EXTEND_TO', value: operation.extendTo },
            ],
        });
    }
}
