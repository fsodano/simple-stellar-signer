import { Operation, StrKey } from '@stellar/stellar-sdk';

export default function getValue(operation: Operation.SetOptions) {
    if (operation.signer) {
        if ('ed25519PublicKey' in operation.signer) {
            return [operation.signer.ed25519PublicKey, operation.signer.weight ? '1' : '0'];
        } else if ('sha256Hash' in operation.signer) {
            return [
                `sha256Hash: ${StrKey.encodeSha256Hash(operation.signer.sha256Hash)}`,
                operation.signer.weight ? '1' : '0',
            ];
        } else if ('preAuthTx' in operation.signer) {
            return [
                `preAuthTx: ${StrKey.encodePreAuthTx(operation.signer.preAuthTx)}`,
                operation.signer.weight ? '1' : '0',
            ];
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}
