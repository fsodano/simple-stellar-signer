import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class SetTrustLineFlags extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.SetTrustLineFlags) {
        super({
            title: 'OPERATION_SET_TRUSTLINE_FLAGS',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'TRUSTOR', value: operation.trustor },
                { title: 'ASSET', value: operation.asset.code },
                { title: 'IS_AUTHORIZED', value: operation.flags.authorized ? 'True' : 'False' },
                {
                    title: 'IS_AUTHORIZED_TO_MAINTAIN_LIABILITIES',
                    value: operation.flags.authorizedToMaintainLiabilities ? 'True' : 'False',
                },
                { title: 'IS_CLAWBACK_ENABLED', value: operation.flags.clawbackEnabled ? 'True' : 'False' },
            ],
        });
    }
}
