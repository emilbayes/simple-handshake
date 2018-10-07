# `simple-handshake`

> Simple Noise handshake over streams

## Usage

```js
var handshake = require('simple-handshake')
```

## API

### `handshake(transportStream, isInitiator, [opts,] cb(err, connectionStream, split))`

Create a new handshake over `transportStream` (which may not be used while doing
handshaking!), whether the current peer is initiating the connection (ie. is
a client) and call `cb` on error, or with the `transportStream` once the
handshake has completed.

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

## Install

```sh
npm install simple-handshake
```

## License

[ISC](LICENSE)
