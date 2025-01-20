import { Address, Contract, rpc as SorobanRpc, StrKey, xdr } from '@stellar/stellar-sdk';
import { Buffer } from 'buffer';

import type { ContractFunctionInfo, InputInfo } from './ContractFunctionInfo.interface';
import { sorobanServer } from './utils';
import { getStellarAssetContractFunctions } from './utils/getSACFunctions';

const tryDecodeEntry = (uint8: Uint8Array, offset: number) => {
    for (let length = 1; length <= uint8.length - offset; length++) {
        const subArray = uint8.subarray(offset, offset + length);

        try {
            const partialDecodedEntry = xdr.ScSpecEntry.fromXDR(Buffer.from(subArray));
            return { partialDecodedEntry, length };
        } catch (error) {
            console.error(error);
        }
    }

    return { partialDecodedEntry: null, length: 0 };
};
export function getContractHash(contractId: string) {
    try {
        const contract = new Contract(contractId);
        return contract.address().toScAddress().contractId().toString('hex');
    } catch (e) {
        throw new Error('Cannot get contract hash');
    }
}

export const getContractAddress = (contractHash: string) => {
    return StrKey.encodeContract(hexToByte(contractHash));
};

export async function getContractMethodsParams(contractAddress: string, funcTitle: string) {
    const contract = await getContractData(contractAddress);
    const functions: ContractFunctionInfo[] = [];

    if (!contract?.wasmId) {
        const stellarAssetContractFunctions = getStellarAssetContractFunctions();
        for (const func of stellarAssetContractFunctions) {
            if (func.name === funcTitle) {
                const inputs: InputInfo[] = func.inputs.map((input) => ({
                    name: input.name,
                }));
                functions.push({ description: '', name: func.name, inputs });
            }
        }
        return Promise.resolve(functions);
    }

    const code = await getContractCode(contract.wasmId);
    const buffer = Buffer.from(code?.wasmCode || '', 'hex');

    const executable = new WebAssembly.Module(buffer);
    const contractSpecificationSection = WebAssembly.Module.customSections(executable, 'contractspecv0');

    for (const item of contractSpecificationSection) {
        const entries = decodeContractSpecBuffer(item);

        entries.forEach((entry: xdr.ScSpecEntry) => {
            if (entry.switch() === xdr.ScSpecEntryKind.scSpecEntryFunctionV0()) {
                const functionV0 = entry.value() as xdr.ScSpecFunctionV0;
                const name = functionV0.name().toString();
                const description = functionV0.doc().toString();

                const inputs: InputInfo[] = functionV0.inputs().map((input: xdr.ScSpecFunctionInputV0) => ({
                    name: input.name().toString(),
                }));

                name === funcTitle && functions.push({ description, name, inputs });
            }
        });
    }

    return Promise.resolve(functions);
}

async function getContractData(contractAddress: string) {
    const ledgerKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
            contract: new Address(contractAddress).toScAddress(),
            key: xdr.ScVal.scvLedgerKeyContractInstance(),
            durability: xdr.ContractDataDurability.persistent(),
        }),
    );
    let ledgerEntries;
    try {
        ledgerEntries = await sorobanServer.getLedgerEntries(ledgerKey);
    } catch (error) {
        console.error(error);
    }

    if (!ledgerEntries || !ledgerEntries.entries || !ledgerEntries.entries.length) {
        return null;
    }

    const ledgerEntry = ledgerEntries.entries[0] as SorobanRpc.Api.LedgerEntryResult;
    const codeData = ledgerEntry.val.contractData();
    const wasmIdLedger = ledgerEntry.lastModifiedLedgerSeq;
    const contractInstance = codeData.val().instance();
    const wasmId = contractInstance.executable().wasmHash();

    return { wasmId, wasmIdLedger };
}

async function getContractCode(wasmId: Buffer): Promise<{ wasmCode: string; wasmCodeLedger: number } | null> {
    const ledgerKey = xdr.LedgerKey.contractCode(
        new xdr.LedgerKeyContractCode({
            hash: wasmId,
        }),
    );

    const ledgerEntries = await sorobanServer.getLedgerEntries(ledgerKey);

    if (!ledgerEntries || !ledgerEntries.entries) {
        return null;
    }

    const ledgerEntry = ledgerEntries.entries[0] as SorobanRpc.Api.LedgerEntryResult;
    const wasmCodeLedger = ledgerEntry.lastModifiedLedgerSeq as number;
    const codeEntry = ledgerEntry.val;
    const wasmCode = codeEntry.contractCode().code().toString('hex');

    return { wasmCode, wasmCodeLedger };
}

function decodeContractSpecBuffer(buffer: ArrayBuffer) {
    const uint8 = new Uint8Array(buffer);
    const decodedEntries = [];

    let offset = 0;

    while (offset < uint8.length) {
        const { partialDecodedEntry, length } = tryDecodeEntry(uint8, offset);

        if (partialDecodedEntry) {
            decodedEntries.push(partialDecodedEntry);
            offset += length;
        } else {
            break;
        }
    }
    return decodedEntries;
}

export function hexToByte(hexString: string) {
    const hexCompleteLength = 2;
    const radix = 16;
    if (hexString.length % hexCompleteLength !== 0) {
        throw new Error('Must have an even number of hex digits to convert to bytes');
    }
    const numBytes = hexString.length / hexCompleteLength;
    const byteArray = Buffer.alloc(numBytes);
    for (let i = 0; i < numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i * hexCompleteLength, hexCompleteLength), radix);
    }
    return byteArray;
}

export function getAccountAddress(accountHash: string) {
    return StrKey.encodeEd25519PublicKey(hexToByte(accountHash));
}
