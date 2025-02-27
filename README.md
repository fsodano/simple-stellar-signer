# Simple Signer

Simple Signer provides an easy and secure way to implement log in and transaction signing functionality on your website
for the [Stellar network](https://stellar.org).

It can be embedded on any website and supports multiple wallets and languages.

## Supported Wallets

<table>
    <thead>
        <tr>
            <th>Wallet</th>
            <th>Link</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
    <tr>
        <td>xBull</td>
        <td><a href="https://xbull.app">xbull.app</a></td>
        <td>Implemented</td>
    </tr>
    <tr>
        <td>Albedo</td>
        <td><a href="https://albedo.link/">albedo.link</a></td>
        <td>Implemented</td>
    </tr>
    <tr>
        <td>Freighter</td>
        <td><a href="https://www.freighter.app/">freighter.app</a></td>
        <td>Implemented</td>
    </tr>
    <tr>
        <td>Rabet</td>
        <td><a href="https://rabet.io/">rabet.io</a></td>
        <td>Implemented</td>
    </tr>
    <tr>
        <td>WalletConnect</td>
        <td><a href="https://walletconnect.com/">walletconnect.com</a></td>
        <td>Implemented</td>
    </tr>
    <tr>
        <td>Lobstr</td>
        <td><a href="https://lobstr.co/">lobstr.co</a></td>
        <td>Implemented</td>
    </tr>
    <tr>
        <td>Ledger</td>
        <td><a href="https://ledger.com">ledger.com</a></td>
        <td>In progress</td>
    </tr>
    </tbody>
</table>

## Supported Networks

<table>
    <thead>
        <tr>
            <th>Network</th>
            <th>Link</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
    <tr>
        <td>Public</td>
        <td><a href="https://sign.bigger.systems">sign.bigger.systems</a></td>
        <td>Implemented</td>
    </tr>
    <tr>
        <td>Testnet</td>
        <td><a href="https://sign-testnet.bigger.systems">sign-testnet.bigger.systems</a></td>
        <td>Implemented</td>
    </tr>
    <tr>
        <td>Futurenet</td>
        <td><a href="https://sign-futurenet.bigger.systems">sign-futurenet.bigger.systems</a></td>
        <td>Implemented</td>
    </tr>
    </tbody>
</table>

## Supported Languages

See the [documentation on languages](https://github.com/PlutoDAO/simple-stellar-signer/blob/main/docs/languages.md) if
you want to contribute.

<table>
    <thead>
        <tr>
            <th>Language</th>
            <th>Link</th>
        </tr>
    </thead>
    <tbody>
    <tr>
        <td>English</td>
        <td><a href="https://github.com/PlutoDAO/simple-stellar-signer/blob/main/src/lib/i18n/languages/english.json">Link to the English definition file</a></td>
    </tr>
    <tr>
        <td>Spanish</td>
        <td><a href="https://github.com/PlutoDAO/simple-stellar-signer/blob/main/src/lib/i18n/languages/spanish.json">Link to the Spanish definition file</a></td>
    </tr>
    </tbody>
</table>

---

# How to implement Simple Signer on your website

Simple Signer provides three endpoints, `/connect`, `/sign` and `/payment` which allow some customisations to be made.

To see an example of all the implementation properties please take a look at the [test.html](./test.html) file provided
in this repo.

This section will guide you through the basic use cases, but a more comprehensive [API](#api) section is also available.

## Connecting to a wallet to obtain the user's public key

When you open the `/connect`, Simple Signer will prompt the user to log in. Once the user is logged in, Simple Signer
will
send a message to your website with the Public Key of the logged in account and the wallet used.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Simple Signer - Connect Wallet Demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
            src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/10.1.0/stellar-sdk.min.js"
            integrity="sha512-EqNQsxKR6rZ5xKl29xXa+ez7xgtVSUpj9UDzZmTqoyF0wHbusLkrP8S7dOsKa9DmkoHbssoWUA4+n/0KYY1EAQ=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
        ></script>
    </head>
    <body>
        <button onclick="openConnectWindow()">Connect</button>
        <script>
            const simpleSignerUrl = 'https://sign.bigger.systems';

            function openConnectWindow() {
                window.open(
                    `${simpleSignerUrl}/connect`,
                    'Connect_Window',
                    'width=360, height=450',
                );
            }

            function handleMessage(e) {
                // Reject messages that are not coming from simple signer (tailor this according to your needs)
                if (e.origin !== simpleSignerUrl) {
                    return;
                }

                const messageEvent = e.data;

                if (messageEvent.type === 'onConnect') {
                    const publicKey = messageEvent.message.publicKey;
                    // Validate the public key received. This is just good practice.
                    if (StellarSdk.Keypair.fromPublicKey(publicKey)) {
                        console.log('The public key is', publicKey);
                    }
                }
            }

            // see https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event
            window.addEventListener('message', handleMessage);
        </script>
    </body>
</html>
```

---

## Signing a transaction

Once you generate the transaction you want the user to sign, you can present it to your customer using the `/sign`
endpoint. Simple Signer will send a message back to your website with the signed transaction.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Simple Signer - Sign Transaction Demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
            src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/10.1.0/stellar-sdk.min.js"
            integrity="sha512-EqNQsxKR6rZ5xKl29xXa+ez7xgtVSUpj9UDzZmTqoyF0wHbusLkrP8S7dOsKa9DmkoHbssoWUA4+n/0KYY1EAQ=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
        ></script>
    </head>
    <body>
        <button onclick="openSignWindow(unsignedXdr)">Sign</button>
        <script>
            // This XDR may be constructed using the public key obtained from /connect, this is just an example.
            const unsignedXdr =
                'AAAAAgAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAZAADGyCAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAABAAAAAOGpdPW3p7zkOVQPIzk7OYnYo+a6NfyB6ADTbse8pIylAAAAAAAAAAAC+vCAAAAAAAAAAAEAAAAA4al09benvOQ5VA8jOTs5idij5ro1/IHoANNux7ykjKUAAAAAAAAAAAL68IAAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAAA';

            const simpleSignerUrl = 'https://sign.bigger.systems';

            async function openSignWindow(xdr) {
                const signWindow = window.open(
                    `${simpleSignerUrl}/sign/?xdr=${unsignedXdr}`,
                    'Sign_Window',
                    'width=360, height=700',
                );

                window.addEventListener('message', (e) => {
                    if (e.origin !== simpleSignerUrl) {
                        return;
                    } else if (signWindow && e.data.type === 'onReady') {
                        signWindow.postMessage(
                            { xdr, description, operationGroups },
                            simpleSignerUrl,
                        );
                    }
                });

                return signWindow;
            }

            async function handleMessage(e) {
                if (
                    e.origin !== simpleSignerUrl &&
                    e.data.type === 'onSign' &&
                    e.data.page === 'sign'
                ) {
                    const eventMessage = e.data;

                    const signedXdr = eventMessage.message.signedXDR;
                    // Validate the XDR, this is just good practice.
                    if (
                        StellarSdk.xdr.TransactionEnvelope.validateXDR(
                            signedXdr,
                            'base64',
                        )
                    ) {
                        const server = new StellarSdk.Server(
                            'https://horizon-testnet.stellar.org/',
                        ); //remember to update this to the correct value

                        // Construct the transaction from the signedXDR
                        // see https://stellar.github.io/js-stellar-sdk/TransactionBuilder.html#.fromXDR
                        const transaction =
                            StellarSdk.TransactionBuilder.fromXDR(
                                signedXdr,
                                'Test SDF Network ; September 2015', //remember to update this to the correct value
                            );

                        try {
                            const transactionResult =
                                await server.submitTransaction(transaction);
                            console.log(transactionResult);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
            window.addEventListener('message', handleMessage);
        </script>
    </body>
</html>
```

You may choose to pass the unsigned transaction xdr to Simple Signer either via URL or via postMessage.

Via URL:

```javascript
const unsignedXdr =
    'AAAAAgAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAZAADGyCAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAABAAAAAOGpdPW3p7zkOVQPIzk7OYnYo+a6NfyB6ADTbse8pIylAAAAAAAAAAAC+vCAAAAAAAAAAAEAAAAA4al09benvOQ5VA8jOTs5idij5ro1/IHoANNux7ykjKUAAAAAAAAAAAL68IAAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAAA';
const signWindow = window.open(
    `https://sign.bigger.systems/sign/?xdr=${unsignedXdr}`,
    'Sign_Window',
    'width=360, height=700',
);
```

Via PostMessage:

Post Message has some advantages over the URL method which are covered in the [Sign API](#sign-api) section.

```javascript
const unsignedXdr =
    'AAAAAgAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAZAADGyCAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAABAAAAAOGpdPW3p7zkOVQPIzk7OYnYo+a6NfyB6ADTbse8pIylAAAAAAAAAAAC+vCAAAAAAAAAAAEAAAAA4al09benvOQ5VA8jOTs5idij5ro1/IHoANNux7ykjKUAAAAAAAAAAAL68IAAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAAA';
const simpleSignerUrl = 'https://sign.bigger.systems';
const signWindow = window.open(
    `${simpleSignerUrl}/sign`,
    'Sign_Window',
    'width=360, height=700',
);

window.addEventListener('message', (e) => {
    if (
        e.origin !== simpleSignerUrl &&
        e.data.type === 'onReady' &&
        e.data.page === 'sign'
    ) {
        signWindow.postMessage({ xdr: unsignedXdr }, simpleSignerUrl);
    }
});
```

### Explaining your transaction

Simple Signer allows you to include a description for your transaction, as well as grouping multiple operations together
in order to reduce the cognitive complexity when presenting it to your end user.

A description can be added using both the URL and Post Message methods, but operation grouping can only be done using
the Post Message, please see how to implement these in the [Sign API](#sign-api) section or consult
the [test.html file](./test.html).

### General description

![tx eng](https://user-images.githubusercontent.com/71040644/169843456-d20bc240-2a4d-4d02-9a46-bdac2a8a0ec2.png)

### Operation grouping

Sometimes it's useful to group operations together to explain what they are doing.

![txs eng](https://user-images.githubusercontent.com/71040644/169843538-bf79641b-c109-41dd-a878-528dd7afd4d9.png)

![txs eng extend](https://user-images.githubusercontent.com/71040644/169843572-7834474d-44c2-4187-8e57-8cea623ebae7.png)

---

## Making a payment

To make a payment using Simple Signer, you need to provide the necessary parameters either through the URL or using the `postMessage` method. Follow the steps below to integrate the payment functionality into your web application:

### Step 1: Specify Payment Parameters

You can pass the payment parameters such as the receiver's account, amount, asset type, and issuer through the URL or `postMessage` method. Here's an example of how you can do it:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Simple Signer - Make Payment Demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
            src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/10.1.0/stellar-sdk.min.js"
            integrity="sha512-EqNQsxKR6rZ5xKl29xXa+ez7xgtVSUpj9UDzZmTqoyF0wHbusLkrP8S7dOsKa9DmkoHbssoWUA4+n/0KYY1EAQ=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
        ></script>
    </head>
    <body>
        <h1>Make Payment</h1>
        <p>
            This page demonstrates the process of making a payment using the
            Simple Signer.
        </p>
        <h2>Usage</h2>
        <p>Click the "Make Payment" button to initiate the payment process.</p>
        <button onclick="makePayment()">Make Payment</button>

        <script>
            async function makePayment() {
                // Define payment parameters
                const receiver = 'Receiver public key';
                const amount = '10';
                const assetCode = 'native'; // 'native' for XLM, or asset code for other assets
                const issuer = ''; // If assetCode is not 'native', provide issuer's public key

                // Open payment window with payment parameters
                const paymentWindow = window.open(
                    `${simpleSignerUrl}/payment/?receiver=${receiver}&amount=${amount}&assetCode=${assetCode}&issuer=${issuer}`,
                    'Payment_Window',
                    'width=360, height=700',
                );

                // Listen for payment completion message
                window.addEventListener('message', (event) => {
                    if (event.origin !== simpleSignerUrl) return;

                    const { type, message } = event.data;
                    if (type === 'onPayment') {
                        // Handle payment completion
                        console.log('Payment completed successfully:', message);
                    }
                });
            }
        </script>
    </body>
</html>
```

You may choose to pass the payment parameters to Simple Signer either via URL or via postMessage.

Via URL:

```javascript
const receiver = 'Receiver public key';
const amount = '10';
const assetCode = 'native'; // 'native' for XLM, or asset code for other assets
const issuer = ''; // If assetCode is not 'native', provide issuer's public key

const paymentWindow = window.open(
    `https://sign.bigger.systems/payment/?receiver=${receiver}&amount=${amount}&assetCode=${assetCode}&issuer=${issuer}`,
    'Payment_Window',
    'width=360, height=700',
);
```

Via PostMessage:

Post Message has some advantages over the URL method which are covered in the Payment API section.

```javascript
const receiver = 'Receiver public key';
const amount = '10';
const assetCode = 'native'; // 'native' for XLM, or asset code for other assets
const issuer = ''; // If assetCode is not 'native', provide issuer's public key

const simpleSignerUrl = 'https://sign.bigger.systems';
const paymentWindow = window.open(
    `${simpleSignerUrl}/payment`,
    'Payment_Window',
    'width=360, height=700',
);

window.addEventListener('message', (e) => {
    if (
        e.origin !== simpleSignerUrl &&
        e.data.type === 'onReady' &&
        e.data.page === 'payment'
    ) {
        paymentWindow.postMessage(
            { receiver, amount, assetCode, issuer },
            simpleSignerUrl,
        );
    }
});
```

## Language selection

By default, Simple Signer will detect the browser's language and serve Simple Signer using this configuration. If the
language found is not implemented, it defaults to English.

![tx lang eng](https://user-images.githubusercontent.com/71040644/169844094-23c62851-d066-4a22-ae4e-801bde617f42.png)

A user may also choose to change the language using the interface.

![tx lang esp](https://user-images.githubusercontent.com/71040644/169844169-4ef54698-04e0-4d18-9310-18b2c4982b78.png)

---

## Tech stack

This project is built using the [Svelte framework](https://svelte.dev/) along with TypeScript. It uses Cypress for
E2E/integration tests, and Jest for Unit Tests

To ensure we keep a high code quality, we use ESLint as a Linter and Prettier as a Code Formatter

We also use Husky to automatically run lint-staged when making a commit, being able to commit only if lint-staged passes
with no errors.

To make sure we have the same coding style/rules we use <https://editorconfig.org/>

## Adding a new Language

See the [documentation on languages](https://github.com/PlutoDAO/simple-stellar-signer/blob/main/docs/languages.md) if
you want to contribute.

# API

## Valid wallet values

These wallet values can be used to configure the available wallets on the `/connect` endpoint and are received as part
of
the `onConnect` event type to indicate which wallet was connected.

| wallet        | type   | value         |
| ------------- | ------ | ------------- |
| XBull         | String | xbull         |
| Albedo        | String | albedo        |
| Rabet         | String | rabet         |
| Freighter     | String | freighter     |
| WalletConnect | String | walletConnect |
| Lobstr        | String | lobstr        |
| Private Key   | String | privateKey    |

## Connect API

Simple Signer offers a `/connect` endpoint which is used to get the user's public key. It supports some configuration
options which can be passed via URL or postMessage, described below.

For instance, you may choose to explicitly show certain wallets as opposed to showing all of them. You do so by using
the `wallets`
parameter in the URL or by sending a message to Simple Signer. By default, all available wallets are shown.

### Via URL

If you want to configure the wallets that are presented to the user, use valid wallet values appended in
multiple `wallets` parameters, for example:
`https://sign.bigger.systems/connect/?wallets=xbull&wallets=freighter&wallets=albedo`

### Via Post Message

You may also choose to send the wallets at another moment, once Simple Signer is ready, by using a postMessage.

| property | type                | value                                       |
| -------- | ------------------- | ------------------------------------------- |
| wallets  | String[] (Optional) | [valid wallet values](#valid-wallet-values) |

Example usage:

```javascript
const simpleSignerUrl = 'https://sign.bigger.systems';
const connectWindow = window.open(
    `${simpleSignerUrl}/connect`,
    'Connect_Window',
    'width=360, height=700',
);

window.addEventListener('message', (e) => {
    if (
        e.origin === simpleSignerUrl &&
        e.data.type === 'onReady' &&
        e.data.page === 'sign'
    ) {
        connectWindow.postMessage(
            { wallets: ['xbull', 'albedo'] },
            simpleSignerUrl,
        );
    }
});
```

## Sign API

Simple Signer offers a `/sign` endpoint which is used to send a transaction XDR and get it back with the user's
signature.

If you are using **Passkey** to sign, see the [Sign with Passkey](#sign-with-passkey) section for additional details on how to send the signed transaction correctly.

It supports multiple configuration options which can be passed via URL or postMessage.

| property name   | type                                                      | value                                                                                            |
| --------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| xdr             | String (Required)                                         | The XDR representing the transaction to be signed by the user                                    |
| description     | String (Optional)                                         | A description that summarises what this transaction is doing                                     |
| operationGroups | Array of Group (Optional, only available via postMessage) | A way to group operations together and provide descriptions to make them clearer to the end user |

Each `Group` looks as follows

| property name | type              | value                                                                                                       |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| from          | Number (Required) | The zero-based index of the starting operation (0 = first operation)                                        |
| to            | Number (Required) | The zero-based index of the finishing operation (inclusive). (1 = second operation, included in this group) |
| title         | String            | The title that briefly describes this group of operations                                                   |
| description   | String            | The detailed description of what this group of operations is doing                                          |

See examples below via URL and via postMessage for a clearer picture on how they are used.

### Via postMessage

This is the preferred method to pass messages to Simple Signer.

```javascript
const simpleSignerUrl = 'https://sign.bigger.systems';
const signWindow = window.open(
    `${simpleSignerUrl}/sign`,
    'Sign_Window',
    'width=360, height=700',
);
const sampleXdr =
    'AAAAAgAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAZAADGyCAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAABAAAAAOGpdPW3p7zkOVQPIzk7OYnYo+a6NfyB6ADTbse8pIylAAAAAAAAAAAC+vCAAAAAAAAAAAEAAAAA4al09benvOQ5VA8jOTs5idij5ro1/IHoANNux7ykjKUAAAAAAAAAAAL68IAAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAAA';
window.addEventListener('message', (e) => {
    if (
        e.origin === simpleSignerUrl &&
        e.data.type === 'onReady' &&
        e.data.page === 'sign'
    ) {
        signWindow.postMessage(
            {
                xdr: sampleXdr,
                description: 'This is the description for this transaction',
                operationGroups: [
                    {
                        from: 0,
                        to: 1,
                        title: 'This is the title of this group composed of operations with index 0 and 1',
                        description:
                            'This is a description of what these 2 operations are doing together',
                    },
                    // Note that operation 2 is not included in an operation grouping, Simple Signer caters for this and shows it as a top-level operation
                    {
                        from: 3,
                        to: 5,
                        title: 'This is the title of this group composed of operations with index 3,4 and 5',
                        description:
                            'This is a description of what these 3 operations are doing together',
                    },
                ],
            },
            simpleSignerUrl,
        );
    }
});
```

### Via URL

Please note operation groups are not available via URL, use postMessage instead.

```javascript
const simpleSignerUrl = 'https://sign.bigger.systems';
const sampleXdr =
    'AAAAAgAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAZAADGyCAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAABAAAAAOGpdPW3p7zkOVQPIzk7OYnYo+a6NfyB6ADTbse8pIylAAAAAAAAAAAC+vCAAAAAAAAAAAEAAAAA4al09benvOQ5VA8jOTs5idij5ro1/IHoANNux7ykjKUAAAAAAAAAAAL68IAAAAAAAAAAAQAAAADhqXT1t6e85DlUDyM5OzmJ2KPmujX8gegA027HvKSMpQAAAAAAAAAAAvrwgAAAAAAAAAAA';
const signWindow = window.open(
    `${simpleSignerUrl}/sign/?xdr=${sampleXdr}&description=This is a sampe description for this transaction`,
    'Sign_Window',
    'width=360, height=700',
);
```

## Logout API

Simple Signer offers a /logout endpoint that is used to disconnect the session and delete stored values.

### Via postMessage

This is the preferred method to pass messages to Simple Signer.

```javascript
const simpleSignerUrl = 'https://sign.bigger.systems';
const logoutWindow = window.open(
    `${simpleSignerURL}/logout`,
    'Logout_Window',
    'width=100, height=100',
);
window.addEventListener('message', (e) => {
    if (
        e.origin !== simpleSignerUrl &&
        e.data.type === 'onLogout' &&
        e.data.page === 'logout'
    ) {
        logoutWindow.postMessage({ type: 'logout' }, simpleSignerUrl);
    }
});
```

## Sign with Passkey

When using **Passkey** to sign transactions, you must use **PasskeyServer** to submit the signed transaction. If you attempt to send a signed transaction with **Passkey** through a standard Horizon or RPC server, you will receive the `txBadAuth` error. This is because **Passkey** requires an additional authentication process that only **PasskeyServer** can handle.

### Steps to Use Passkey

1. **Install Dependencies**: Ensure you have the `passkey-kit` dependency installed in your project.
2. **Configure PasskeyServer**: Set up your `PasskeyServer` instance with the required credentials and endpoints.
3. **Submit the Transaction**: Use the `PasskeyServer` to submit the transaction.

### Example Implementation

Here’s how you can integrate **Passkey** into your workflow:

```bash
  const account = new PasskeyServer({
    rpcUrl: env.PUBLIC_rpcUrl,
    launchtubeUrl: env.PUBLIC_launchtubeUrl,
    launchtubeJwt: env.PRIVATE_launchtubeJwt,
    mercuryUrl: env.PUBLIC_mercuryUrl,
    mercuryJwt: env.PRIVATE_mercuryJwt,
});

const transactionResult = await account.send(xdr);
```

For more information visit the [passkey-kit](https://github.com/kalepail/passkey-kit) documentation.

## Event Types

This is a list of events that Simple Signer can return to your application.

Consider the following example:

```javascript
window.addEventListener('message', (e) => {
    if (
        e.origin !== simpleSignerUrl &&
        e.data.type === 'onReady' &&
        e.data.page === 'sign'
    ) {
        signWindow.postMessage({ xdr }, simpleSignerUrl);
    }
});
```

`e.data` contains the event that simple signer sends, which can be of type `onReady`, `onCancel`, `onConnect`, `onLogOut`
or `onSign`.

### onReady

Simple Signer emits an onReady event once it has loaded and is ready to accept other messages.

| property name | type   | value                             |
| ------------- | ------ | --------------------------------- |
| type          | String | onReady                           |
| page          | String | connect or sign                   |
| message       | String | Simple Signer is ready to operate |

### onCancel

If a user closes the Simple Signer window or presses a Cancel button in the UI, this event is triggered.

| property name | type   | value                               |
| ------------- | ------ | ----------------------------------- |
| type          | String | onCancel                            |
| page          | String | connect or sign                     |
| message       | String | The user has canceled the operation |

### onConnect

Once a user connects the wallet, therefore granting access to their public key, an onConnect message is sent.

| property name     | type   | value                                          |
| ----------------- | ------ | ---------------------------------------------- |
| type              | String | onConnect                                      |
| page              | String | connect or sign                                |
| message           | Object | {publicKey, wallet}                            |
| message.publicKey | String | The user's public key                          |
| message.wallet    | String | The name of the wallet the user connected with |

### onSign

This message is received when the user signs the XDR sent to Simple Signer.

| property name     | type   | value                       |
| ----------------- | ------ | --------------------------- |
| type              | String | onSign                      |
| page              | String | connect or sign             |
| message           | Object | {signedXDR}                 |
| message.signedXDR | String | The XDR, signed by the user |

### onLogOut

Once a user disconnects the wallet an onLogOut message is sent.

| property name | type   | value                                                 |
| ------------- | ------ | ----------------------------------------------------- |
| type          | String | onLogOut                                              |
| page          | String | logout                                                |
| message       | String | Your session has been disconnected from Simple Signer |

---

Made with love in Argentina.
