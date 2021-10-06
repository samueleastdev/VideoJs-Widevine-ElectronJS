const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// If customized options are necessary no-verify-widevine-cdm should be set 
// and the API call made once, very early, after the app has received the ready event
app.commandLine.appendSwitch('no-verify-widevine-cdm');

let mainWindow;

// Demonstrating with variable, but this should be set dynamically
let isOffline = false;

// Wiring widevine related events
app.on('widevine-ready', (version, lastVersion) => {
    if (null !== lastVersion) {
        console.log('Widevine ' + version + ', upgraded from ' + lastVersion + ', is ready to be used!');
    } else {
        console.log('Widevine ' + version + ' is ready to be used!');
    }
});
app.on('widevine-update-pending', (currentVersion, pendingVersion) => {
    console.log('Widevine ' + currentVersion + ' is ready to be upgraded to ' + pendingVersion + '!');
});
app.on('widevine-error', (error) => {
    console.log('Widevine installation encountered an error: ' + error);
    process.exit(1);
});

// on app ready createWindow is called
function createWindow() {
    // Demonstrating with default session, but a custom session object can be used
    app.verifyWidevineCdm({
        session: session.defaultSession,
        disableUpdate: isOffline
    });

    const win = new BrowserWindow({
        webPreferences: {
            webSecurity: false
        }
    })


    win.webContents.openDevTools()
    // Working Shaka player demo
    //win.loadURL('https://shaka-player-demo.appspot.com/')
    win.loadURL('https://s3cast.com/test/')
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
    if (mainWindow === null) createWindow();
});