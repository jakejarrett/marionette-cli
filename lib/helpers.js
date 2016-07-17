var rigger = require('rigger');
var fs = require('fs');
var simpleGit = require('simple-git')();

/**
 * Creates new file including sources from original one
 *
 * @param {string} file File
 * @param {string} targetPath New file name
 */
exports.rigger = function(file, targetPath) {
    /**
     * what. refactor this.
     */
    rigger(file, { output: targetPath }, function(error, content) {
        if (error) {
            console.log(error);
            return;
        }
        fs.writeFile(targetPath, content, 'utf8');
    });
};

/**
 * Copies file
 *
 * @param {string} file Original file name
 * @param {string} newFileSrc New file name
 */
exports.fileCopy = function(file, newFileSrc) {
    fs.createReadStream(file).pipe(fs.createWriteStream(newFileSrc));
};

/**
 * Clones git repo into folder
 *
 * @param {string} src Path to repo
 * @param {string} folder Folder clone to
 */
exports.gitClone = function(src, folder) {
    simpleGit.clone(src, folder);
};

/**
 * Simple function to determine if we're dealing with windows or not.
 *
 * @returns {*}
 */
exports.userHome = function() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
};

/**
 * Locates the next potential marionette-cli configuration file. (Global, per project, etc)
 *
 * @returns {*}
 */
exports.determineFile = function() {
    var fileLocations = [exports.userHome() + '/.mnrc', process.cwd() + '/.mnrc', __dirname + '/.mnrc',  __dirname + '/config.json'];
    var fsCheck;
    var returnValue;
    var canExit;

    /**
     * Support exists/accessSync
     *
     * Useful for times where people don't have one of these api's (EG/ older node installs)
     */
    if(fs.existsSync) {
        fsCheck = fs.existsSync;
    } else {
        fsCheck = fs.accessSync;
    }

    /**
     * Find the file that exists
     */
    fileLocations.some(function(file) {
        /**
         * If the file can't be found, it will return an exception.
         * But we don't want to kill the process under the circumstance the file isn't found.
         */
        try {
            if(fsCheck(file)) {
                returnValue = file;

                /** Break out of the loop **/
                return true;
            }
        } catch(e) {}
    });

    return returnValue;
};