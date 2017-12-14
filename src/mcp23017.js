const ipc = require('electron').ipcMain;
const i2c = require('i2c');

var pins = [0, 0, 0, 0, 0, 0, 0, 0];

exports.run = function (address) {
	var wire = new i2c(address, {device: '/dev/i2c-1'});

	ipc.on('getRelais', function(event) {
		wire.read(2, function(err, res) {
			var hex = ~res[1];
			pins[0] = hex & 1;
			hex = hex >> 1;
			pins[1] = hex & 1;
			hex = hex >> 1;
			pins[3] = hex & 1;
			hex = hex >> 1;
			pins[2] = hex & 1;
			hex = hex >> 1;
			pins[4] = hex & 1;
			hex = hex >> 1;
			pins[5] = hex & 1;
			hex = hex >> 1;
			pins[6] = hex & 1;
			hex = hex >> 1;
			pins[7] = hex & 1;
			
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

		var hex = 0;
		hex = hex << 1;
		hex = hex | pins[7];
		hex = hex << 1;
		hex = hex | pins[6];
		hex = hex << 1;
		hex = hex | pins[5];
		hex = hex << 1;
		hex = hex | pins[4];
		hex = hex << 1;
		hex = hex | pins[2];
		hex = hex << 1;
		hex = hex | pins[3];
		hex = hex << 1;
		hex = hex | pins[1];
		hex = hex << 1;
		hex = hex | pins[0];

		hex = ~hex;

		wire.write([0, hex], function(err) { });
	});
};
