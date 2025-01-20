<script lang="ts">
    import { StrKey, xdr } from '@stellar/stellar-sdk';

    import { language } from '../../../store/global';

    export let signatures: xdr.DecoratedSignature[];
</script>

{#if signatures.length > 0}
    <div class="simple-signer tx-signatures-container">
        <p>{$language.SIGNATURES}</p>
        <div class="simple-signer tx-signatures">
            {#each signatures as signature, i}
                <ul class="simple-signer tx-signature">
                    <p>{i + 1} - {$language.SIGNATURE}</p>
                    <li>
                        <p>{$language.HINT} {StrKey.encodeEd25519PublicKey(signature.hint())}</p>
                    </li>
                    <li>
                        <p>{StrKey.encodeSha256Hash(signature.signature())}</p>
                    </li>
                </ul>
            {/each}
        </div>
    </div>
{/if}

<style>
    .tx-signature {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        word-wrap: break-word;
    }

    p {
        margin: 5px;
    }
</style>
