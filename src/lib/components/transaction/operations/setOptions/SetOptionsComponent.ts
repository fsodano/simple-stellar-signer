import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';
import getValue from './setOptionsHelper';

export default class SetOptionsComponent extends AbstractOperationComponent implements IOperationComponent {
    constructor(tx: Transaction, operation: Operation.SetOptions) {
        const signerValue = getValue(operation);

        super({
            title: 'OPERATION_SET_OPTIONS',

            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },

                operation.inflationDest
                    ? { title: 'DESTINATION_INFLATION', value: operation.inflationDest }
                    : undefined,
                operation.clearFlags ? { title: 'CLEAR_FLAGS', value: operation.clearFlags } : undefined,
                operation.setFlags ? { title: 'SET_FLAGS', value: operation.setFlags } : undefined,
                operation.masterWeight ? { title: 'MASTER_WEIGHT', value: operation.masterWeight } : undefined,
                operation.lowThreshold ? { title: 'LOW_THRESHOLD', value: operation.lowThreshold } : undefined,
                operation.medThreshold ? { title: 'MEDIUM_THRESHOLD', value: operation.medThreshold } : undefined,
                operation.highThreshold ? { title: 'HIGH_THRESHOLD', value: operation.highThreshold } : undefined,
                operation.homeDomain ? { title: 'HOME_DOMAIN', value: operation.homeDomain } : undefined,
                signerValue
                    ? {
                          title: 'SIGNER',
                          value: signerValue,
                          highlightTxDescription: 'WARNING_TX_DESCRIPTION',
                      }
                    : undefined,
            ],
        });
    }
}
