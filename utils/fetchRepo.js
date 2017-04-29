const request = require('request');
const fs = require('fs');
const path = require('path');
module.exports = function(callback) {
    if (!callback){ callback = () => {}}
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
                return;
            }
            callback(body);
        })
    })
};