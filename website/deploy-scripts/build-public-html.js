/*global console, process, require*/
var path = require('path'), fs = require('fs'), colors = require('colors');

let PUBLISHER_COMMENT_ADD_START = "<!--%Publish add - START%",
    PUBLISHER_COMMENT_ADD_END = "%Publish add - END-->",
    PUBLISHER_COMMENT_REMOVE_START = "<!-- %Publish remove - START%-->",
    PUBLISHER_COMMENT_REMOVE_END = "<!-- %Publish remove - END%-->";

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

            data = fs.readFileSync(filename, "utf8");
            let filestring = editcomments(data);

            fs.writeFileSync(filename, filestring);
            console.log('Public HTML file '.green + filename.underline.green + ' saved!'.green);
        };
    };
};

function editcomments(contentstring) {
  let filestring = contentstring;
  filestring = publisherAddComment(filestring);
  filestring = publisherRemoveComment(filestring);
  filestring = removeAllComments(filestring);
  filestring = removeEmptyLines(filestring);
  return filestring;
}

function publisherAddComment(contentstring)
{
  var regexStart = new RegExp(PUBLISHER_COMMENT_ADD_START, "g");
  var regexEnd   = new RegExp(PUBLISHER_COMMENT_ADD_END, "g");

    let pubcommentcontent = contentstring.replace(regexStart, "");
    pubcommentcontent = pubcommentcontent.replace(regexEnd, "");

    return pubcommentcontent;
}

function publisherRemoveComment(contentstring)
{
    //TODO: using this regex does not work yet. Figure out why...
    //var regex = new RegExp(PUBLISHER_COMMENT_REMOVE_START + "[\s\S]*?" + PUBLISHER_COMMENT_REMOVE_END , "g");
    //return contentstring.replace(regex, "");

    return contentstring.replace(/<!-- \%Publish remove - START\%-->[\s\S]*?<!-- \%Publish remove - END\%-->/g, "");
}

function removeAllComments(contentstring)
{
    return contentstring.replace(/<!--[\s\S]*?-->/g, "");
}

function removeEmptyLines(contentstring)
{
    return contentstring.replace(/\s+\n/g, "\n");
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
