var hs = require('.')
var duplexify = require('duplexify')
var through = require('through2')

var a = spy('from server to client')
var b = spy('from client to server')

var serverConnection = duplexify(a, b)
var clientConnection = duplexify(b, a)

function spy (label) {
  return through(function (chunk, enc, cb) {
    console.log(label, chunk.toString())
    return cb(null, chunk)
  })
}

var server = hs(serverConnection, false, {
  pattern: 'XX',
  staticKeyPair: hs.keygen()
}, function (err, conn, split) {
  if (err) throw err

  conn.write('Hello client!')
})

var client = hs(clientConnection, true, {
  pattern: 'XX',
  staticKeyPair: hs.keygen()
}, function (err, conn, split) {
  if (err) throw err

  conn.write('Hello server!')
})
