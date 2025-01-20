import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class LiquidityPoolWithdrawComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.LiquidityPoolWithdraw) {
        super({
            title: 'OPERATION_LIQUIDITY_POOL_WITHDRAW',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'LIQUIDITY_POOL_ID', value: operation.liquidityPoolId },
                { title: 'AMOUNT', value: operation.amount },
                { title: 'MIN_AMOUNT_A', value: operation.minAmountA },
                { title: 'MIN_AMOUNT_B', value: operation.minAmountB },
            ],
        });
    }
}
