// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const os = require('os');
const { ipcMain } = require('electron')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    // transparent: true,
    // frame: false,
    resizable: false,
    skipTaskbar: true
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  mainWindow.webContents.openDevTools()
}


// function to read from a json file
function systemInfo () {
  let sys_info = {
    cpu: os.cpus()[0].model,
    hostname: os.hostname(),
    ip: os.networkInterfaces()['Ethernet 3'][5].address,
    mem: os.totalmem(),
    upTime: Math.floor(os.uptime() / 60) + ' Minutes',

  }

  return sys_info
}

// this is the event listener that will respond when we will request it in the web page
ipcMain.on('synchronous-message', (event, arg) => {
  event.returnValue = systemInfo()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
