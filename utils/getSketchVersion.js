module.exports = function(callback){
    if (!callback){
        callback = () => {}
    }
    const fs = require('fs');
    const path = require('path');
    const sketchPath = "/Applications/Sketch.app";
    const infoPlistPath = path.join(sketchPath, "Contents/Info.plist");
    const parser = new DOMParser();
    fs.readFile(infoPlistPath, (err, data) => {
        if (err){
            console.error(err);
            return;
        }
        callback(parser.parseFromString(data.toString(),"text/xml"));
    })
};

function plist2json(plistString){
    const parser = new DOMParser();
    let XMLData = parser.parseFromString(plistString, 'text/xml');
    XMLData.querySelector('plist');
    let JsonData = Object.create(null);
    if (XMLData.childNodes)
    Array.prototype.forEach.call(XMLData.getElementsByTagName('dict'), (v, i) => {

    });
}