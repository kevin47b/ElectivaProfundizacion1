// Crear botón en el contenido remoto para marcar el artículo como "Hecho"
let readitClose = document.createElement('div')
readitClose.innerText = 'Done'

// Botón de estilo
readitClose.style.position = 'fixed'
readitClose.style.bottom = '15px'
readitClose.style.right = '15px'
readitClose.style.padding = '5px 10px'
readitClose.style.fontSize = '20px'
readitClose.style.fontWeight = 'bold'
readitClose.style.background = 'dodgerblue'
readitClose.style.color = 'white'
readitClose.style.borderRadius = '5px'
readitClose.style.cursor = 'default'
readitClose.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)'
readitClose.style.zIndex = '9999'

// Adjuntar el manejador de clicks
readitClose.onclick = e => {

  // Ventana de mensaje padre 
  window.opener.postMessage({
    action: 'delete-reader-item',
    itemIndex: {{index}}
  }, '*')
}

// Agregar el botón al cuerpo
document.getElementsByTagName('body')[0].append(readitClose)
