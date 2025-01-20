import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class PathPaymentStrictSendComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.PathPaymentStrictSend) {
        const paths = operation.path.map((path) => path.code);

        super({
            title: 'OPERATION_PATH_PAYMENT_STRICT_RECEIVE',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'ASSET_TO_PAY', value: operation.sendAsset.code },
                { title: 'AMOUNT', value: operation.sendAmount },
                { title: 'DESTINATION', value: operation.destination },
                { title: 'DESTINATION_ASSET', value: operation.destAsset.code },
                { title: 'MINIMUM_AMOUNT_DESTINATION_ASSET', value: operation.destMin },
                { title: 'PATH', value: paths },
            ],
        });
    }
}
