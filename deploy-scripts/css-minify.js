/*global console, process, require*/
var crass = require('crass');
var fs = require('fs'), path = require('path'), colors = require('colors');

function fromDir(startPath, filter)
{

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath))
    {
        console.log("no directory: ".red, startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++)
    {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory())
        {
            fromDir(filename, filter); //recurse
        }
        else if (filename.indexOf(filter) >= 0)
        {
            let data = fs.readFileSync(filename, "utf8");

            let parsed = crass.parse(data);

            parsed = parsed.optimize();

            fs.writeFileSync(filename, parsed.toString());

            console.log("successfully minified".gray, filename.underline.gray);
        };
    };
};

let outpath = null;
for (let i = 0; i < process.argv.length; i++)
{
    let arg = process.argv[i];
    console.log(arg);
    if (arg.startsWith("--"))
    {
        outpath = arg.substr(2);
    }
}

fromDir(outpath, '.css');

console.log("successfully minified all css".green);

