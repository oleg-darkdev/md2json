'use strict';

var fs = require('fs');
var marked = require('marked');
var traverse = require('traverse');

var parse = function(mdContent) {
    var json = marked.lexer(mdContent);
    var currentHeading, headings = [],
        isOrdered = true;
    var output = json.reduce(function(result, item, index, array) {
        switch (item.type) {
            case 'heading':
                if (!currentHeading || item.depth == 1) {
                    headings = [];
                    result[item.text] = {};
                    currentHeading = result[item.text];
                    headings.push(item.text);
                } else {
                    var parentHeading = getParentHeading(headings, item, result);
                    headings = parentHeading.headings;
                    currentHeading = parentHeading.parent;
                    currentHeading[item.text] = {};
                    currentHeading = currentHeading[item.text];
                }
                break;
            case 'list_start':
                isOrdered = item.ordered;
                break;
            default:
                break;
        }
        return result;
    }, {});
    return output;
}
exports.parse = parse;


function getParentHeading(headings, item, result) {
    var parent, index = item.depth - 1;
    var currentHeading = headings[index];
    if (currentHeading) {
        headings.splice(index, headings.length - index);
    }
    headings.push(item.text);
    for (var i = 0; i < index; i++) {
        if (!parent) {
            parent = result[headings[i]];
        } else {
            parent = parent[headings[i]];
        }
    }
    return {
        headings: headings,
        parent: parent
    };
}


function checkNextLine(mdText) {
    if (!mdText.endsWith('\n\n')) {
        mdText += '\n\n';
    }
    return mdText;
}

function toMd(jsonObject) {
    var mdText = '';
    traverse(jsonObject).reduce(function(acc, value) {
        if (this.isLeaf && this.key === 'raw') {
            mdText += value;
        } else {
            mdText += getHash(this.level) + ' ' + this.key + '\n\n';
        }
        return;
    });
    return mdText;
}
exports.toMd = toMd;

function getHash(level) {
    var hash = '';
    for (var i = 0; i < level; i++) {
        hash += '#';
    }
    return hash;
}




console.log(parse('# Hea'))