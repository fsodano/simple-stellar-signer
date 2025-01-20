import type { Operation, Transaction } from '@stellar/stellar-sdk';

import InvalidComponentTypeError from '../errors/InvalidComponentTypeError';
import type { OperationComponent } from './OperationComponent';
import AccountMergeComponent from './accountMerge/AccountMergeComponent';
import AllowTrustComponent from './allowTrust/AllowTrustComponent';
import BeginSponsoringFutureReservesComponent from './beginSponsoringFutureReserves/BeginSponsoringFutureReservesComponent';
import BumpSequenceComponent from './bumpSequence/BumpSequenceComponent';
import ChangeTrustComponent from './changeTrust/ChangeTrustComponent';
import ClaimClaimableBalanceComponent from './claimClaimableBalance/ClaimClaimableBalanceComponent';
import ClawbackComponent from './clawback/ClawbackComponent';
import ClawbackClaimableBalanceComponent from './clawbackClaimableBalance/ClawbackClaimableBalanceComponent';
import CreateAccountComponent from './createAccount/CreateAccountComponent';
import CreateClaimableBalanceComponent from './createClaimableBalance/CreateClaimableBalanceComponent';
import CreatePassiveSellOfferComponent from './createPassiveSellOffer/CreatePassiveSellOfferComponent';
import EndSponsoringFutureReservesComponent from './endSponsoringFutureReserves/EndSponsoringFutureReservesComponent';
import ExtendFootprintComponent from './extendFootprint/ExtendFootprintComponent';
import LiquidityPoolDepositComponent from './liquidityPoolDeposit/LiquidityPoolDepositComponent';
import LiquidityPoolWithdrawComponent from './liquidityPoolWithdraw/LiquidityPoolWithdrawComponent';
import ManageBuyOfferComponent from './manageBuyOffer/ManageBuyOfferComponent';
import ManageDataComponent from './manageData/ManageDataComponent';
import ManageSellOfferComponent from './manageSellOffer/ManageSellOfferComponent';
import PathPaymentStrictReceiveComponent from './pathPaymentStrictReceive/PathPaymentStrictReceiveComponent';
import PathPaymentStrictSendComponent from './pathPaymentStrictSend/PathPaymentStrictSendComponent';
import PaymentComponent from './payment/PaymentComponent';
import RestoreFootprintComponent from './restoreFootprint/RestoreFootprintComponent';
import RevokeAccountSponsorshipComponent from './revokeAccountSponsorship/RevokeAccountSponsorshipComponent';
import RevokeClaimableBalanceSponsorshipComponent from './revokeClaimableBalanceSponsorship/RevokeClaimableBalanceSponsorshipComponent';
import RevokeDataSponsorshipComponent from './revokeDataSponsorship/RevokeDataSponsorshipComponent';
import RevokeLiquidityPoolSponsorshipComponent from './revokeLiquidityPoolSponsorship/RevokeLiquidityPoolSponsorshipComponent';
import RevokeOfferSponsorshipComponent from './revokeOfferSponsorship/RevokeOfferSponsorshipComponent';
import RevokeSignerSponsorshipComponent from './revokeSignerSponsorship/RevokeSignerSponsorshipComponent';
import RevokeTrustlineSponsorshipComponent from './revokeTrustLineSponsorship/RevokeTrustLineSponsorshipComponent';
import SetOptionsComponent from './setOptions/SetOptionsComponent';
import SetTrustLineFlagsComponent from './setTrustLineFlags/SetTrustLineFlagsComponent';

export class DynamicOperationComponentFactory {
    create(tx: Transaction, operation: Operation): OperationComponent {
        let operationComponent;

        switch (operation.type) {
            case 'payment':
                operationComponent = new PaymentComponent(tx, operation);
                break;
            case 'createAccount':
                operationComponent = new CreateAccountComponent(tx, operation);
                break;
            case 'beginSponsoringFutureReserves':
                operationComponent = new BeginSponsoringFutureReservesComponent(tx, operation);
                break;
            case 'pathPaymentStrictSend':
                operationComponent = new PathPaymentStrictSendComponent(tx, operation);
                break;
            case 'pathPaymentStrictReceive':
                operationComponent = new PathPaymentStrictReceiveComponent(tx, operation);
                break;
            case 'manageBuyOffer':
                operationComponent = new ManageBuyOfferComponent(tx, operation);
                break;
            case 'manageSellOffer':
                operationComponent = new ManageSellOfferComponent(tx, operation);
                break;
            case 'createPassiveSellOffer':
                operationComponent = new CreatePassiveSellOfferComponent(tx, operation);
                break;
            case 'setOptions':
                operationComponent = new SetOptionsComponent(tx, operation);
                break;
            case 'changeTrust':
                operationComponent = new ChangeTrustComponent(tx, operation);
                break;
            case 'accountMerge':
                operationComponent = new AccountMergeComponent(tx, operation);
                break;
            case 'manageData':
                operationComponent = new ManageDataComponent(tx, operation);
                break;
            case 'bumpSequence':
                operationComponent = new BumpSequenceComponent(tx, operation);
                break;
            case 'createClaimableBalance':
                operationComponent = new CreateClaimableBalanceComponent(tx, operation);
                break;
            case 'endSponsoringFutureReserves':
                operationComponent = new EndSponsoringFutureReservesComponent(tx, operation);
                break;
            case 'revokeAccountSponsorship' as 'revokeSponsorship':
                operationComponent = new RevokeAccountSponsorshipComponent(
                    tx,
                    operation as Operation.RevokeAccountSponsorship,
                );
                break;
            case 'revokeClaimableBalanceSponsorship' as 'revokeSponsorship':
                operationComponent = new RevokeClaimableBalanceSponsorshipComponent(
                    tx,
                    operation as Operation.RevokeClaimableBalanceSponsorship,
                );
                break;
            case 'revokeDataSponsorship' as 'revokeSponsorship':
                operationComponent = new RevokeDataSponsorshipComponent(
                    tx,
                    operation as Operation.RevokeDataSponsorship,
                );
                break;
            case 'revokeLiquidityPoolSponsorship' as 'revokeSponsorship':
                operationComponent = new RevokeLiquidityPoolSponsorshipComponent(
                    tx,
                    operation as Operation.RevokeLiquidityPoolSponsorship,
                );
                break;
            case 'revokeOfferSponsorship' as 'revokeSponsorship':
                operationComponent = new RevokeOfferSponsorshipComponent(
                    tx,
                    operation as Operation.RevokeOfferSponsorship,
                );
                break;

            case 'revokeSignerSponsorship' as 'revokeSponsorship':
                operationComponent = new RevokeSignerSponsorshipComponent(
                    tx,
                    operation as Operation.RevokeSignerSponsorship,
                );
                break;

            case 'allowTrust':
                operationComponent = new AllowTrustComponent(tx, operation);
                break;

            case 'claimClaimableBalance':
                operationComponent = new ClaimClaimableBalanceComponent(tx, operation);
                break;
            case 'clawback':
                operationComponent = new ClawbackComponent(tx, operation);
                break;

            case 'setTrustLineFlags':
                operationComponent = new SetTrustLineFlagsComponent(tx, operation);
                break;

            case 'liquidityPoolDeposit':
                operationComponent = new LiquidityPoolDepositComponent(tx, operation);
                break;

            case 'liquidityPoolWithdraw':
                operationComponent = new LiquidityPoolWithdrawComponent(tx, operation);
                break;
            case 'revokeTrustlineSponsorship' as 'revokeSponsorship':
                operationComponent = new RevokeTrustlineSponsorshipComponent(
                    tx,
                    operation as Operation.RevokeTrustlineSponsorship,
                );
                break;
            case 'clawbackClaimableBalance':
                operationComponent = new ClawbackClaimableBalanceComponent(tx, operation);
                break;
            case 'restoreFootprint':
                operationComponent = new RestoreFootprintComponent(tx, operation);
                break;
            case 'extendFootprintTtl':
                operationComponent = new ExtendFootprintComponent(tx, operation);
                break;
            default:
                undefined;
                break;
        }

        if (operationComponent) {
            return operationComponent;
        } else {
            throw new InvalidComponentTypeError();
        }
    }
}
