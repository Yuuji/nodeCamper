const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

require('electron-reload')(__dirname, {
	  electron: require('electron-prebuilt')
});

let win;
let settings;
let dht22;
let mcp23017;

function createWindow () {
	// Create the browser window.
	global.win = win = new BrowserWindow({width: 720, height: 480, frame: false, fullscreen: true});

	// and load the index.html of the app.
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'content/index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Uncomment if dev tools are wanted
	win.webContents.openDevTools();

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null
	});

	// load settings
	global.settings = settings = require('electron-settings');

	// load modules
	dht22 = require('./src/dht22.js').run(4);
	mcp23017 = require('./src/mcp23017.js').run(0x20);
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
