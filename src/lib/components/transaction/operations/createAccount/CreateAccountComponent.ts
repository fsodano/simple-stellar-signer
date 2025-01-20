import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class CreateAccountComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.CreateAccount) {
        super({
            title: 'OPERATION_CREATE_ACCOUNT',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'DESTINATION', value: operation.destination },
                { title: 'STARTING_BALANCE', value: operation.startingBalance },
            ],
        });
    }
}
