import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class RevokeLiquidityPoolSponsorship extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.RevokeLiquidityPoolSponsorship) {
        super({
            title: 'OPERATION_REVOKE_LIQUIDITY_POOL_SPONSORSHIP',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // Bug in the types of the operation in stellar-base
                { title: 'LIQUIDITY_POOL_ID', value: operation.liquidityPoolId },
            ],
        });
    }
}
