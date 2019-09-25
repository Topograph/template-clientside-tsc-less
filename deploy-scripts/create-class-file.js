/*global require, console */
var inquirer = require('inquirer');
var colors = require("colors");
var fs = require('fs');
var pjson = require('../package.json');
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;

let namespace = pjson.namespace;

let templateNS = `
    namespace $namespace$ 
    {
        $classname$ 
        {
            constructor() 
            {

            }
        }
    }`,
    templateNoNS = `
        $classname$ 
        {
            constructor() 
            {

            }
        }`;


inquirer
    .prompt([
        {
            type: 'input',
            name: 'path',
            message: "Create at path:",
            default: "src/ts/"
        },
        {
            type: 'input',
            name: 'classname',
            message: 'Class Name',
            validate: function (value)
            {
                let regexp =RegExp(/^[A-Z][a-zA-Z0-9$]+$/);
                // let regexp =RegExp('(^[A-Z][a-zA-Z0-9$/]+(?<!\/)$)');
                let valid = regexp.test(value); // eslint-disable-line //StartsWith Uppercase letter and contains only valid alphanumerics and does not end with a slash    //
                if (valid)
                {
                    return true;
                }

                return 'Please enter a valid class name. Must start with uppercase letter. No special characters. Can contain slashes to indicate subfolders';
            }
        },
        {
            type: 'confirm',
            name: 'export',
            message: "export class?",
            default: false
        }
    ])
    .then(answers =>
    {
        let classname = (answers.export ? "export " : "") + "class " + answers.classname;
        if(!answers.path.endsWith("/")) {
            answers.path += "/";
        }
        let fileName = answers.path + answers.classname.charAt(0).toLowerCase() + answers.classname.slice(1) + ".ts";

        let fileContent = templateNoNS;
        if (namespace)
        {
            fileContent = templateNS;
            fileContent = fileContent.replace("$namespace$", namespace);
        }


        fileContent = fileContent.replace("$classname$", classname)

        writeFile(fileName, fileContent);

        function writeFile(path, contents)
        {
            mkdirp(getDirName(path), function (err)
            {
                if (err) return cb(err);

                fs.writeFileSync(path, contents);
                console.log("File".green,fileName.underline.green, "successfully created".green);
            });
        }

    });
