var hs = require('.')

var serverKeys = hs.keygen()
var clientKeys = hs.keygen()

var server = hs(false, {
  pattern: 'XX',
  staticKeyPair: serverKeys,
  onstatickey: function (key, cb) {
    console.log('client key', key.equals(clientKeys.publicKey))

    setTimeout(cb, 1000)
  }
})


var client = hs(true, {
  pattern: 'XX',
  staticKeyPair: clientKeys,
  onstatickey: function (key, cb) {
    console.log('server key', key.equals(serverKeys.publicKey))

    setTimeout(cb, 1000)
  }
})

client.send(Buffer.from('Hello world'), function (err, buf1) {
  if (err) throw err
  server.recv(buf1, function (err, msg1) {
    if (err) throw err

    server.send(null, function (err, buf2) {
      if (err) throw err

      client.recv(buf2, function (err, msg2) {
        if (err) throw err

        client.send(null, function (err, buf3) {
          if (err) throw err

          server.recv(buf3, function (err, msg3) {
            if (err) throw err

            console.log(client, server)
          })
        })
      })
    })
  })
})
