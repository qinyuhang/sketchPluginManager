const request = require('request');
const fs = require('fs');
const path = require('path');
module.exports = function(forceUpdate, callback) {
    // TODO local cache one version until hit the reload btn fetch from GitHub
    const bundleRepoFile = './plugins.json';
    const confRepoFile = '';
    const readFromLocal = function (localRepoFile, cb) {
        fs.readFile(localRepoFile, (err, data) => {
            if (err) {
                console.error("read local repo file failed");
            } else {
                cb(data);
            }
        });
    };
    const readFromRemote = function (cb) {
        fs.readFile('pluginRepos.json', (err, data) => {
            if (err) {
                console.error("error! ", err);
                return;
            }
            request.get({
                url: JSON.parse(data.toString())["repoListURL"]
            }, (err, res, body) => {
                if (err) {
                    console.error("err! ", err);
                    cb([]);
                }
                cb(body);
            });
        });
    };
    if (callback && typeof callback === 'function'){
        if (forceUpdate) {
            readFromRemote(callback);
        } else {
            readFromLocal(bundleRepoFile,callback);
        }
    }
};