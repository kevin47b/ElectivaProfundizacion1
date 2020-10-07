// Módulos
const {BrowserWindow} = require('electron')

// Fuera de la pantalla BrowserWindow
let offscreenWindow

// Función readItem exportada
module.exports = (url, callback) => {

  // Crear una ventana fuera de la pantalla
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true
    }
  })

  // Cargar el valor url
  offscreenWindow.loadURL(url)

  // Espera a que el contenido termine de cargarse
  offscreenWindow.webContents.on('did-finish-load', e => {

    // Obtener el título de la página
    let title = offscreenWindow.getTitle()

    // Obtener captura de pantalla (miniatura)
    offscreenWindow.webContents.capturePage().then( image => {

      // Obtener la imagen como una data URL
      let screenshot = image.toDataURL()

      // Ejecutar un callback con el nuevo objeto del artículo
      callback({ title, screenshot, url })

      // limpamis
      offscreenWindow.close()
      offscreenWindow = null

    })
  })
}
