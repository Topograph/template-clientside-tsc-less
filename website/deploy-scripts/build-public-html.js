/*global console, process, require*/
var path = require('path'), fs = require('fs'), colors = require('colors');

let PUBLISHER_COMMENT_ADD_START = "<!--$Publish add - START$",
    PUBLISHER_COMMENT_ADD_END = "$Publish add - END-->",
    PUBLISHER_COMMENT_REMOVE_START = "<!-- $Publish remove - START$-->",
    PUBLISHER_COMMENT_REMOVE_END = "<!-- $Publish remove - END$-->";

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
            console.log('-- found: ', filename);

            fs.readFile(filename, "utf8", function (err, data)
            {
                if (err)
                {
                    console.error("HTML-Publisher Error: ", err.red);
                }
                let filestring = data;

                filestring = publisherAddComment(filestring);
                filestring = publisherRemoveComment(filestring);
            });
        };
    };
};

function publisherAddComment(contentstring)
{
    let pubcommentcontent = contentstring.substr(contentstring.indexOf(PUBLISHER_COMMENT_ADD_START) + PUBLISHER_COMMENT_ADD_START.length, contentstring.indexOf(PUBLISHER_COMMENT_ADD_END) - contentstring.indexOf(PUBLISHER_COMMENT_ADD_START) - PUBLISHER_COMMENT_ADD_START.length);
    console.log(pubcommentcontent);

    return null;
}

function publisherRemoveComment(contentstring)
{
    return null;
}

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




fromDir(outpath, '.html');