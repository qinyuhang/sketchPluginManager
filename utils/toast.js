// TODO 实现一个消息队列
module.exports = {
    "error": function(parrentNode, msg, timeout){
        this.cleanToast(parrentNode);
        setTimeout( () => {
            geneTpl(parrentNode, "red", msg, timeout, {});
            console.error("toast a error");
        }, 0);
    },
    "info": function (parrentNode) {
        this.toastPool.push(5);
        setTimeout( () => {

        }, 0);
        return this.toastPool.length;
    },
    "confirm": function (parrentNode) {
        this.toastPool.push(5);
        setTimeout( () => {

        }, 0);
        return this.toastPool.length;
    },
    "loading": function (parrentNode) {

    },
    "cleanToast": function (parrentNode) {
        if (parrentNode.querySelector('.toast-layer')){
            parrentNode.querySelector('.toast-layer').remove();
        }
    },
    "toastPool" : []
};
// Control timeout should not be in geneTpl, move it to toast func
// This func should just return the tpl string
const geneTpl = function (parentNode, color, msg, timeout, btnObj) {
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