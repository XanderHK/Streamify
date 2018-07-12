const fetch = require('electron-fetch')
const electron = require('electron')
//const glob = require('glob-electron')
var WebTorrent = require('webtorrent')

const {app, BrowserWindow, ipcMain} = electron
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  var mainWindow
  
  function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1280, height: 720})
  
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
  
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
  }

  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  /**
   * Fetch
   */
  fetch('https://tv-v2.api-fetch.website/movie/tt1375666').then(res => res.json())
      .then(json => echoData(json))

  var client = new WebTorrent()
  var magnetURI = null

  function echoData(json) {
    AW_FADED = 'magnet:?xt=urn:btih:11a1e8548ceeed076e479fb2d2c86893f6d1466e&dn=Alan+Walker+-+Alone&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
    magnetURI = AW_FADED //json.torrents.en['720p'].url
    //console.log(magnetURI)

    client.add(magnetURI, { path: './downloads' }, function (torrent) {
      
      torrent.on('done', function () {
        //console.log('torrent download finished')
        mainWindow.webContents.executeJavaScript(
          "document.getElementById('text').style.display = 'block'"
        )
        mainWindow.webContents.executeJavaScript(
          "document.getElementById('button').style.display = 'block'"
        )
      })
    }).on('metadata', function () {
      //console.log('Metadata received')
    }).on('ready', function () {
      var torrent = client.get(AW_FADED)
      //console.log(torrent.magnetURI)
        torrent.files.forEach( file => {
          //console.log(file.path)
          
          ipcMain.on('video:create', (event) => {
            mainWindow.webContents.send('video:create', './downloads/' + file.path)
          })
        })
      })
    }