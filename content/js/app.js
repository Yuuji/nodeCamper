let $ = require('jquery');
var ipc = require('electron').ipcRenderer;
$(function() {
	var updateTemperatureId = window.setInterval(updateTemperature, 1000);

	function updateTemperature() {
		ipc.once('temperatureReply', function(event, response){
			$('#temperature').text(response.temperature.toFixed(1) + '°C');
			$('#humidity').text(response.humidity.toFixed(1) + '%');
		});
		
		ipc.send('getTemperature');	
	}
});
