**Rust Premium Launcher** is a fully cross-platform customizable game launcher designed specifically for Rust. It allows you to fully personalize it with ease by editing a simple configuration file.

## Key features include
1. **Customization**: Change the color scheme, name, logo, and background image effortlessly to suit your preferences or branding needs.

2. **Multiple Server Support**: Add multiple Rust servers on the launcher.

3. **Cross-Platform Compatibility**: The launcher can be compiled and used on Windows, Ubuntu/Linux, and MacOS, ensuring broad accessibility.

4. **Discord Presence**: Integrated Discord Rich Presence keeps your friends updated on your activity.

5. **Auto-Updater**: Stay up to date effortlessly with an automatic update system built into the launcher.

Rust Premium Launcher is the ultimate tool for enhancing your Rust gaming experience, combining functionality with a sleek and personal touch.


## How to compile the sourcecode
1. Install **NodeJS 20+**

2. Copy all content from **config.js.example** located in **app** folder to a new file named **config.js** in **app** folder

3. Open the configuration file (**config.js**) from **app** folder and edit all fields

4. Execute command **npm install** in launcher directory

5. Execute command **npm run dist** or **npm run dist:windows** or npm **run dist:mac** or **npm run dist:linux** or **npm run dist:ubuntu** in **launcher** directory

6. The launcher is now compiled in **dist** folder


## Warning
1. This launcher is made with **NodeJS** and **Electron**, so you need to install **NodeJS** to be able to compile the sourcecode. 

2. If you want to add many servers just copy the current array from serversList, add comma and paste the copied array.

3. If you want to update the launcher from an older version to a newer one, you must delete the old launcher sourcecodes, minus the file config.js, then copy the new launcher files.

4. If you are not familiar with NodeJS, read the NodeJS documentation. You will need to install the NodeJS modules with the npm install command in order to **run npm run dist**.

5. If you want to compile the sourcecode for different platforms, such as **Windows**, **Ubuntu/Linux** or **macOS**, the sourcecode will need to be compiled on the respective operating system. For example, for Windows you will need to compile the sourcecode on Windows.

6. If you want to use the auto updater, make sure you have copied all the files from the **dist** folder to the website set in config on variable **autoUpdaterDownloadURL**, except the folders with the unpacked launcher.

7. If you want the number of online players and the server version to be updated in the launcher, make sure you put the API Key in the config from rust-servers.net.

8. If you want to modify the launcher installer icon, simply replace the icons from build folder, then recompile the sourcecode.

9. You need at least NodeJS 20 to be able to compile the sourcecode.


## Configuration
```js
module.exports = {
	name: 'Rust Premium Launcher', // The name of launcher
	color: 'orange', // The color of launcher. Select from: orange, red, blue, green, yellow, purple, pink
	header: '', // The header image of launcher. You have to upload the image in the uploads folder, then pass the name of the image here. If it is blank, the displayed image will be the default
	favicon: 'favicon.ico', // The favicon of launcher. You have to upload the image in the uploads folder, then pass the name of the image here
	logo: 'logo.png', // The logo of launcher. You have to upload the image in the uploads folder, then pass the name of the image here
	discordClientId: '', // Client ID from https://discord.com/developers
	discordSlogan: 'Best Rust Launcher!', // The Discord slogan of launcher
	discordLauncherImage: 'launcher-logo', // The Discord image name of launcher
	defaultServerName: 'Nothing', // The default name of server
	defaultServerImage: 'default-logo', // The default Discord image name of server
	launcherURL: 'https://rustpremiumlauncher.com', // The link of launcher
	autoUpdaterDownloadURL: 'https://rustpremiumlauncher.com/download', // The link of auto updater download location
	linkSteam: 'https://steamcommunity.com/id/dfxphoenix', // The link of Steam group
	linkDiscord: 'https://discord.dfxphoenix.xyz', // The link of Discord server
	linkYoutube: 'https://youtube.com/dFxPhoeniX', // The link of Youtube channel
	linkFacebook: 'https://facebook.com/dFxPhoeniX', // The link of Facebook page
	linkInstagram: 'https://instagram.com/waltercurelea', // The link of Instagram account
	linkX: 'https://x.com/waltercurelea', // The link of X account
	linkTiktok: 'https://tiktok.com/@waltercurelea', // The link of TikTok account
	autoUpdater: true, // Enable/Disable the auto updater
	discordPresence: true, // Enable/Disable the Discord presence
	socialIcons: true, // Enable/Disable the social icons

	// Enable/Disable socials
	socialSteam: true,
	socialDiscord: true,
	socialYoutube: true,
	socialFacebook: true,
	socialInstagram: false,
	socialX: false,
	socialTiktok: false,

	serversList: {
		RustServer: {
			ServerName: 'Rust Server', // The name of server
			ServerIP: 'connect.rustserver.com:28017', // The IP of server
			discordServerImage: 'server-logo', // The Discord image name of server
			rustserversKey: '' // API Key from https://rust-servers.net
		}
	}
};
```


### Launcher demo
https://rustpremiumwebsite.dfxphoenix.xyz/launcher
