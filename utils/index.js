const sektchVersion = require('./getSketchVersion');
const importUtil = require('./importExportUtil');
const saveConf = require('./saveConfig');
const fetchRepo = require('./fetchRepo');
const toast = require('./toast');
const convertMarkdown = require('./converMarkdown');
const GitHubAPI = require('./GitHubAPI');
module.exports = {
    "sketchVersion"     : sektchVersion,
    "importUtil"        : importUtil,
    "saveConf"          : saveConf,
    "fetchRepo"         : fetchRepo,
    "toast"             : toast,
    "convertMarkdown"   : convertMarkdown,
    "GitHubAPI"         : GitHubAPI
};
