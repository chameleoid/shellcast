var document = require('./dummy-dom');
var term = require('term.js');

term.Terminal.defaults.scrollback = 0;
term.Terminal.defaults.cursorBlink = false;
term.Terminal.prototype.refresh = function() {};

module.exports = term;
