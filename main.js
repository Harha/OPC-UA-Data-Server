// Includes
var ws = require('winston');
var io = require('socket.io')();
var db = require('mongodb');

// Settings
var settings = {
	addr: '0.0.0.0',
	port: 9091,
	db_addr: 'mongodb://localhost:27017/iotgateway',
	db_settings: {
		auto_reconnect: true,
		native_parser: true
	}
};

// mongodb, instantiate client
db.MongoClient.connect(settings.db_addr, settings.db_settings, function(err, db) {
	ws.log('info', 'mongodb client connected to ' + settings.db_addr);

	// socket.io, connection handling
	io.on('connection', function(socket) {

		ws.log('info', 'new connection...');

		// client requests variable data
		socket.on('opcuavariable', function(data) {

		});

	});

	// socket.io, instantiate listener
	io.listen(settings.port);
	ws.log('info', 'socket.io server listening on ' + settings.addr + ':' + settings.port);

});