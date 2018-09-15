
'use strict';


  var md2json = require('./lib/md2json.js');


module.exports = function(files, options) {

    // var options = this.options({
    //   minify: false,
    //   width: 50
    // });

    files.forEach(function(f) {
      options.outfile = 'build/header.md';
      try {
        md2json.parse(f.src, options);
        console.log('annotations file created at ' + options.outfile);
      } catch(e) {
        console.log(e)
      }

    });

  };




