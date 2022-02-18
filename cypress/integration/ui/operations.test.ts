/// <reference types="cypress" />
/// <reference types="@testing-library/cypress"/>
import {
    operationsXdr,
    paymentXdr,
    createAccountXdr,
    beginSponsoringFutureReservesXdr,
    pathPaymentStrictSendXdr,
    pathPaymentStrictReceiveXdr,
    manageBuyOfferXdr,
    manageSellOfferXdr,
    createPassiveSellOfferXdr,
    setOptionsXdr,
    changeTrustLiquidityPoolAssetXdr,
    changeTrustXdr,
    accountMergeXdr,
    manageDataXdr,
    bumpSequenceXdr,
    createClaimableBalanceXdr,
    endSponsoringFutureReservesXdr,
    revokeAccountSponsorshipXdr,
    revokeClaimableBalanceSponsorshipXdr,
    revokeDataSponsorshipXdr,
    revokeLiquidityPoolSponsorshipXdr,
    revokeOfferSponsorshipXdr,
    claimClaimableBalanceXdr,
    clawbackXdr,
} from '../../fixtures/operations.json';

describe('operations', () => {
    const url = Cypress.env('HOST');
    const BASE_URL = `${url}/sign?xdr=`;
    const TEST_PRIVATE_KEY = Cypress.env('TEST_PRIVATE_KEY');

    it('should connect with private key', () => {
        cy.visit(`${url}/connect`);
        cy.get('#input-key').type(TEST_PRIVATE_KEY);
        cy.get('.private-key-btn').click();
    });

    it('should render two components if the xdr has two operations, ', () => {
        cy.visit(BASE_URL + operationsXdr);
        cy.get('.operations-container').children().should('have.length', 2);
        cy.get('.payment-operation').should('exist');
        cy.get('.create-account-operation').should('exist');
    });

    it('should render a Payment component if the xdr has a Payment operation', () => {
        cy.visit(BASE_URL + paymentXdr);
        cy.get('.payment-operation').contains('Amount');
        cy.get('.payment-operation').contains('Destination');
        cy.get('.payment-operation').contains('Asset');
    });

    it('should render a CreateAccount component if the xdr has a Create Account operation', () => {
        cy.visit(BASE_URL + createAccountXdr);
        cy.get('.create-account-operation').contains('Source Account');
        cy.get('.create-account-operation').contains('Starting Balance');
        cy.get('.create-account-operation').contains('Destination');
    });

    it('should render begin sponsoring future reserves operation', () => {
        cy.visit(`${BASE_URL}${beginSponsoringFutureReservesXdr}`);
        cy.get('.begin-sponsoring-future-reserves-operation').contains('Sponsored ID');
        cy.get('.begin-sponsoring-future-reserves-operation').contains(
            'GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
    });
    it('should render path payment strict send operation', () => {
        cy.visit(`${BASE_URL}${pathPaymentStrictSendXdr}`);
        cy.get('.path-payment-strict-send-operation').contains('Asset you are using to pay: XLM');
        cy.get('.path-payment-strict-send-operation').contains('Amount: 2.0000000');
        cy.get('.path-payment-strict-send-operation').contains(
            'Destination: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
        cy.get('.path-payment-strict-send-operation').contains(
            'Minimum amount of destination asset to be received: 2.0000000',
        );
        cy.get('.path-payment-strict-send-operation').contains(
            'Source Account: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
    });

    it('should render path payment strict receive operation', () => {
        cy.visit(`${BASE_URL}${pathPaymentStrictReceiveXdr}`);
        cy.get('.path-payment-strict-receive-operation').contains('Asset you are using to pay: XLM');
        cy.get('.path-payment-strict-receive-operation').contains('Max amount: 3.0000000');
        cy.get('.path-payment-strict-receive-operation').contains(
            'Destination: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
        cy.get('.path-payment-strict-receive-operation').contains('Path: XLM');
        cy.get('.path-payment-strict-receive-operation').contains('Destination asset: XLM');
        cy.get('.path-payment-strict-receive-operation').contains('Amount: 2.0000000');
    });

    it('should render manage buy offer operation', () => {
        cy.visit(`${BASE_URL}${manageBuyOfferXdr}`);
        cy.get('.manage-buy-offer-operation').contains(
            'Source Account: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
        cy.get('.manage-buy-offer-operation').contains('Selling asset: XLM');
        cy.get('.manage-buy-offer-operation').contains('Buying asset: XLM');
        cy.get('.manage-buy-offer-operation').contains('Buy amount: 2.0000000');
        cy.get('.manage-buy-offer-operation').contains('Price: 1');
        cy.get('.manage-buy-offer-operation').contains('Offer ID: 0');
    });

    it('should render manage sell offer operation', () => {
        cy.visit(`${BASE_URL}${manageSellOfferXdr}`);
        cy.get('.manage-sell-offer-operation').contains(
            'Source Account: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
        cy.get('.manage-sell-offer-operation').contains('Selling asset: XLM');
        cy.get('.manage-sell-offer-operation').contains('Buying asset: XLM');
        cy.get('.manage-sell-offer-operation').contains('Amount: 2.0000000');
        cy.get('.manage-sell-offer-operation').contains('Price: 1');
        cy.get('.manage-sell-offer-operation').contains('Offer ID: 0');
    });

    it('should render create passive sell offer operation', () => {
        cy.visit(`${BASE_URL}${createPassiveSellOfferXdr}`);
        cy.get('.create-passive-sell-offer-operation').contains(
            'Source Account: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
        cy.get('.create-passive-sell-offer-operation').contains('Selling: XLM');
        cy.get('.create-passive-sell-offer-operation').contains('Buying: XLM');
        cy.get('.create-passive-sell-offer-operation').contains('Amount: 2.0000000');
        cy.get('.create-passive-sell-offer-operation').contains('Price: 1');
    });

    it('should render set options operation', () => {
        cy.visit(`${BASE_URL}${setOptionsXdr}`);
        cy.get('.set-options-operation').contains(
            'Source Account: GC3BZC6JUSOR76BHQJFO4CF7L4MCIB4GLBV7ECBXKK5BT3WLZ6ZP6EKQ',
        );
        cy.get('.set-options-operation').contains('Set Flags: 11');
        cy.get('.set-options-operation').contains('Master Weight: 1');
        cy.get('.set-options-operation').contains('Low Threshold: 1');
        cy.get('.set-options-operation').contains('Medium Threshold: 2');
        cy.get('.set-options-operation').contains('High Threshold: 3');
        cy.get('.set-options-operation').contains(
            'Destination inflation: GC3BZC6JUSOR76BHQJFO4CF7L4MCIB4GLBV7ECBXKK5BT3WLZ6ZP6EKQ',
        );
        cy.get('.set-options-operation').contains('Clear Flags: 8');
        cy.get('.set-options-operation').contains('Home Domain: simplesigner.com');
        cy.get('.set-options-operation').contains(
            'preAuthTx: XDSGQU6Q7M5DES2ZPCMQJI2FK6TLUJ4J2ALMR3XT63QBWPJFYCNW5T54',
        );
        cy.get('.set-options-operation').contains('Weight: 1');
        cy.get('.set-options-operation').should('not.contain', 'undefined');
    });

    it('should render change trust (normal asset) operation', () => {
        cy.visit(`${BASE_URL}${changeTrustXdr}`);
        cy.get('.change-trust-operation').contains('Asset: AUD');
        cy.get('.change-trust-operation').contains(
            'Source Account: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
        cy.get('.change-trust-operation').contains('Limit: 922337203685.4775807');
    });

    it('should render change trust (liquidity pool asset) operation', () => {
        cy.visit(`${BASE_URL}${changeTrustLiquidityPoolAssetXdr}`);
        cy.get('.change-trust-operation').contains(
            'Source Account: GDWTWTWO7WJF57UUXI42R4CJXT6MAKZ4K2THPJAW4EFKD5ATPNEQJ5W3',
        );
        cy.get('.change-trust-operation').contains('Asset A: XLM');
        cy.get('.change-trust-operation').contains('Asset B: AUD');
        cy.get('.change-trust-operation').contains('Limit: 922337203685.4775807');
    });

    it('should render account merge operation', () => {
        cy.visit(`${BASE_URL}${accountMergeXdr}`);
        cy.get('.account-merge-operation').contains(
            'Source Account: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
        cy.get('.account-merge-operation').contains(
            'Destination: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
    });

    it('should render manage data operation', () => {
        cy.visit(`${BASE_URL}${manageDataXdr}`);
        cy.get('.manage-data-operation').contains(
            'Source Account: GBLYCS5FDM2EGDVPTECHXEBLIVQPLPIJI5U2BEGQVZIIXCVIHM6RV26T',
        );
        cy.get('.manage-data-operation').contains('Name: asd');
        cy.get('.manage-data-operation').contains('Data: qwe');
    });

    it('should render bump sequence operation', () => {
        cy.visit(`${BASE_URL}${bumpSequenceXdr}`);
        cy.get('.bump-sequence-operation').contains(
            'Source Account: GCI5KGGNY4GKZOWEHTSFTJSBMRLQLJCCNV56TXKLMXZAOKZF3YZ2M7JI',
        );
        cy.get('.bump-sequence-operation').contains('Bump to: 51235678');
    });
    it('should render create claimable balance operation', () => {
        cy.visit(`${BASE_URL}${createClaimableBalanceXdr}`);
        cy.get('.create-claimable-balance-operation').contains(
            'Source Account: GCI5KGGNY4GKZOWEHTSFTJSBMRLQLJCCNV56TXKLMXZAOKZF3YZ2M',
        );
        cy.get('.create-claimable-balance-operation').contains('Asset: XLM');
        cy.get('.create-claimable-balance-operation').contains('Amount: 234656.0000000');
        cy.get('.create-claimable-balance-operation').contains('Claimants:');
        cy.get('.create-claimable-balance-operation').contains(
            'GCI5KGGNY4GKZOWEHTSFTJSBMRLQLJCCNV56TXKLMXZAOKZF3YZ2M7JI',
        );
    });

    it('should render end sponsoring future reserves operation', () => {
        cy.visit(`${BASE_URL}${endSponsoringFutureReservesXdr}`);
        cy.get('.end-sponsoring-future-reserves-operation').contains('Operation: Create Passive Sell Offer');
        cy.get('.end-sponsoring-future-reserves-operation').contains(
            'Source Account: GCI5KGGNY4GKZOWEHTSFTJSBMRLQLJCCNV56TXKLMXZAOKZF3YZ2M7JI',
        );
    });

    it('should render revoke account sponsorship operation', () => {
        cy.visit(`${BASE_URL}${revokeAccountSponsorshipXdr}`);
        cy.get('.revoke-account-sponsorship-operation').contains('Operation: Revoke Account Sponsorship');
        cy.get('.revoke-account-sponsorship-operation').contains(
            'Source Account: GCI5KGGNY4GKZOWEHTSFTJSBMRLQLJCCNV56TXKLMXZAOKZF3YZ2M7JI',
        );
        cy.get('.revoke-account-sponsorship-operation').contains(
            'Account: GCI5KGGNY4GKZOWEHTSFTJSBMRLQLJCCNV56TXKLMXZAOKZF3YZ2M7JI',
        );
    });

    it('should render revoke claimable balance sponsorship operation', () => {
        cy.visit(`${BASE_URL}${revokeClaimableBalanceSponsorshipXdr}`);
        cy.get('.revoke-claimable-balance-sponsorship-operation').contains(
            'Source Account: GCI5KGGNY4GKZOWEHTSFTJSBMRLQLJCCNV56TXKLMXZAOKZF3YZ2M7JI',
        );
        cy.get('.revoke-claimable-balance-sponsorship-operation').contains(
            'Balance ID: 00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
        );
    });

    it('should render revoke data sponsorship operation', () => {
        cy.visit(`${BASE_URL}${revokeDataSponsorshipXdr}`);
        cy.get('.revoke-data-sponsorship-operation').contains(
            'Source Account: GBGQAJHRMZ4X47KKNBEORZHK4QWBGNU2BUDKYLLWXTDZS46ZUHVO77UF',
        );
        cy.get('.revoke-data-sponsorship-operation').contains(
            'Account: GBGQAJHRMZ4X47KKNBEORZHK4QWBGNU2BUDKYLLWXTDZS46ZUHVO77UF',
        );
        cy.get('.revoke-data-sponsorship-operation').contains('Name: asd');
    });
    it('should render revoke liquidity pool sponsorship operation', () => {
        cy.visit(`${BASE_URL}${revokeLiquidityPoolSponsorshipXdr}`);
        cy.get('.revoke-liquidity-pool-sponsorship-operation').contains(
            'Source Account: GACXTDPQUGJFX7NS4TREHBL2VOGPUFCF4ZWQYKTWOHR4XGMBATZ6SRO5',
        );
        cy.get('.revoke-liquidity-pool-sponsorship-operation').contains(
            'Liquidity Pool ID: dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7',
        );
    });

    it('should render revoke offer sponsorship operation', () => {
        cy.visit(`${BASE_URL}${revokeOfferSponsorshipXdr}`);
        cy.get('.revoke-offer-sponsorship-operation').contains(
            'Source Account: GCFND4NPUKO27EBXB4IWM7AEMVH7P6HGRFGDPZVBNS7ZSDQ3EOK3MRTB',
        );
        cy.get('.revoke-offer-sponsorship-operation').contains(
            'Seller: GCFND4NPUKO27EBXB4IWM7AEMVH7P6HGRFGDPZVBNS7ZSDQ3EOK3MRTB',
        );
        cy.get('.revoke-offer-sponsorship-operation').contains('Offer ID: 1234');
    });

    it('should render claim claimable balance operation', () => {
        cy.visit(`${BASE_URL}${claimClaimableBalanceXdr}`);
        cy.get('.claim-claimable-balance-operation').contains(
            'Source Account: GBKBWABVN5HGKCGIFJSWGOELGPPMYAWO27RFEVFGJG26NAEVHRSRLKN3',
        );
        cy.get('.claim-claimable-balance-operation').contains(
            'Balance ID: 00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
        );
    });

    it('should render clawback operation', () => {
        cy.visit(`${BASE_URL}${clawbackXdr}`);
        cy.get('.clawback-operation').contains(
            'Source account: GBKBWABVN5HGKCGIFJSWGOELGPPMYAWO27RFEVFGJG26NAEVHRSRLKN3',
        );
        cy.get('.clawback-operation').contains('Asset: AUD');
        cy.get('.clawback-operation').contains('Amount: 2.0000000');
        cy.get('.clawback-operation').contains('From: GBKBWABVN5HGKCGIFJSWGOELGPPMYAWO27RFEVFGJG26NAEVHRSRLKN3');
    });
});
