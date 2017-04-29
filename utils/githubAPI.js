const request = require('request');
const fs = require('fs');
const toast = require('./toast');
const requestHeader = {
    "User-Agent": "Sketch Plugin Manager v0.01"
};
const GitHubAPI = {
    "GetReadMe" : function (owner, repo) {
        request.get({
            url: `https://api.github.com/repos/${owner}/${repo}/readme`,
            header: requestHeader
        }, (err, res, body) => {
            if (err) { toast.error(); return; }
            console.log(JSON.parse(body).download_url);
            request.get({
                url: JSON.parse(body).download_url,
                header: requestHeader
            }, (err, res, body) => {
                if (err) {console.error(err); return;}
                console.log(body);
            })
        })
    },
    "DownloadZip" : function (owner, repo) {
        let stream = fs.createWriteStream('/tmp/master.zip');// TODO should change to process.env.tmpxxxx
        request(`https://github.com/${owner}/${repo}/archive/master.zip`).pipe(stream);
    }
};
module.export = GitHubAPI;