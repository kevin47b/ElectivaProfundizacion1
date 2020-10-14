// Módulos
const {app, BrowserWindow, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state')
const readItem = require('./readItem')
const appMenu = require('./menu')

// Mantenga una referencia global del objeto de la ventana, si no lo hace, la ventana
// se cerrará automáticamente cuando el objeto de JavaScript sea basura recogida.
let mainWindow

// Escuchar para la solicitud de un nuevo items o artículo
ipcMain.on('new-item', (e, itemUrl) => {

  // Get new item and send back to renderer
  readItem( itemUrl, item => {
    e.sender.send('new-item-success', item)
  })
})

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  // Win state keeper
  let state = windowStateKeeper({
    defaultWidth: 500, defaultHeight: 650
  })

  mainWindow = new BrowserWindow({
    x: state.x, y: state.y,
    width: state.width, height: state.height,
    minWidth: 350, maxWidth: 650, minHeight: 300,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Creamos
  appMenu(mainWindow.webContents)

  // Cargar index.html en la nueva BrowserWindow
  mainWindow.loadFile('renderer/main.html')

  // Administrar el estado de la nueva ventana
  state.manage(mainWindow)

  // Open DevTools - PILAAAAAAAAS quitaaaaaaar para la PRODUCCIÓN!
  //mainWindow.webContents.openDevTools();

  // Escuche como se cierra la ventana
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` ESTA LISTA
app.on('ready', createWindow)

// Salir cuando todas las ventanas estén cerradas - (No macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Cuando se hace clic en el icono de la aplicación y la aplicación se está ejecutando, (macOS) recrear la BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
