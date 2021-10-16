require('dotenv').config()
const { app, BrowserWindow, dialog, ipcMain} = require('electron')
const url = require('url')
const path = require('path')
const child_process = require('child_process');

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();

const binariesPath =
  IS_PROD && app.isPackaged
    ? path.join(process.resourcesPath, './bin')
    : path.join(root, './resources', './bin');

const executable = path.join(binariesPath, "bulk-mailer.jar "); 

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 700,
    height: 500,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  //win.webContents.openDevTools();

  // and load the index.html of the app.
  win.loadURL(url.format ({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
