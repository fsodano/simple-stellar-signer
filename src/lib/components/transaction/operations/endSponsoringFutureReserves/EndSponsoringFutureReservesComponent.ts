import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class EndSponsoringFutureReservesComponent
    extends AbstractOperationComponent
    implements IOperationComponent
{
    constructor(tx: Transaction, operation: Operation.EndSponsoringFutureReserves) {
        super({
            title: 'OPERATION_END_SPONSORING_FUTURE_RESERVES',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
            ],
        });
    }
}
