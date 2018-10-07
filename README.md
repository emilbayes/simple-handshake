# `simple-handshake`

> Simple Noise handshake state machine

## Usage

```js
var simpleHandshake = require('simple-handshake')

// Generate static keys. Ideally these are saved as the represent either party's
// identity
var clientKeys = simpleHandshake.keygen()
var serverKeys = simpleHandshake.keygen()

// Make a client/server pair. These are also known as initiator/responder
var client = simpleHandshake(true, {
  pattern: 'XX',
  staticKeyPair: clientKeys
})

var server = simpleHandshake(false, {
  pattern: 'XX',
  staticKeyPair: serverKeys
})

// Use a simple Round trip function to do the back and forth.
// In practise this would go over a network
rtt(client, server, function (err) {
  if (err) throw err

  // Now both parties have arrived at the same shared secrets
  // client.tx === server.rx and server.tx === client.rx
  console.log(client.split, server.split)
})

function rtt (from, to, cb) {
  from.send(null, function (err, buf) {
    if (err) return cb(err)

    to.recv(buf, function (err) {
      if (err) return cb(err)

      // Keep going until from is finished
      if (from.finished === true) return cb()

      // recurse until finished
      return rtt(to, from, cb)
    })
  })
}

```

## API

### `var hs = simpleHandshake(isInitiator, [opts])`

Options include:

```js
{
  pattern: 'XX', // Noise handshake pattern. XX transmits the keys
  prologue: Buffer.alloc(0), // Defaults to empty Buffer
  staticKeyPair: {publicKey, secretKey}, // Local static key pair
  remoteStaticKey: Buffer, // Remote public key for other patterns eg. KK

  // Callback when receiving a static public key from a remote peer.
  // Can be used to validate the key against certificates, CRL etc.
  onstatickey(remoteStaticKey, cb),

  // Normally not set, but may be if upgrading from another pattern.
  ephemeralKeyPair: {publicKey, secretKey},
  remoteEphemeralKey: Buffer
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

### `SimpleHandshake.keygen()`

Generate a key pair for use with the `staticKeyPair` option

## Install

```sh
npm install simple-handshake
```

## License

[ISC](LICENSE)
