const showdown  = require('showdown');
const GitHubAPI = require('./GitHubAPI');
const converter = new showdown.Converter();
module.exports = function(markdownString) {
    // TODO grep all <a> and <img>
    // and deal with click a make the app a browser
    // and deal with img refer local img end with not find should change it with GitHub file link?
    return converter.makeHtml(markdownString);
};