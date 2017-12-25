let $ = require('jquery');
var ipc = require('electron').ipcRenderer;
$(function() {
	var updateTemperatureId = window.setInterval(updateTemperature, 1000);

	function updateTemperature() {
		ipc.once('temperatureReply', function(event, response) {
			$('#temperature').text(response.temperature.toFixed(1) + '°C');
			$('#humidity').text(response.humidity.toFixed(1) + '%');
		});
		
		ipc.send('getTemperature');	
	}

	ipc.on('getRelaisReply', function(event, response) {
		for(var i=0; i<16; i++) {
			var btn = $('.btn-relais[data-relais=' + (i+1) + ']');

			if (response.relais[i] === 1) {
				btn.addClass('btn-primary').removeClass('btn-default');
			} else {
				btn.addClass('btn-default').removeClass('btn-primary');
			}

			btn.data('relais-status', response.relais[i]);
		}
	});

	ipc.send('getRelais', function(event, response) {

	});

	$('.btn-relais').click(function() {
		var pin = $(this).data('relais');
		var pinstatus = $(this).data('relais-status');

		if (pinstatus !== 1) {
			pinstatus = 1;
		} else {
			pinstatus = 0;
		}

		if (pinstatus === 1) {
			$(this).addClass('btn-primary').removeClass('btn-default');
		} else {
			$(this).addClass('btn-default').removeClass('btn-primary');
		}

		ipc.send('setRelais', {
			pin: pin,
			status: pinstatus
		});

		$(this).data('relais-status', pinstatus);
	});
});
