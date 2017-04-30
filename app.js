const request = require('request');
const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
require("babel-polyfill");

// const detailView = require('./view/detail');

const utils = require('./utils/index');

function main() {
    // TODO load list Gif
    drawLeftBar();
    utils.sketchVersion();
    utils.fetchRepo( body => {
        drawList(JSON.parse(body));
        registerSearch(JSON.parse(body));
    });
}


function drawLeftBar(){

}

let readfff = async function(){
    let x = await fs.readFileSync('package.json');
    return x;
};

function drawList(repoList){
    // TODO First! using proxy design mode to add a loading img
    try {
        // TODO here should change to replace ul with loading img
        document.querySelector('ul').remove();
    }catch(e){

    }
    let ul = document.createElement('ul');
    document.querySelector('.plugin-list').appendChild(ul);
    repoList.forEach( (v, i) => {
        if (!v) {return}
        let li = document.createElement('li');
        li.innerHTML = v.title || v.name;
        li.setAttribute('data-src', JSON.stringify(v));
        li.onclick = showDetail;
        document.querySelector('.list-view ul').appendChild(li)
    });
    function showDetail(){
        console.log(this);
        Array.prototype.forEach.call(
            document.querySelectorAll("ul li"),
            v => {
                v.classList.remove('active');
            }
        );
        this.classList.add('active');
        drawDetail(JSON.parse(this.getAttribute('data-src')));
    }
}

function drawDetail(obj){
    // up detail is information
    // footer detail is markdown to html
    // TODO change to using github API to get The readme filename
    // TODO download the img if related path
    // TODO fake the GitHub readme style
    // TODO buffer if already clicked
    // TODO First! using proxy design mode to add a loading img
    document.querySelector(".title-bar h1").innerHTML = obj.name;
    const releaseURL = `https://github.com/${obj.owner}/${obj.name}/archive/master.zip`;
    const readMeURL = `https://raw.githubusercontent.com/${obj.owner}/${obj.name}/master/README.md`;

    const tmpDir = process.env.TMPDIR;
    let outPath = path.join(tmpDir, `${obj.name}-master.zip`);
    let outFile = fs.createWriteStream(outPath);
    request(releaseURL).pipe(outFile);

    fetchData(readMeURL, data => {
        // Get a readme.md string try convert to html
        // TODO using promise to check if markdown refer a repo image
        // Then using download the image first and in resolve replace it
        // In reject replace with placeholder
        document.querySelector(".detail-content").innerHTML = utils.convertMarkdown(data);
    });
}

function fetchData(url, callback){
    request.get({
        url : url
    }, (err, res, body) => {
        if (err) {console.error(err);return}
        callback(body)
    });
}

function registerSearch(repoList) {
    const bufferInput = (function(){
        // let self = this;
        let ti;
        return function(){
            if (ti){clearTimeout(ti)}
            ti = setTimeout( () => {
                search.call(this);
            }, 600);
        }
    })();
    const search = function(){
        // let self = this;
        // console.log(this);
        let result = [];
        let p = new Promise( (resolve, reject) => {
            let keyword = this.value;
            if (keyword === ''){
                resolve(repoList);
            }
            console.log(keyword);
            let testKey = new RegExp(keyword.toUpperCase());
            repoList.forEach( (v, i) => {
                // console.log(JSON.stringify(v).toUpperCase());
                let upString = JSON.stringify(v).toUpperCase();
                // console.log(upString.search(testKey));
                if ( upString.search(testKey)  !== -1){
                    result.push(v);
                }
                if (i === repoList.length - 1) {
                    resolve(result);
                }
            });
        });
        p.then( data => {
            // console.log(data.length);
            drawList(data);
        }).catch( err => {
            // TODO error handling interaction with users
            console.error("error! ", err);
            drawList(repoList);
        })

    }
    document.querySelector('.list-view input').oninput = bufferInput;
}

main();