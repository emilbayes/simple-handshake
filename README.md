# `simple-handshake`

> Simple Noise handshake state machine

## Usage

```js
var simpleHandshake = require('simple-handshake')
```

## API

### `var hs = simpleHandshake(isInitiator, [opts])`

Options include:

```js
{
  pattern: 'XX', // Send keys over the wire
  prologue: Buffer.alloc(0),
  staticKeyPair: {publicKey, secretKey},
  remoteStaticKey: Buffer,

  ephemeralKeyPair: {publicKey, secretKey},
  remoteEphemeralKey: Buffer,

  onstatickey(remoteStaticKey, cb)
}
```

### `hs.waiting`

Flag indicating whether `hs.send` should be called.

### `hs.finished`

Flag indicating whether the handshake is finished. If an error occurs this flag
will also be set `true`, as the instance is no longer usable.

### `hs.split`

A Noise split containing a `{rx, tx}` object of Buffers which are
`32 byte shared secret | 8 byte nonce` (a Noise `CipherState`). `rx` at the
initiator matches `tx` at the responder.

### `hs.send(payload, cb(err, message))`

Encode a message with a `payload` (which if `null` defaults to an empty buffer),
for sending to the other party. Message is written in a preallocated Buffer,
meaning that the backing Buffer is reused at the next call to `.send`.

### `hs.recv(message, cb(err, payload))`

Decode a `message` with a `payload` (which may be an empty buffer). `payload` is
written in a preallocated Buffer, meaning that the backing Buffer for is reused
at the next call to `.recv`, so you must copy the payload if you need it for
longer. If a static key is received and `onstatickey` is set, this function is
called between parsing and `cb`.

## Install

```sh
npm install simple-handshake
```

## License

[ISC](LICENSE)
