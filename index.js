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

let mainWindow;
app.on('ready', () => {
    let {x, y, width, height} = JSON.parse(nodeStorage.getItem('windowInfo')) || {};
    mainWindow = new BroswerWindow({
        frame: false,
        width: width || 800,
        height: height || 600,
        minWidth: 640,
        minHeight: 250,
        x: x || undefined,
        y: y || undefined
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.on("resize", saveWindowStatus);
    mainWindow.on("move", saveWindowStatus);
    makeMenu();
});

function makeMenu(){
    Menu.setApplicationMenu(null);
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