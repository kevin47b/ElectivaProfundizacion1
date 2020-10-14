const {Menu, shell} = require('electron')

module.exports = appWin => {

  let template = [
    {
      label: 'Artículo',
      submenu: [
        {
          label: 'Nuevo Item',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            appWin.send('mostrar-show-modal')
          }
        },
        {
          label: 'Leer Item',
          accelerator: 'CmdOrCtrl+Enter',
          click: () => {
            appWin.send('menu-open-item')
          }
        },
        {
          label: 'Eliminar Item',
          accelerator: 'CmdOrCtrl+Backspace',
          click: () => {
            appWin.send('menu-delete-item')
          }
        },
        {
          label: 'Abrir Navegador',
          accelerator: 'CmdOrCtrl+Shift+Enter',
          click: () => {
            appWin.send('menu-open-item-native')
          }
        },
        {
          label: 'Buscar Item(s)',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            appWin.send('menu-focus-search')
          }
        }
      ]
    },
    {
      label: 'Editar',
      role: 'editMenu'
    },
    {
      label: 'Menú de Windows',
      role: 'windowMenu'
    },
    {
      label: 'Ayuda...',
      role: 'help',
      submenu: [
        {
          label: 'Aprender más...',
          click: () => {
            shell.openExternal('https://academiaurepublicana.org/cur5/reporte1.php')
          }
        }
      ]
    }
  ]

  if ( process.platform === 'darwin' ) template.unshift({ role: 'appMenu' })

  let menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
}
