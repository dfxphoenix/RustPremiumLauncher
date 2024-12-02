const { ipcRenderer } = require('electron');

const config = require("./config");

window.addEventListener('DOMContentLoaded', () => {
	Object.keys(config.serversList).forEach((serverKey) => {
		ipcRenderer.on(serverKey + '-online', (event, text) => {
			var online = document.getElementById(serverKey + '-online');
			online.innerHTML = text;
		});

		ipcRenderer.on(serverKey + '-version', (event, text) => {
			var version = document.getElementById(serverKey + '-version');
			version.innerHTML = text;
		});

		document.getElementById('button').addEventListener('click', () => {
			const serverKey = document.getElementById('button').getAttribute('data-key');
			ipcRenderer.send('button-clicked', serverKey);
		});
	});
});