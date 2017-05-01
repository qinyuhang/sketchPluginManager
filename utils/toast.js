module.exports = {
    "error": function(parentNode, msg, timeout){
        this.cleanToast(parentNode);
        geneTpl(parentNode, msg, timeout, {});
        console.error("toast a error");
    },
    "info": function (parentNode, msg, timeout) {
        this.cleanToast(parentNode);
        geneTpl(parentNode, msg, timeout, {});
        console.info("toast a error");
    },
    "confirm": function (parentNode, msg, timeout) {
        this.cleanToast(parentNode);
        geneTpl(parentNode, msg, timeout, {});
        console.log("toast a error");
    },
    "loading": function (parentNode, msg, timeout) {
        this.cleanToast(parentNode);
        geneTpl(parentNode, "red", msg || "Loading resources", timeout, {});
        console.log("toast a loading");
    },
    "cleanToast": function (parentNode) {
        if (parentNode.querySelector('.toast-layer')){
            parentNode.querySelector('.toast-layer').remove();
        }
    }
};
// Control timeout should not be in geneTpl, move it to toast func
// This func should just return the tpl string
const geneTpl = function (parentNode, msg, timeout, btnObj) {
    let tpl = `<div class="toast"><div class="toast-img"></div><div class="toast-text">${msg}</div></div>`;
    let div = document.createElement('div');
    div.className = "toast-layer";
    div.innerHTML = tpl;
    parentNode.appendChild(div);
    setTimeout( () => {
        div.querySelector(".toast").classList.add("animation");
    }, 0);
    setTimeout( () => {
        document.querySelector('.toast-layer').remove();
    }, timeout || 3000);
};