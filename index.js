const electron = require('electron');
const {webContents} = require('electron');
const app = module.exports = electron.app;
const BroswerWindow = electron.BrowserWindow;
const JSONStorage = require('node-localstorage').JSONStorage;
const path = require('path');
const url = require('url');
const {Menu, MenuItem} = require('electron');
const menu = new Menu();

const storageLocation = app.getPath('userData');
let nodeStorage = new JSONStorage(storageLocation);

// TODO read last time window info and restore
// mainly the width and height
let mainWindow;
app.on('ready', () => {
    Menu.setApplicationMenu(null);
    // console.log(Menu.getApplicationMenu());
    // menu.append(new MenuItem({
    //     label: 'Print',
    //     accelerator: 'CmdOrCtrl+P',
    //     click: () => { console.log('time to print stuff') }
    // }));
    let {x, y, width, height} = JSON.parse(nodeStorage.getItem('windowInfo')) || {};
    // console.log(JSON.parse(nodeStorage.getItem('windowInfo')));
    mainWindow = new BroswerWindow({
        frame: false,
        width: width || 800,
        height: height || 600,
        minWidth: 640,
        minHeight: 250,
        x: x || 0,
        y: y || 0
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.on("resize", saveWindowStatus);
    mainWindow.on("move", saveWindowStatus);
    makeMenu();
    makeMenuBar();
});

function makeMenu(){

}

function makeMenuBar(){

}

const saveWindowStatus = (() => {
    let ti;
    return (e, cmd) => {
        if (ti) {clearTimeout(ti)}
        ti = setTimeout( () => {
            let obj = mainWindow.getContentBounds();
            nodeStorage.setItem('windowInfo', JSON.stringify(obj));
        }, 500);
    }
})();