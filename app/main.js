const { app, BrowserWindow, shell, ipcMain } = require('electron');
const { Client } = require('discord-rpc-patch');
const { autoUpdater } = require('electron-updater');
const { exec } = require('child_process');
const path = require('path');
const url = require('url');
const ejse = require('ejs-electron');

const config = require("./config");

const rpc = new Client({ transport: 'ipc' });
const startTimestamp = new Date();

let mainWindow = null;

let updatedserver = null;
let updatedserverImage = null;

let server = config.defaultServerName;
let serverImage = config.defaultServerImage;
let launcherImage = config.discordLauncherImage;

initializeRPC = async () => {
	try {
		if (!rpc) {
			return;
		}

		await rpc.login({ clientId: config.discordClientId });
		console.log('RPC login successful');
	} catch (error) {}
};

cleanUpRPC = async () => {
	try {
		if (!rpc) {
			return;
		}

		await rpc.clearActivity();
		await rpc.destroy();
	} catch (error) {}
};

setActivity = async () => {
	try {
		if (!rpc) {
			return;
		}

		await rpc.setActivity({
			details: config.discordDetails,
			state: 'Server: ' + server,
			largeImageKey: serverImage,
			largeImageText: server,
			smallImageKey: launcherImage,
			smallImageText: config.name,
			startTimestamp,
			instance: false,
		});
	} catch (error) {}
};

clearActivity = async () => {
	try {
		if (!rpc) {
			return;
		}

		await rpc.clearActivity();
	} catch (error) {}
};

updateServers = () => {
	Object.keys(config.serversList).forEach((serverKey) => {
		updateServerInfo(serverKey);
	});
}

updateServerInfo = async (serverKey) => {
	try {
		const response = await fetch('https://rust-servers.net/api/?object=servers&element=detail&key=' + config.serversList[serverKey].rustserversKey);

		if (!response.ok) {
			console.error(`Error parse JSON: ${response.status}`);
			return;
		}

		const data = await response.json();
		const online = data.players;
		const version = data.version;

		mainWindow.webContents.send(serverKey + '-online', online);
		mainWindow.webContents.send(serverKey + '-version', version);
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

isRunning = (win, mac, linux) => {
	return new Promise((resolve, reject) => {
		const plat = process.platform;
		const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''));
		const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''));

		if (cmd === '' || proc === '') {
			resolve(false);
		}

		exec(cmd, (err, stdout, stderr) => {
			resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1);
		});
	});
};

isSafeishURL = (url) => {
	return !url.startsWith('steam://');
}

sendStatusToWindow = (message) => {
	mainWindow.webContents.send('message', message);
};

createMainWindow = () => {
	mainWindow = new BrowserWindow({
		center: true,
		width: 1280,
		height: 860,
		minWidth: 1280,
		minHeight: 860,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preloader.js'),
			nodeIntegration: true
		},
		icon: path.join(__dirname, 'uploads/' + config.logo)
	});

	autoUpdater.setFeedURL({
		provider: 'generic',
		url: config.autoUpdaterDownloadURL
	});

	if (config.autoUpdater) {
		autoUpdater.checkForUpdates();
	}

	ejse.data('name', config.name);
	ejse.data('color', config.color);
	ejse.data('header', config.header);
	ejse.data('favicon', config.favicon);
	ejse.data('logo', config.logo);
	ejse.data('launcherURL', config.launcherURL);
	ejse.data('linkSteam', config.linkSteam);
	ejse.data('linkDiscord', config.linkDiscord);
	ejse.data('linkYoutube', config.linkYoutube);
	ejse.data('linkFacebook', config.linkFacebook);
	ejse.data('linkInstagram', config.linkInstagram);
	ejse.data('linkX', config.linkX);
	ejse.data('linkTiktok', config.linkTiktok);
	ejse.data('copyrightName', config.copyrightName);
	ejse.data('copyrightLink', config.copyrightLink);
	ejse.data('autoUpdater', config.autoUpdater);
	ejse.data('socialIcons', config.socialIcons);
	ejse.data('socialSteam', config.socialSteam);
	ejse.data('socialDiscord', config.socialDiscord);
	ejse.data('socialYoutube', config.socialYoutube);
	ejse.data('socialFacebook', config.socialFacebook);
	ejse.data('socialInstagram', config.socialInstagram);
	ejse.data('socialX', config.socialX);
	ejse.data('socialTiktok', config.socialTiktok);
	ejse.data('serversList', config.serversList);

	setTimeout(() => { updateServers(); }, 1000);
	setInterval(() => { updateServers(); }, 5000);

	if (config.discordPresence) {
		setInterval(async () => {
			const rustClientRunning = await isRunning('RustClient.exe', 'RustClient', 'RustClient');
			const rustRunning = await isRunning('Rust.exe', 'Rust', 'Rust');

			if (!rustClientRunning && !rustRunning) {
				if (config.discordPresence) {
					server = config.defaultServerName;
					serverImage = config.defaultServerImage;
					await setActivity();
				}
			}

			if (rustClientRunning && rustRunning) {
				if (config.discordPresence) {
					server = updatedserver;
					serverImage = updatedserverImage;
					await setActivity();
				}
			}
		}, 5000);
	}

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'assets/index.ejs'),
		protocol: 'file',
		slashes: true
	}));

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	mainWindow.webContents.on('will-navigate', (event, url) => {
		if (isSafeishURL(url)) {
			event.preventDefault();
			shell.openExternal(url);
		}
	});

	mainWindow.webContents.on('did-finish-load', async () => {
		mainWindow.webContents.insertCSS(`
			img {
				user-select: none;
				-webkit-user-select: none;
				-webkit-user-drag: none;
				-webkit-app-region: no-drag;
			}
		`);
		if (config.discordPresence) {
			await setActivity();
		}
	});

	// DevTools
	// mainWindow.webContents.openDevTools();
};

autoUpdater.on('checking-for-update', () => {
	sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (ev, info) => {
	sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (ev, info) => {
	sendStatusToWindow('No update available.');
});

autoUpdater.on('error', (ev, err) => {
	sendStatusToWindow('Error in auto-updater.');
});

autoUpdater.on('download-progress', (ev, progressObj) => {
	sendStatusToWindow('Download progress...');
});

autoUpdater.on('update-downloaded', (ev, info) => {
	sendStatusToWindow('Close client and update.');
});

ipcMain.on('button-clicked', async (event, serverKey) => {
	if (config.discordPresence) {
		updatedserver = config.serversList[serverKey].ServerName;
		updatedserverImage = config.serversList[serverKey].discordServerImage;
		await setActivity();
	}
});

app.on('ready', async () => {
	app.setName(config.name);
	app.setAppUserModelId(config.name);
	createMainWindow();
	if (config.discordPresence) {
		await initializeRPC();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow();
	}
});

app.on('before-quit', async () => {
	if (config.discordPresence) {
		await cleanUpRPC();
	}
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
