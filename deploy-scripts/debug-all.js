var exec = require('child_process').exec,
    child,
    colors = require("colors/safe"),
    watch = require('glob-watcher');

let defaultCommandIdent = "copyfiles"; //default command to be executed when an unknown filechange happened and watch is enabled

//contains all steps to be executed on start
let debugSteps = [
    {
        ident: "clean",
        command: "npm run cleandebug",
        comment: "cleaning the output directory",
        prefix: "clean",
        color: "cyan",
    },
    {
        ident: "tscompile",
        command: "npm run tsbuilddebug",
        comment: "compiling typescript",
        prefix: "TS",
        color: "blue",
        extension: "ts"
    },
    {
        ident: "lesscompile",
        command: "npm run lessbuild",
        comment: "compiling less",
        prefix: "LESS",
        color: "magenta",
        extension: "less"
    },
    {
        ident: "copyfiles",
        command: "npm run copy-stuff-debug",
        comment: "copy all files to debug directory",
        prefix: "COPY",
        color: "yellow"
    }
];


let commandList = [],
    commandIndex = 0,
    watchEnabled = false,
    watcherReady = false,
    commandsRunnding = false;

//read args. supported arg: --watch enables file watcher
for (let i = 0; i < process.argv.length; i++) {
    let arg = process.argv[i];
    console.log(arg);
    if (arg.startsWith("--")) {
        watchEnabled = arg.substr(2) === "watch";
    }
}

commandList = debugSteps; //set commandList to start command list
runNextCommand(); //init command runner on start

//inits watcher 
function initWatcher() {
    var watcher = watch(['./src']); // watches all files
    watcherReady = true;

    watcher.on('change', function (path, stat) {
        if(commandsRunnding) {
            console.log(colors.bold.red(`
            Ignored file change event, because other commands are currently running. 
            Output might not be up to date!`));
            return; 
        }
        console.log(colors.italic.blue("filechange registered", path));
        let lastDot = path.lastIndexOf(".");

        //checks if change was on a file. grabs the file extension if any exists
        let fileExt = null;
        if (lastDot >= 0) {
            fileExt = path.substr(lastDot + 1);
        }
        if (fileExt) {
            runWatcherCommand(fileExt);
        }
        else {
            runWatcherCommand("");
        }

    });
}

function runWatcherCommand(extension) {
    let newcommand = getCommandByExt(extension);
    if (newcommand) {
        commandList.push(newcommand); //run special command if command corresponding to file ext has been found
    }
    else {
        console.log(colors.italic.blue("No special actions found for current file change. Executing default job:", defaultCommandIdent))
        commandList.push(getCommandByIdent(defaultCommandIdent)) // runs default command if no matching extension/command has been found
    };
    runNextCommand(); //starts command
}


function getCommandByExt(extension) {
    for (let cmd in debugSteps) {
        let cmdObj = debugSteps[cmd];
        if (cmdObj.extension === extension) {
            return cmdObj;
        }
    }
    return null;
}

function getCommandByIdent(ident) {
    for (let cmd in debugSteps) {
        let cmdObj = debugSteps[cmd];
        if (cmdObj.ident === ident) {
            return cmdObj;
        }
    }
    return null;
}



function runNextCommand() {
    commandsRunnding = true;
    let cmdObj = commandList[commandIndex];
    console.log(colors.blue.italic("-->" + cmdObj.comment)); //log next command
    runCommand(cmdObj.command, function (out, err) {
        console.log(prefixOutput(out, cmdObj.prefix, cmdObj.color)); //show prefixed output of the command
        console.log(colors.green("command", cmdObj.ident, "finished!"));

        //increase commandIndex and run next one recursively or show finished message
        if (commandList[commandIndex + 1]) {
            commandIndex++;
            runNextCommand();
        }
        else {
            console.log(colors.bold.green("all commands finished!"));
            commandList = [];
            commandIndex = 0;
            commandsRunnding = false;

            //enable watcher if watch has been enabled by call param and watcher is not already running
            if (watchEnabled && !watcherReady) {
                console.log(colors.italic.blue("Watching for file changes..."));
                initWatcher();
            }
        }
    });
}

/**
 * prefixes each line of given output string with given prefix in given color
 * @param {string} output comment to be prefixed
 * @param {string} prefix prefix to be added to each line
 * @param {string} color color string to be (inverse) applied to prefix
 */
function prefixOutput(output, prefix, color) {
    prefix = colors.inverse[color]("[" + prefix + "]");
    return output.split('\n').map(s => `${prefix}  ${s}`).join('\n');
}

function runCommand(command, callback) {
    child = exec(command,
        function (error, stdout, stderr) {
            if (error !== null) {
                console.error(colors.red.bold('Error: ') + error);
            }
            else {
                callback(stdout, stderr);
            }
        });
}
