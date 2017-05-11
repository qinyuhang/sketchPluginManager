const request = require('request');
const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
const shell = require('electron').shell;
require("babel-polyfill");
const JSONStorage = require('node-localstorage').JSONStorage;

let nodeStorage = new JSONStorage(`${process.env.TMPDIR}sketchPluginManager`);

const pluginDir = path.join(process.env.HOME, "Library/Application Support/com.bohemiancoding.sketch3/Plugins");

const utils = require('./utils/index');
let repoBody = Object.create(null);

function main() {
    utils.toast.loading(document.body, undefined, 10000);
    utils.sketchVersion();
    utils.fetchRepo( body => {
        repoBody = JSON.parse(body);
        utils.toast.cleanToast(document.body);
        drawList(repoBody);
        drawLeftBar();
        registerSearch(repoBody);
    });
}


function drawLeftBar(){
    // TODO bind function to left bar
    const obj = {
        "settings": function (node) {
            node.onclick = e => {

            };
        },
        "downloading": function (node) {
            node.onclick = e => {

            };
        },
        "list": function (node) {
            node.onclick = e => {
                if (Object.keys(repoBody)){
                    drawList(repoBody);
                }
            };
        },
        "installed": function (node) {
            node.onclick = e =>{

            };
        }
    };
    Array.prototype.forEach.call(
        document.querySelectorAll(".left-bar div[data-role='btn']"),
        (v, i) => {
            obj[v.getAttribute("data-action")](v);
        }
    );

}

function drawList(repoList){
    // TODO if refresh list should also clean all detail data
    function showDetail(){
        // console.log(this);
        Array.prototype.forEach.call(
            document.querySelectorAll("ul li"),
            (v, i) => {
                v.classList.remove("active");
            }
        );
        this.classList.add("active");
        utils.toast.cleanToast(document.querySelector('.detail-view'));
        document.querySelector('.detail-view .detail-content').innerHTML = "";
        drawDetail(JSON.parse(this.getAttribute("data-src")));
    }
    const registReload = function(){
        document.querySelector(".reload-btn.btn").onclick = (()=>{
            let ti;
            return e => {
                if(ti){clearTimeout(ti)}
                ti = setTimeout(()=>{
                    let cur = Number(e.target.getAttribute("data-cur"));
                    cur += 3600;
                    e.target.setAttribute("data-cur", cur);
                    e.target.style.transform = `rotate(${cur}deg)`;
                    main();
                }, 2000);
            };
        })();
    };
    registReload();

    if (!!document.querySelector("ul")){
        document.querySelector("ul").remove();
    }
    setTimeout( () => {
        let ul = document.createElement("ul");
        document.querySelector(".plugin-list").appendChild(ul);
        let installedPluginObj = Object.create(null);
        utils.importUtil.installed().forEach( v => {
            installedPluginObj[v] = true;
        });
        repoList.forEach( (v, i) => {
            if (!v) {return}
            let li = document.createElement("li");
            li.innerText = v.title || v.name;
            li.setAttribute("data-src", JSON.stringify(v));
            if (installedPluginObj[v.title] || installedPluginObj[v.name]) {
                li.classList.add('installed');
            }
            li.onclick = showDetail;
            document.querySelector(".list-view ul").appendChild(li);
        });
    }, 500);
}

function drawDetail(obj){
    // up detail is information
    // footer detail is markdown to html
    // TODO download the img if related path
    // TODO fake the GitHub readme style
    // TODO First! using proxy design mode to add a loading img
    let totalL = -1;
    let curL = -1;
    let percentage = 0;
    let didToastWhenNoTotalL = false;
    const changeDownloadBTN = function() {
        if (document.querySelector("#install-btn .btn-text").innerText == "Download") {
            document.querySelector("#install-btn .btn-text").innerText = "Cancel";
        }else{
            document.querySelector("#install-btn .btn-text").innerText = "Download";
        }
    };

    const changeDownloadProgress = function() {
        // then change the DOM
        // TODO if totalL = undefined and curL !== -1

        if (totalL == undefined && curL !== -1){
            if (!didToastWhenNoTotalL){
                utils.toast.info(document.body, "Downloading Plugin", 9000);
                didToastWhenNoTotalL = true;
            }
        }
        if (totalL !== -1 && curL !== -1) {
            percentage = Number(curL)/Number(totalL);
            console.log(percentage, curL, totalL);
            document.querySelector("#install-btn .btn-progress").style.width = percentage*100 + "%";
        }
    };

    const changeATag = function() {
        Array.prototype.forEach.call(
            document.querySelectorAll(".detail-content a"),
            (v, i) => {
                v.onclick = e => {
                    e.preventDefault();
                    shell.openExternal(e.target.href);
                }
            }
        );
    };
    document.querySelector("#install-btn .btn-progress").style.width = 0;
    document.querySelector("#install-btn .btn-text").innerText = "Download";

    utils.toast.loading(document.querySelector(".detail-view"),"Loading Readme", 10000);
    document.querySelector(".title-bar h1").innerHTML = obj.name;
    document.querySelector(".title-bar .star-num").innerHTML = "";
    document.querySelector(".title-bar .btn").onclick = e => {
        changeDownloadBTN();
        utils.GitHubAPI.DownloadZip(obj.owner, obj.name, {
            "totalLength" : function (totalLeng) {
                totalL = totalLeng;
            },
            "currentLength": function (curLeng) {
                curL = curLeng;
                if (totalL !== -1){
                    changeDownloadProgress();
                }
            },
            "finishs" : function (ZIPpath) {
                fs.createReadStream(ZIPpath)
                    .pipe(unzip.Extract({path: pluginDir}))
                    .on('close', () => {
                        fs.rename(
                            path.join(pluginDir, obj.name + '-master'),
                            path.join(pluginDir, obj.name),
                            (err, data) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                    });
                utils.toast.info(document.body, "Download Succeed!", 3000);
            }
        })
    };
    if (nodeStorage.getItem(obj.name)) {
        utils.toast.cleanToast(document.querySelector(".detail-view"));
        document.querySelector(".detail-content").innerHTML = utils.convertMarkdown(nodeStorage.getItem(obj.name));
        changeATag();
    }else{
        utils.GitHubAPI.GetReadMe(obj.owner, obj.name, data => {
            utils.toast.cleanToast(document.querySelector(".detail-view"));
            document.querySelector(".detail-content").innerHTML = utils.convertMarkdown(data);
            changeATag();
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