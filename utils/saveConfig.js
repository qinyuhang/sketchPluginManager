const fs = require('fs');
const path = require('path');
const configPath = path.join(process.env.HOME, '/Library/Application Support/online.welkin.sketch-plugin-manager');
const existConfig = function(){
    let p = new Promise((resolve, reject) => {
        fs.access(path.join(configPath, 'config.json'), fs.constants.F_OK, err => {
            if (err){
                console.log("error! ", err);
                reject(err);
            }
            fs.readFile(path.join(configPath, 'config.json'), (err, data) => {
                if (err) {
                    console.err('error! ', err);
                    reject(err);
                }
                resolve(JSON.parse(data.toString()));
            })
        });
    });
    p.then( data => {

    }).catch( err => {
        console.error("error! ", err);
    });
};

module.exports = existConfig
