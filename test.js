var hs = require('.')
var duplexify = require('duplexify')
var through = require('through2')

var a = spy('<-')
var b = spy('->')

var serverConnection = duplexify(a, b)
var clientConnection = duplexify(b, a)

function spy (label) {
  return through(function (chunk, enc, cb) {
    console.log(label, chunk.some(b => b > 127) ? chunk.byteLength : chunk.toString())
    return cb(null, chunk)
  })
}

var serverKeys = hs.keygen()
var clientKeys = hs.keygen()

var server = hs(serverConnection, false, {
  pattern: 'XX',
  staticKeyPair: serverKeys,
  onstatickey: function (key, cb) {
    console.log('client key', key.equals(clientKeys.publicKey))

    setTimeout(cb, 1000)
  }
}, function (err, conn, split) {
  if (err) return conn.destroy(err)

  conn.write('Hello client!')
})


var client = hs(clientConnection, true, {
  pattern: 'XX',
  staticKeyPair: clientKeys,
  onstatickey: function (key, cb) {
    console.log('server key', key.equals(serverKeys.publicKey))

    setTimeout(cb, 1000)
  }
}, function (err, conn, split) {
  if (err) return conn.destroy(err)

  conn.write('Hello server!')
})
