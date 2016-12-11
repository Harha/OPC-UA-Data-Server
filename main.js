// Includes
var ws = require('winston');
var io = require('socket.io')();
var mongo = require('mongodb').MongoClient;

// Settings
var settings = {
	addr: '0.0.0.0',
	port: 9091,
	db_addr: 'mongodb://harha.us.to:27017/iotgateway',
	db_settings: {
		auto_reconnect: true,
		native_parser: true
	}
};

// mongodb, instantiate client
mongo.connect(settings.db_addr, settings.db_settings, function(err, db) {
	ws.log('info', 'mongodb client connected to ' + settings.db_addr);

	// socket.io, connection handling
	io.on('connection', function(socket) {
		ws.log('info', 'new connection...');

		// client requests variable data
		socket.on('opcuavariable', function(data) {
			ws.log('info', 'input | opcuavariable, identifier: ' + data.identifier);

			// get db collection instance
			var collection = db.collection('opc_ua_variable');

			// find latest variable
			var results = collection.find({
				$and: [
					{identifier: data.identifier},
					{serverId: data.serverId},
					{nsIndex: data.nsIndex}
				]
			}).sort({
				$natural: -1
			}).limit(1);

			results.toArray(function(err, docs) {
				socket.emit('opcuavariable', docs[0]);
			});
		});

	});

	// socket.io, instantiate listener
	io.listen(settings.port);
	ws.log('info', 'socket.io server listening on ' + settings.addr + ':' + settings.port);

});