const fs = require('fs');
const path = require('path');
const pluginDir = path.join(process.env.HOME, "Library/Application Support/com.bohemiancoding.sketch3/Plugins");
const importExportUtil = {
    importPlugins() {

    },
    exportPlugins(){

    },
    installed(){
        return fs.readdirSync(pluginDir).filter( v =>  v !== ".DS_Store");
    }
};
module.exports = importExportUtil;