var moment = require('moment');
var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket) {
	console.log('user connected via socket.io');

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});
	socket.on('message', function(message) {
		message.timestamp = moment().valueOf();
		console.log('message received: ' + message.text);
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	socket.emit('message', {
		name: "System",
		text: 'Welcome to the chat application.',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function() {
	console.log('Server Started!');
});