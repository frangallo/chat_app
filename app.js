var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');

httpd.listen(4000);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
    function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
    }
  );
}

io.sockets.on('connection', function (socket) {
  socket.on('clientMessage', function(content) {
    socket.emit('serverMessage', 'You said: ' + content);
    username = socket.username
    socket.broadcast.emit('serverMessage', username + ' said: ' + content);
  });

  socket.on('login', function(username) {
    socket.username = username
    socket.emit('serverMessage', 'Currently logged in as ' + username);
    socket.broadcast.emit('serverMessage', 'User ' + username + ' logged in');
  });

  socket.on('disconnect', function(){
    username = socket.username
    socket.broadcast.emit('serverMessage', 'User ' + username + ' disconnected' )
  });

  socket.on("is-typing", function () {
    username = socket.username
    socket.broadcast.emit('serverMessage', 'User ' + username + ' is typing' )
  });


  socket.emit('login');
});
