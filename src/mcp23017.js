const ipc = require('electron').ipcMain;
const i2c = require('i2c');

const translateHex0 = [7, 6, 5, 4, 3, 2, 1, 0];
const translateHex1 = [7, 6, 5, 4, 3, 2, 1, 0];

var pins = [];

exports.run = function (address) {
	var wire = new i2c(address, {device: '/dev/i2c-1'});

	var getPins = function(callback) {
		wire.readBytes(0, 2, function(err, res) {
			var hex = ~res[0];
			for (var i = 0; i < translateHex0.length; i++) {
				pins[translateHex0[i]] = hex & 1;
				hex = hex >> 1;
			}
			
			hex = ~res[1];
			for (var i = 0; i < translateHex1.length; i++) {
				pins[translateHex1[i]+8] = hex & 1;
				hex = hex >> 1;
			}

			callback && callback();
		});
	};

	getPins();

	ipc.on('getRelais', function(event) {
		getPins(function() {	
			result = {relais: pins};
			event.sender.send('getRelaisReply', result);	
		});
	});

	ipc.on('setRelais', function(event, data) {
		console.log(data);
		if (data.status === 1) {
			pins[data.pin-1] = 1;
		} else {
			pins[data.pin-1] = 0;
		}
		
		var hex0 = 0;
		for (var i = translateHex0.length - 1; i >= 0; i--) {
			hex0 = hex0 << 1;
			hex0 = hex0 | pins[translateHex0[i]];
		}
		hex0 = ~hex0;
		
		
		var hex1 = 0;
		for (var i = translateHex1.length - 1; i >= 0; i--) {
			hex1 = hex1 << 1;
			hex1 = hex1 | pins[translateHex1[i]+8];
		}
		hex1 = ~hex1;

		wire.write([0, hex0], function(err) { });
		wire.write([1, hex1], function(err) { });
	});
};
