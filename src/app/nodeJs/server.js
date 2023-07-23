var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');


io.on('connection', function (socket) {
  /* var client = redis.createClient();

   client.subscribe('messagee');
   client.on('message', function (channel, message) {
     console.log('rak hna HHHHHHHHHHHHH', message);
   })*/

  socket.on('OrderNotification', function (msg) {
    console.log('message: ' + msg);
    io.emit('OrderNotification', msg);
  });
  socket.on('AdminOrderNotification', function (msg) {
    console.log('message: ' + msg);
    io.emit('AdminOrderNotification', msg);
  });
  socket.on('quantitySetNotification', function (msg) {
    console.log('quantitySetNotification', msg);
    io.emit('quantitySetNotification', msg);
  });
  socket.on('setWishlist', function (msg) {
    console.log('setWishlist', msg);
    io.to('u1').emit('setWishlist', msg);
  });
});
http.listen(3000, function () {
  console.log('listening on *:3000');
});
