

const options = {
                minify: false,
                width: 60,
                outfile : 'build/header.json'
            };

const file = './src/header.md';



const conv = (files, options) => {
	const path = require('path'),
    os = require('os'),
    fs = require('fs'),
    marked = require('marked'),
    _ = require('lodash');

 
let      annotations = [];



function parseText(file) {

      let text = fs.readFileSync(file, 'utf8');
      let lines = text.split(os.EOL);
      let pre = "-- ";
      let annotation = {

        'el': '',
        'title': '',
        'comment': ''
		// 'Имя': '',
	 //    'Github': '',
	 //    'Email': '',
	 //    'Slack': '',  
	 //    'Other': ''
      };

      _(lines).each(function(line, i) {
          if (line.indexOf(pre) !== -1) {
            if (annotation.el && annotation.el !== '') {
              annotations.push(annotation);
            }
            entry = line.replace(pre, '').split(":");
            annotation[entry[0]] = entry[1];
            if (i == lines.length - 1) {
              annotations.push(annotation);
            }
          } else {
            annotation['comment'] = annotation.comment + line ;
          }
      });

      return annotations;
    }


// console.log(parseText(file));
parseText(file);



function writeFile(annotations, options) {

      let json;

      if (options.minify) {
          json = JSON.stringify(annotations);
      } else {
          json = JSON.stringify(annotations, null, 2) + "\n";
      }

      let content = "let comments = { \"comments\":" + json + "};";

      if (options.outfile) {
          let file = fs.openSync(options.outfile, 'w+');
          fs.writeSync(file, content);
          fs.closeSync(file);
          return;
      } else {
          return json;
      }

}

writeFile(annotations, options);

};


conv (file, options );