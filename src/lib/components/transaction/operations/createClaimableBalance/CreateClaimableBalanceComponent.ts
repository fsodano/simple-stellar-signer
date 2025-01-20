import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class CreateClaimableBalanceComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.CreateClaimableBalance) {
        const claimantsDestinations = operation.claimants.map((claimant) => claimant.destination);

        super({
            title: 'OPERATION_CREATE_CLAIMABLE_BALANCE',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'AMOUNT', value: operation.amount },
                { title: 'ASSET', value: operation.asset.code },
                { title: 'CLAIMANTS', value: claimantsDestinations },
            ],
        });
    }
}
