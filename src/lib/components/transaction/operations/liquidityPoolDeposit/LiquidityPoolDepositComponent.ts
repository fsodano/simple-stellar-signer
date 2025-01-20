import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';

export default class LiquidityPoolDepositComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.LiquidityPoolDeposit) {
        super({
            title: 'OPERATION_LIQUIDITY_POOL_DEPOSIT',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'LIQUIDITY_POOL_ID', value: operation.liquidityPoolId },
                { title: 'MAX_AMOUNT_A', value: operation.maxAmountA },
                { title: 'MAX_AMOUNT_B', value: operation.maxAmountB },
                { title: 'MINIMUM_PRICE', value: operation.minPrice },
                { title: 'MAXIMUM_PRICE', value: operation.maxPrice },
            ],
        });
    }
}
