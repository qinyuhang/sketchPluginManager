const request = require('request');
const fs = require('fs');
const path = require('path');
const toast = require('./toast');
const sketchPluginManagerGitHubAPIKey = process.env.sketchPluginManagerGitHubAPIKey || "";
const sketchPluginManagerGitHubAPISecret = process.env.sketchPluginManagerGitHubAPISecret || "";
const requestHeader = {
    "User-Agent": "Sketch Plugin Manager v0.01"
};
const GitHubAPI = {
    "GetReadMe" : function (owner, repo, callback) {
        request.get({
            url: `https://api.github.com/repos/${owner}/${repo}/readme`,
            headers: requestHeader
        }, (err, res, body) => {
            // TODO change this return into toast
            if (err) { toast.error(document.querySelector('.detail-view'), "Unable to connect Github API"); return;}
            console.log(JSON.parse(body).download_url);
            request.get({
                url: JSON.parse(body).download_url,
                headers: requestHeader
            }, (err, res, body) => {
                // TODO change this return into toast
                if (err) { toast.error(document.querySelector('.detail-view'), "Unable to Download README file"); return;}
                // console.log(body);
                callback(body);
            });
        });
    },
    "DownloadZip" : function (owner, repo, callbacks) {
        let curLength = 0;
        let stream = fs.createWriteStream(`${process.env.TMPDIR}sketchPluginManager/${repo}.zip`);// TODO should change to process.env.tmpxxxx
        request(`https://github.com/${owner}/${repo}/archive/master.zip`)
            .on('response', (e) => {
                callbacks.totalLength(e.headers["content-length"]);
            })
            .on('data', (e) => {
                curLength += e.length;
                callbacks.currentLength(curLength);
            })
            .pipe(stream)
            .on('finish', (e) => {
                callbacks.finishs(`${process.env.TMPDIR}sketchPluginManager/${repo}.zip`);
            });
    },
    "GetRepoInfo": function (owner, repo, callback) {
        request.get({
            url : `https://api.github.com/repos/${owner}/${repo}`,
            headers: requestHeader
        }, (err, res, body) => {
            if (err) {toast.error(document.body, err, 5000); return;}
            callback(body);
        });
    }
};
module.exports = GitHubAPI;