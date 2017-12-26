const ipc = require('electron').ipcMain;
const dhtsensor = require('node-dht-sensor');

exports.run = function (port) {
	ipc.on('getTemperature', function(event, data) {
		dhtsensor.read(22, port, function(err, temperature, humidity) {
			if (!err) {
				result = {
					temperature: temperature,
					humidity: humidity
				};
				event.sender.send('temperatureReply', result);
			}
		});
	});
};
