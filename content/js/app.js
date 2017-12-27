let $ = require('jquery');
var ipc = require('electron').ipcRenderer;
$(function() {
	var updateTemperatureId = window.setInterval(updateTemperature, 1000);

	function updateTemperature() {
		ipc.once('getDHT22Reply', function(event, response) {
			$('#temperature').text(response.temperature.toFixed(1) + '°C');
			$('#humidity').text(response.humidity.toFixed(1) + '%');
		});
		
		ipc.send('getDHT22');	
	}

	ipc.on('getRelaisReply', function(event, response) {
		for(var i=0; i<16; i++) {
			var btn = $('.btn-relay[data-relay=' + (i+1) + ']');

			if (response.relay[i] === 1) {
				btn.addClass('btn-primary').removeClass('btn-default');
			} else {
				btn.addClass('btn-default').removeClass('btn-primary');
			}

			btn.data('relay-status', response.relay[i]);
		}
	});

	ipc.send('getRelais');

	$('.btn-relay').click(function() {
		var pin = $(this).data('relay');
		var pinstatus = $(this).data('relay-status');

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

		$(this).data('relay-status', pinstatus);
	});

	var openContainer = function(name) {
		$('.container').hide();
		$('.container#' + name).show();

		if (name === 'main') {
			$('nav').hide();
		} else {
			$('nav').show();
		}
	};

	$('nav .gohome').click(function() {
		openContainer('main');
	});

	$('#temperature').longpress(function() {
		var select = $('#temperature-settings-relay');

		select.find('option').remove();
			
		select.append($('<option></option>')
			.attr('value','')
			.text(''));

		for (var key=0; key<16; key++) {
			select.append($('<option></option>')
				.attr('value',key)
				.text(key+1));
		}

		ipc.once('getDHT22SettingsReply', function(event, response) {
			select.val(response.relay);
			openContainer('temperature-settings');
		});

		ipc.send('getDHT22Settings');
		
	}, function() {
		alert('shortpress');
	});

	$('#temperature-settings-save').click(function() {
		ipc.send('setDHT22Settings', {
			key: 'relay',
			value: $('#temperature-settings-relay').val()
		});
		openContainer('main');
	});
});
