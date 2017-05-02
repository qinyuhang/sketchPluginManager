const request = require('request');
const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
require("babel-polyfill");
const JSONStorage = require('node-localstorage').JSONStorage;

let nodeStorage = new JSONStorage(`${process.env.TMPDIR}sketchPluginManager`);

// const detailView = require('./view/detail');

const utils = require('./utils/index');

function main() {
    utils.toast.loading(document.body, undefined, 10000);
    drawLeftBar();
    utils.sketchVersion();
    utils.fetchRepo( body => {
        let repoBody = JSON.parse(body);
        utils.toast.cleanToast(document.body);
        drawList(repoBody);
        registerSearch(repoBody);
    });
}


function drawLeftBar(){

}

let readfff = async function(){
    let x = await fs.readFileSync('package.json');
    return x;
};

function drawList(repoList){
    // TODO if refresh list should also clean all detail data
    if (!!document.querySelector("ul")){
        document.querySelector("ul").remove();
    }

    let ul = document.createElement("ul");
    document.querySelector(".plugin-list").appendChild(ul);
    repoList.forEach( (v, i) => {
        if (!v) {return}
        let li = document.createElement("li");
        li.innerHTML = v.title || v.name;
        li.setAttribute("data-src", JSON.stringify(v));
        li.onclick = showDetail;
        document.querySelector(".list-view ul").appendChild(li)
    });
    function showDetail(){
        // console.log(this);
        Array.prototype.forEach.call(
            document.querySelectorAll("ul li"),
            v => {
                v.classList.remove("active");
            }
        );
        this.classList.add("active");
        utils.toast.cleanToast(document.querySelector('.detail-view'));
        document.querySelector('.detail-view .detail-content').innerHTML = "";
        drawDetail(JSON.parse(this.getAttribute("data-src")));
    }
}

function drawDetail(obj){
    // up detail is information
    // footer detail is markdown to html
    // TODO download the img if related path
    // TODO fake the GitHub readme style
    // TODO First! using proxy design mode to add a loading img
    utils.toast.loading(document.querySelector(".detail-view"),"Loading Readme", 10000);
    document.querySelector(".title-bar h1").innerHTML = obj.name;
    document.querySelector(".title-bar .star-num").innerHTML = "";
    document.querySelector(".title-bar .btn").onclick = () => {
        utils.GitHubAPI.DownloadZip(obj.owner, obj.name);
    };
    if (nodeStorage.getItem(obj.name)) {
        utils.toast.cleanToast(document.querySelector(".detail-view"));
        document.querySelector(".detail-content").innerHTML = utils.convertMarkdown(nodeStorage.getItem(obj.name));
    }else{
        utils.GitHubAPI.GetReadMe(obj.owner, obj.name, data => {
            utils.toast.cleanToast(document.querySelector(".detail-view"));
            document.querySelector(".detail-content").innerHTML = utils.convertMarkdown(data);
            nodeStorage.setItem(obj.name, data);
        });
    }
    if (nodeStorage.getItem(`${obj.name}_info`)) {
        document.querySelector(".title-bar .star-num").innerHTML
            = JSON.parse(nodeStorage.getItem(`${obj.name}_info`)).stargazers_count;
    }else{
        utils.GitHubAPI.GetRepoInfo(obj.owner, obj.name, data => {
            document.querySelector(".title-bar .star-num").innerHTML
                = JSON.parse(data).stargazers_count;
            nodeStorage.setItem(`${obj.name}_info`, data);
        });
    }
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
        };
    })();
    const search = function (){
        // let self = this;
        // console.log(this);
        let result = [];
        let p = new Promise( (resolve, reject) => {
            let keyword = this.value;
            if (keyword === ""){
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

    };
    document.querySelector(".list-view input").oninput = bufferInput;
}

main();