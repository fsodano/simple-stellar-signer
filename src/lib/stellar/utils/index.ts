import { Horizon } from '@stellar/stellar-sdk';

import { HORIZON_URL } from '../../../constants';

export const server = new Horizon.Server(HORIZON_URL);
