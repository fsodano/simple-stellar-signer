import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class CreatePassiveSellOfferComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.CreatePassiveSellOffer) {
        super({
            title: 'OPERATION_CREATE_PASSIVE_SELL_OFFER',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'SELLING', value: operation.selling.code },
                { title: 'BUYING', value: operation.buying.code },
                { title: 'AMOUNT', value: operation.amount },
                { title: 'PRICE', value: operation.price },
            ],
        });
    }
}
