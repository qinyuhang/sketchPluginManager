const electron = require('electron');
const app = module.exports = electron.app;
const BroswerWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

// TODO read last time window info and restore
// mainly the width and height
let mainWindow;
app.on('ready', () => {
    mainWindow = new BroswerWindow({
        width: 800,
        height: 600,
        minWidth: 640,
        maxWidth: 800,
        minHeight: 250
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
    makeMenu();
    makeMenuBar();
});

function makeMenu(){

}

function makeMenuBar(){

}