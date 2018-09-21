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

var server = hs(serverConnection, false, function (err, conn) {
  if (err) throw err

  conn.write('Hello client!')
})
var client = hs(clientConnection, true, function (err, conn) {
  if (err) throw err

  conn.write('Hello server!')
})
