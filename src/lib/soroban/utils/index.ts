import { rpc as SorobanRpc } from '@stellar/stellar-sdk';

import { SOROBANRPC_URL } from '../../../constants';

export const sorobanServer = new SorobanRpc.Server(SOROBANRPC_URL);
