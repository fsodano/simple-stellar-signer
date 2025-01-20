import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class ManageSellOfferComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.ManageSellOffer) {
        super({
            title: 'OPERATION_MANAGE_SELL_OFFER',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'SELLING_ASSET', value: operation.selling.code },
                { title: 'BUYING_ASSET', value: operation.buying.code },
                { title: 'AMOUNT', value: operation.amount },
                { title: 'PRICE', value: operation.price },
                { title: 'OFFER_ID', value: operation.offerId },
            ],
        });
    }
}
