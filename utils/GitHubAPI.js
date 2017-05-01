const request = require('request');
const fs = require('fs');
const path = require('path');
const toast = require('./toast');
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
            if (err) { toast.error(); return;}
            // console.log(JSON.parse(body).download_url);
            request.get({
                url: JSON.parse(body).download_url,
                headers: requestHeader
            }, (err, res, body) => {
                // TODO change this return into toast
                if (err) {console.error(err); return;}
                // console.log(body);
                callback(body);
            })
        })
    },
    "DownloadZip" : function (owner, repo) {
        let stream = fs.createWriteStream(`${process.env.TMPDIR}sketchPlugin/${repo}-master.zip`);// TODO should change to process.env.tmpxxxx
        request(`https://github.com/${owner}/${repo}/archive/master.zip`).pipe(stream);
    }
};
module.exports = GitHubAPI;