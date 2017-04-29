const showdown  = require('showdown');
const converter = new showdown.Converter();
module.exports = function(markdownString) {
    return converter.makeHtml(markdownString);
};