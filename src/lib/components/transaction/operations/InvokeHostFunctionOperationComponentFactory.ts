import type { Operation, Transaction } from '@stellar/stellar-sdk';

import { getContractAddress, getContractMethodsParams } from '../../../soroban/GetContractFunctionInfo';
import { InvokeHostFunction, InvokeHostFunctionType } from '../../../stellar/InvokeHostFunction';
import InvokeHostFunctionComponent from './invokeHostFunction/InvokeHostFunctionComponent';

export class InvokeHostFunctionComponentFactory {
    async create(tx: Transaction, operation: Operation): Promise<InvokeHostFunctionComponent> {
        const invokeHostFunction = operation as Operation.InvokeHostFunction;
        const type = invokeHostFunction.func.switch().name;

        if (type === InvokeHostFunctionType.InvokeContract) {
            const title = invokeHostFunction.func.invokeContract().functionName().toString();

            const contractId = getContractAddress(
                invokeHostFunction.func.invokeContract().contractAddress().contractId().toString('hex'),
            );
            const parameters = await getContractMethodsParams(contractId, title);

            return new InvokeHostFunctionComponent(tx, invokeHostFunction, contractId, title, parameters[0]!);
        }

        return new InvokeHostFunctionComponent(
            tx,
            invokeHostFunction,
            undefined,
            undefined,
            undefined,
            type === InvokeHostFunctionType.CreateContract
                ? InvokeHostFunction.CreateContract
                : InvokeHostFunction.UploadWasm,
        );
    }
}
