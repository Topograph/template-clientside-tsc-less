/*global console, process, require*/
var fs = require('fs'), colors = require("colors");

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    console.log(`Deleting directory "${path}"...`.underline);
    fs.rmdirSync(path);
  }
};


let deletepath = null;
for(let i = 0; i< process.argv.length; i++) {
    let arg = process.argv[i];
    if(arg.startsWith("--")) {
        deletepath = arg.substr(2);
    }
}

console.warn("clean! -> recursively deleting directory", deletepath.underline.red);

deleteFolderRecursive(deletepath);

console.log("Successfully cleaned output directory!".green.inverse);