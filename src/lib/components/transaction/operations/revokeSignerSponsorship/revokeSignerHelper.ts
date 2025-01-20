import { SignerKeyOptions, StrKey } from '@stellar/stellar-sdk';

import InvalidSignerTypeError from '../../errors/InvalidSignerTypeError';

export function getSignerType(signer: SignerKeyOptions): string {
    if ('ed25519PublicKey' in signer) {
        return signer.ed25519PublicKey;
    } else if ('sha256Hash' in signer) {
        if (typeof signer.sha256Hash === 'string') {
            return signer.sha256Hash;
        } else {
            return StrKey.encodeSha256Hash(signer.sha256Hash);
        }
    } else if ('preAuthTx' in signer) {
        if (typeof signer.preAuthTx === 'string') {
            return signer.preAuthTx;
        } else {
            return StrKey.encodePreAuthTx(signer.preAuthTx);
        }
    } else {
        throw new InvalidSignerTypeError();
    }
}
