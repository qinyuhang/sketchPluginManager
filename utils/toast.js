module.exports = {
    "error": function(){
        
    },
    "info": function () {
        
    },
    "confirm": function () {
        
    },
    "clearToast" : function () {
        
    }
};
const geneTpl = function (color, timeout, btnObj) {
    let tpl = [

    ].join('');
    let div = document.createElement('div');
    div.id = "toast";
    document.body.appendChild(div);
    if (timeout) {
        setTimeout( () => {
            document.querySelector('#toast').remove();
        }, timeout);
    }
};