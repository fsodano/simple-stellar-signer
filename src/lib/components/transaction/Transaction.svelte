<script lang="ts">
    import { FeeBumpTransaction, Transaction, TransactionBuilder, xdr } from '@stellar/stellar-sdk';
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import { Link } from 'svelte-navigator';

    import type { WalletConnectService } from '../../../lib/service/walletConnect';
    import WalletConnect from '../../../lib/wallets/walletConnect/WalletConnect';
    import { language } from '../../../store/global';
    import type { ITransactionMessage } from '../../bridge/transactionMessage/ITransactionMessage';
    import { CURRENT_NETWORK_PASSPHRASE, CURRENT_STELLAR_NETWORK } from '../../stellar/StellarNetwork';
    import LocalStorage from '../../storage/storage';
    import type IWallet from '../../wallets/IWallet';
    import WalletFactory from '../../wallets/WalletFactory';
    import type { IOperationGroupComponent } from './IOperationGroupComponent';
    import Signatures from './Signatures.svelte';
    import InsufficientOperationsError from './errors/InsufficientOperationsError';
    import InvalidGroupsSortError from './errors/InvalidGroupsSortError';
    import { DynamicOperationComponentFactory } from './operations/DynamicOperationComponentFactory';
    import { InvokeHostFunctionComponentFactory } from './operations/InvokeHostFunctionOperationComponentFactory';
    import Operation from './operations/Operation.svelte';
    import type { OperationComponent } from './operations/OperationComponent';
    import OperationsGroup from './operations/OperationsGroup.svelte';
    import groupOperationComponents from './transactionGroupHelper';
    import { checkIfAllAreFalse, checkIfAllAreTrue, getShortedStellarKey } from './transactionHelper';
    import {
        areOperationsExpanded,
        isSourceAccountClicked,
        isUserPublicKeyClicked,
        operationsVisibility,
    } from './transactionStore';

    export let transactionMessage: ITransactionMessage;
    export let walletConnectService: WalletConnectService;

    const storage = new LocalStorage();
    const dispatch = createEventDispatcher();
    const storedWallet = storage.getItem('wallet');
    const walletFactory = new WalletFactory();

    let wallet: IWallet;
    let feeBumpTx: FeeBumpTransaction | undefined;
    let tx: Transaction;
    let network: string;
    let operationComponents: OperationComponent[] = [];
    let transactionGroups: (OperationComponent | IOperationGroupComponent)[] = [];
    let shortedSourceAccount: string;
    let isValidXdr = false;

    if (storedWallet) {
        if (storedWallet === WalletConnect.NAME) {
            wallet = walletFactory.createWalletConnect(walletConnectService);
        } else {
            wallet = walletFactory.create(storedWallet);
        }
    }

    function toggleOperationVisibility(i: number) {
        $operationsVisibility[i] = !$operationsVisibility[i];
        $isUserPublicKeyClicked = false;
    }

    function toggleOperationsVisibility() {
        $areOperationsExpanded = !$areOperationsExpanded;
        $operationsVisibility = $operationsVisibility.map(() => $areOperationsExpanded);
        $isUserPublicKeyClicked = false;
    }

    function toggleSourceAccount() {
        $isSourceAccountClicked = !$isSourceAccountClicked;
    }

    function convertStroopsToXLM(fee: string) {
        const stroopsDivider = 10000000;
        return Number(fee) / stroopsDivider;
    }

    $: if (checkIfAllAreFalse($operationsVisibility)) {
        $areOperationsExpanded = false;
    } else if (checkIfAllAreTrue($operationsVisibility)) {
        $areOperationsExpanded = true;
    }

    async function initializeTransactionData() {
        try {
            isValidXdr = xdr.TransactionEnvelope.validateXDR(transactionMessage.xdr, 'base64');
            const buildedTx = TransactionBuilder.fromXDR(transactionMessage.xdr, CURRENT_NETWORK_PASSPHRASE);

            if (buildedTx instanceof FeeBumpTransaction) {
                feeBumpTx = buildedTx;
                tx = buildedTx.innerTransaction;
            } else {
                tx = buildedTx;
            }

            network = CURRENT_STELLAR_NETWORK;

            shortedSourceAccount = getShortedStellarKey(tx.source);

            const invokeOperationIndex = tx.operations.findIndex(
                (operation) => operation.type === 'invokeHostFunction',
            );

            if (invokeOperationIndex >= 0 && tx.operations[invokeOperationIndex]) {
                const invokeHostFunctionComponentFactory = new InvokeHostFunctionComponentFactory();
                const invokeOperationComponent = await invokeHostFunctionComponentFactory.create(
                    tx,
                    tx.operations[invokeOperationIndex]!,
                );

                transactionGroups = [invokeOperationComponent];
            } else {
                const dynamicOperationComponentFactory = new DynamicOperationComponentFactory();

                operationComponents = tx.operations.map((operation) =>
                    dynamicOperationComponentFactory.create(tx, operation),
                );

                if (transactionMessage.operationGroups && transactionMessage.operationGroups.length > 0) {
                    transactionGroups = groupOperationComponents(
                        operationComponents,
                        transactionMessage.operationGroups,
                    );
                } else {
                    console.info("A transaction group object wasn't provided");
                    transactionGroups = operationComponents;
                }
            }
        } catch (e) {
            console.error(e);
            if (e instanceof InvalidGroupsSortError || InsufficientOperationsError) {
                transactionGroups = operationComponents;
            }
        }

        $operationsVisibility = transactionGroups.map(() => false);
    }

    onMount(async () => {
        await initializeTransactionData();
    });
</script>

{#if isValidXdr}
    <h1 class="simple-signer tx-title">{$language.SIGN}</h1>

    {#if feeBumpTx}
        <h2 class="simple-signer tx-title">{$language.FEE_BUMP}</h2>
    {/if}

    {#if transactionMessage.description}
        <div class="simple-signer tx-description-container">
            <p class="simple-signer tx-description-text">{transactionMessage.description}</p>
        </div>
    {/if}
    {#if wallet}
        <div class="simple-signer tx-data-container">
            {#if feeBumpTx}
                <div class="simple-signer fee-bump-tx-info-container">
                    <p>
                        {$language.FEE_BUMP_DESCRIPTION_1}
                        <span class="simple-signer bold-text">{$language.FEE.toUpperCase()}</span>
                        {$language.FEE_BUMP_DESCRIPTION_2}
                    </p>
                </div>

                <hr class="simple-signer separator" />
            {/if}

            <div class="simple-signer tx-network-container">
                <p>{$language.NETWORK}:</p>
                &nbsp;
                <p class="simple-signer tx-network-text">{network}</p>
            </div>
            <div class="simple-signer tx-sequence-number">
                <p class="sequence-number">{$language.SEQUENCE_NUMBER} {tx ? tx.sequence : ''}</p>
            </div>

            <div class="simple-signer tx-source-account">
                <p class="simple-signer source-account">
                    {$language.SOURCE_ACCOUNT}
                    <span class="simple-signer user-publickey" on:click={toggleSourceAccount}>
                        {$isSourceAccountClicked ? tx.source : shortedSourceAccount}
                    </span>
                </p>
            </div>
        </div>
        <Signatures signatures={tx.signatures} />
        <hr class="simple-signer tx-separator" />
        <div class="simple-signer operations-container">
            <div class="operation-list-title-container">
                <h1 class="simple-signer tx-operation-list-title">{$language.OPERATIONS_LIST}</h1>
                <button class="simple-signer expand-all-button" on:click={toggleOperationsVisibility}
                    ><span>{$areOperationsExpanded ? $language.HIDE_ALL : $language.EXPAND_ALL}</span>
                </button>
            </div>
            <div class="simple-signer operation-list-container">
                {#each transactionGroups as group, i}
                    <div class="simple-signer operation-head">
                        <h3 class="simple-signer operation-title-head">
                            {i + 1}. {'title' in group ? group.title : $language[group.props.title]}
                        </h3>
                        <button
                            class="arrow-button"
                            on:click={() => {
                                toggleOperationVisibility(i);
                            }}><i class="arrow {$operationsVisibility[i] ? 'spin-up' : ''}" /></button
                        >
                    </div>
                    <div
                        class="simple-signer operation-border {$operationsVisibility[i] ? 'operation-show-margin' : ''}"
                    >
                        <div
                            class="simple-signer tx-operation-container {$operationsVisibility[i]
                                ? 'show-operation'
                                : ''} "
                        >
                            {#if 'description' in group}
                                <OperationsGroup
                                    shortedSourceAccount={shortedSourceAccount}
                                    description={group.description}
                                    operationComponents={group.operationComponents}
                                />
                            {:else}
                                <Operation
                                    operationItems={group.props.operationItems}
                                    shortedSourceAccount={shortedSourceAccount}
                                />
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <hr class="simple-signer tx-separator" />
        <div class="simple-signer bottom-info-container">
            <div class="simple-signer tx-fee-container">
                <p class="simple-signer operation-info-title bottom-info-title">{$language.NETWORK_FEE}</p>
                &nbsp;
                <p class="simple-signer bottom-info-paragraph">
                    {convertStroopsToXLM(feeBumpTx ? feeBumpTx.fee : tx.fee)} XLM
                </p>
            </div>
            {#if tx.memo.value}
                <div class="simple-signer memo-container">
                    <p class="simple-signer operation-info-title bottom-info-title">Memo:</p>
                    &nbsp;
                    <p class="simple-signer bottom-info-paragraph">{tx.memo.value}</p>
                </div>
            {/if}
        </div>
        <div class="simple-signer confirmation-buttons">
            <button class="simple-signer cancel-button" on:click={() => dispatch('cancel')}>{$language.CANCEL}</button>
            <button
                class="simple-signer sign-tx-button"
                on:click={async () => dispatch('confirm', await wallet.sign(feeBumpTx || tx))}
                >{$language.CONFIRM}</button
            >
        </div>
    {:else}
        <p class="simple-signer user-not-connected">{$language.USER_IS_NOT_CONNECTED}</p>
        <button class="simple-signer connect-btn">
            <Link to="/connect">{$language.GO_TO_CONNECT}</Link>
        </button>
    {/if}
{:else}
    <h1 class="simple-signer error-title">{$language.ERROR}</h1>
    <div class="simple-signer information-container">
        <p class="simple-signer xdr-invalid">{$language.XDR_INVALID}</p>
        <div class="simple-signer close-button">
            <button class="simple-signer sign-tx-button" on:click={() => dispatch('cancel')}>{$language.CLOSE}</button>
        </div>
    </div>
{/if}

<style>
    .bold-text {
        font-weight: 500;
    }

    .fee-bump-tx-info-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .separator {
        border: 1px solid #e5e5e5;
        width: 100%;
        margin: 20px 0 20px 0;
    }

    .user-publickey {
        color: #2f69b7;
        word-wrap: break-word;
    }
    .xdr-invalid {
        margin-top: 15px;
        margin-bottom: 50px;
    }
    .information-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .error-title {
        font-size: 16px;
        text-transform: uppercase;
    }
    p {
        margin: 0;
    }

    .operation-border {
        transition: all 0.2s linear;
        border-left: 2px solid #e5e5e5;
        margin-top: 20px;
    }

    .operation-border:last-child {
        margin-top: 27px;
    }

    .operation-show-margin.operation-border {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .tx-operation-container {
        overflow-y: scroll;
        position: relative;
        font-size: 14px;
        max-height: 0px;
        transition: all 0.6s ease;
        margin-left: -1px;
    }

    .tx-operation-container {
        direction: rtl;
    }

    .tx-operation-container::-webkit-scrollbar {
        width: 5px;
    }

    .tx-operation-container::-webkit-scrollbar-track {
        background: none;
    }

    .tx-operation-container::-webkit-scrollbar-thumb {
        background: #bfbfbf;
    }

    .tx-operation-container:hover::-webkit-scrollbar-thumb {
        background: #888888;
    }

    .tx-operation-container.show-operation {
        max-height: 380px;
    }

    .arrow {
        border: solid #757575;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        transition: transform 0.3s;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
    }

    .expand-all-button {
        font-family: 'Roboto', sans-serif;
        border: none;
        background: none;
        cursor: pointer;
        color: #2f69b7;
        text-align: left;
        min-width: fit-content;
        font-size: 12px;
    }

    .expand-all-button span {
        margin-right: 10px;
    }

    .spin-up {
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
    }

    .operation-head {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }

    .operation-head button {
        border: none;
        margin-top: -2px;
        padding: 0;
        background-color: transparent;
    }

    .operation-head button:hover {
        cursor: pointer;
    }

    .operation-list-title-container {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .tx-separator {
        border: 1px solid #e5e5e5;
        width: 100%;
        margin: 0;
    }

    :global(.tx-description-container) {
        width: 100%;
        background: #f5f5f5 0% 0% no-repeat padding-box;
        opacity: 1;
        margin-top: 23px;
    }

    .operation-title-head {
        margin: 0;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .tx-network-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
    }

    .tx-network-text {
        color: #2f69b7;
    }

    .tx-data-container {
        text-align: left;
        letter-spacing: 0.14px;
        color: #757575;
        opacity: 1;
        margin-top: 20px;
        margin-bottom: 27px;
        font-size: 14px;
    }

    .tx-sequence-number {
        margin-bottom: 8px;
    }

    .tx-source-account {
        margin-bottom: 20px;
    }

    :global(.tx-description-text) {
        padding: 10px;
        font-weight: 500;
        margin: 0;
    }

    .tx-title {
        font-size: 16px;
        text-transform: uppercase;
        margin: 0;
    }

    .tx-operation-list-title {
        margin-top: 33px;
        margin-bottom: 23px;
        font-size: 14px;
        text-transform: uppercase;
        width: 100%;
    }

    .operation-list-container {
        position: relative;
    }

    .operations-container {
        width: 100%;
    }

    .close-button,
    .confirmation-buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .close-button button,
    .confirmation-buttons button {
        width: 140px;
        height: 39px;
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0px 4px 2px #00000029;
        opacity: 1;
        border: none;
        margin-bottom: 30px;
    }

    .cancel-button {
        background: #f5f5f5 0% 0% no-repeat padding-box;
    }

    .sign-tx-button {
        color: #f5f5f5;
        background: #2f69b7 0% 0% no-repeat padding-box;
    }

    .cancel-button:hover,
    .sign-tx-button:hover {
        opacity: 50%;
        cursor: pointer;
    }

    .tx-fee-container,
    .simple-signer.memo-container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .tx-fee-container {
        margin-bottom: 15px;
    }

    .simple-signer.bottom-info-container {
        margin-top: 32px;
        margin-bottom: 32px;
    }

    .simple-signer.bottom-info-title {
        font-size: 14px;
        font-weight: 600;
    }

    .simple-signer.bottom-info-paragraph {
        font-weight: 400;
    }
</style>
