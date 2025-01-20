import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class BeginSponsoringFutureReservesComponent
    extends AbstractOperationComponent
    implements IOperationComponent
{
    constructor(tx: Transaction, operation: Operation.BeginSponsoringFutureReserves) {
        super({
            title: 'OPERATION_BEGIN_SPONSORING_FUTURE_RESERVES',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'SPONSORED_ID', value: operation.sponsoredId },
            ],
        });
    }
}
