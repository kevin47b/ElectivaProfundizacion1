
// Módulos
const {shell} = require('electron')
const fs = require('fs')

// DOM 
let items = document.getElementById('items')

// Obtener el contenido de ReaderJS
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString()
})

// Rastrear los artículos almacenados
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Escuche el mensaje "hecho" de la ventana del lector
window.addEventListener('message', e => {

  // Comprueba si el mensaje es correcto
  if (e.data.action === 'delete-reader-item') {

    // Eliminar el elemento en un índice determinado
    this.delete(e.data.itemIndex)

    // Cerramos parce
    e.source.close()
  }
})

// Eliminamos item
exports.delete = itemIndex => {

  // removemos item de DOM
  items.removeChild( items.childNodes[itemIndex] )

  // Sacar el artículo de la pila
  this.storage.splice(itemIndex, 1)

  // va,os a guardar persistente
  this.save()

  // Selecciona el elemento anterior o el nuevo elemento superior
  if (this.storage.length) {

    // Obtener el nuevo índice de artículos seleccionados
    let = newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1

    document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
  }
}

// Obtener el índice de item seleccionados
exports.getSelectedItem = () => {

  // Obtener el nodo seleccionado
  let currentItem = document.getElementsByClassName('read-item selected')[0]

  // Obtener el índice de items
  let itemIndex = 0
  let child = currentItem
  while( (child = child.previousElementSibling) != null ) itemIndex++

  // Devuelve el item seleccionado y el índice
  return { node: currentItem, index: itemIndex }
}

// Persist storage
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// Set item as selected
exports.select = e => {

  // Remove currently selected item class
  this.getSelectedItem().node.classList.remove('selected')

  // Add to clicked item
  e.currentTarget.classList.add('selected')
}

// Move to newly selected item
exports.changeSelection = direction => {

  // Get selected item
  let currentItem = this.getSelectedItem()

  // Handle up/down
  if (direction === 'ArrowUp' && currentItem.node.previousElementSibling) {
    currentItem.node.classList.remove('selected')
    currentItem.node.previousElementSibling.classList.add('selected')

  } else if (direction === 'ArrowDown' && currentItem.node.nextElementSibling) {
    currentItem.node.classList.remove('selected')
    currentItem.node.nextElementSibling.classList.add('selected')
  }
}

// Open selected item in native browser
exports.openNative = () => {

  // Only if we have items (in case of menu open)
  if ( !this.storage.length ) return

  // Get selected item
  let selectedItem = this.getSelectedItem()

  // Get item's url
  let contentURL = selectedItem.node.dataset.url

  // Open in user's default system browser
  shell.openExternal(contentURL)
}

// Open selected item
exports.open = () => {

  // Only if we have items (in case of menu open)
  if ( !this.storage.length ) return

  // Get selected item
  let selectedItem = this.getSelectedItem()

  // Get item's url
  let contentURL = selectedItem.node.dataset.url

  // Open item in proxy BrowserWindow
  let readerWin = window.open(contentURL, '', `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
  `)

  // Inject JavaScript with specific item index (selectedItem.index)
  readerWin.eval( readerJS.replace('{{index}}', selectedItem.index) )
}

// Add new item
exports.addItem = (item, isNew = false) => {

  // Create a new DOM node
  let itemNode = document.createElement('div')

  // Assign "read-item" class
  itemNode.setAttribute('class', 'read-item')

  // Set item url as data attribute
  itemNode.setAttribute('data-url', item.url)

  // Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

  // Append new node to "items"
  items.appendChild(itemNode)

  // Attach click handler to select
  itemNode.addEventListener('click', this.select)

  // Attach doubleclick handler to open
  itemNode.addEventListener('dblclick', this.open)

  // If this is the first item, select it
  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected')
  }

  // Add item to storage and persist
  if(isNew) {
    this.storage.push(item)
    this.save()
  }
}

// Add items from storage when app loads
this.storage.forEach( item => {
  this.addItem(item)
})
