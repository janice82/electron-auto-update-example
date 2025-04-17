const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
 
let mainWindow;

 
function sendStatusToWindow(text) {
 
  mainWindow.webContents.send('message', text);
}
autoUpdater.on('error',(err)=>{
  sendStatusToWindow('error');
});
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
  console.log(ev, err);
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatusToWindow('Download progress...');
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    //  contextIsolation: false,
    },
  });
  mainWindow.loadFile('index.html');
  sendStatusToWindow('createWindow');
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    sendStatusToWindow('ready-to-show');
    autoUpdater.checkForUpdatesAndNotify();
  });
  mainWindow.once("did-finish-load", () => {
    sendStatusToWindow("did-finish-load");
    autoUpdater.checkForUpdatesAndNotify();
  });
  
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  console.log('app_version');
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('update_available', (event) => {
  console.log('update-available');
  event.sender.send('update_available',{});
});

// autoUpdater.on('update-downloaded', () => {
//   console.log('update-downloaded');
//   mainWindow.webContents.send('update_downloaded');
// });

ipcMain.on('restart_app', () => {
  console.log('restart_app');
  autoUpdater.quitAndInstall();
});
