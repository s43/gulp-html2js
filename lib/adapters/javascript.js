'use strict';
function JSAdapter(opt) {
    this.opt = opt || {};
    this.opt.name = opt.name || '_html_';
    this.lineOffset = 0;
    this.contentParts = [];
    this.separator = new Buffer(opt.separator);
};


function baseName(str)
{
   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1)       
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}

JSAdapter.prototype.getHeader = function () {
    return '//HEAD ' + "\n" +
        'window["' + this.opt.name + '"] = {};' + "\n";
};

JSAdapter.prototype.getFile = function (file, content) {
    return 'window["' + this.opt.name + '"]["' + baseName(file) + '"] = "' + (Buffer.isBuffer(content) ? content : new Buffer(this.escapeContent(content))) + '"; ' + "\n";
};

JSAdapter.prototype.getFooter = function () {
    return "// END ";
};
JSAdapter.prototype.escapeContent = function (content) {
    var quoteChar = '"';
    var indentString = "  ";
    var bsRegexp = new RegExp('\\\\', 'g');
    var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
    var nlReplace = '\\n' + quoteChar + ' +\n' + indentString + indentString + quoteChar;
    return content.replace(bsRegexp, '\\\\').replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace);
}
module.exports = JSAdapter;
