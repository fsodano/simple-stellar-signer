import type { Operation, Transaction } from '@stellar/stellar-sdk';

import AbstractOperationComponent from '../AbstractOperationComponent';
import type IOperationComponent from '../IOperationComponent';
import { getSignerType } from './revokeSignerHelper';

export default class RevokeSignerSponsorshipComponent
    extends AbstractOperationComponent
    implements IOperationComponent
{
    constructor(tx: Transaction, operation: Operation.RevokeSignerSponsorship) {
        const signer = getSignerType(operation.signer);
        super({
            title: 'OPERATION_REVOKE_SIGNER_SPONSORSHIP',
            operationItems: [
                { title: 'SOURCE_ACCOUNT', value: operation.source || tx.source, translatedValue: 'YOUR_ACCOUNT' },
                { title: 'ACCOUNT', value: operation.account },
                { title: 'SIGNER', value: signer },
            ],
        });
    }
}
