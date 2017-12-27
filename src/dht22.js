const ipc = require('electron').ipcMain;
const dhtsensor = require('node-dht-sensor');

exports.run = function (port) {
	// check settings
	if (!settings.has('dht22.temperature_target')) {
		settings.set('dht22', {
			'temperature_target': 21.0,
			'enabled': false,
			'relay': ''
		});
	}

	ipc.on('getDHT22Settings', function(event) {
		event.sender.send('getDHT22SettingsReply', settings.get('dht22'));
	});

	ipc.on('setDHT22Settings', function(event, data) {
		if (data.key === 'temperature_target' || data.key === 'enabled' || data.key === 'relay') {
				settings.set('dht22.' + data.key, data.value);
		}
	});

	ipc.on('getDHT22', function(event, data) {
		dhtsensor.read(22, port, function(err, temperature, humidity) {
			if (!err) {
				result = {
					temperature: temperature,
					humidity: humidity
				};
				event.sender.send('getDHT22Reply', result);
			}
		});
	});
};
