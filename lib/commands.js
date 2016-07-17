var fs = require('fs-extra');
var path = require('path');
var helpers = require('./helpers');

/** Asynchronously load the file **/
var config = JSON.parse(fs.readFileSync(helpers.determineFile(), 'utf8'));

/**
 * Export the functions
 */
module.exports = {

    /**
     * Sets module type
     *
     * @param {string} type
     */
    setType: function(type) {
        /** define if put type is present in config **/
        if (config.moduleTypes[type] !== undefined) {
            config.moduleType = type;

            fs.writeFile(helpers.determineFile(), JSON.stringify(config, null, 4), 'utf8', function (err) {
                if (err) return console.log(err);
                return console.log("Successfully set module type as %s", type);
            });
        } else {
            return console.log('Wrong type, available types: %j', config.moduleTypes);
        }
    },

    /**
     * Generates new app
     *
     * @param {string} folder
     */
    newApp: function(folder) {
        var appPath;
        var type = config.moduleType;
        var appSrc = config.apps[type];

        if (folder) {
            if (path.isAbsolute(folder)) {
                appPath = path.join(folder);
            } else {
                appPath = path.join(process.cwd(), folder);
            }
        } else {
            appPath = path.join(process.cwd());
        }

        /**
         * Clone the boilerplate for the new app.
         */
        helpers.gitClone(appSrc, appPath);
    },

    /**
     * Generates file
     *
     * @param {string} folder
     * @param {Object} cmd
     */
    generate: function(folder, cmd) {
        /**
         * Define the variables
         */
        var argOption;
        var argValue;
        var newFileSrc;
        var type = config.moduleType;

        /**
         * Define file type (layout, model, collection etc) and name from command
         */
        for (var i = 0; i < config.generateOptions.length; i++) {
            var option = config.generateOptions[i];

            if (cmd[option]) {
                argOption = option;
                argValue = cmd[option];
                break;
            }
        }

        /**
         * Setup the variables for where the generators are located
         * (Determined inside the .mnrc or config.json files)
         *
         * Then we're going to check if the file exists.
         */
        var generatorDir = path.resolve(config.moduleTypes[type].dir);
        var sourceFile = argOption + '.js';
        var fileSrc = path.join(generatorDir, 'generators', type, sourceFile);
        var fileName = argOption;

        /**
         * Changing file name if it was set
         */
        if (typeof argValue !== 'boolean') fileName = argValue;
        fileName = fileName + '.js';

        if (folder) {
            if (path.isAbsolute(folder)) {
                newFileSrc = path.join(folder, fileName);
            } else {
                newFileSrc = path.join(process.cwd(), folder, fileName);
            }
        } else {
            newFileSrc = path.join(process.cwd(), fileName);
        }

        /**
         * TODO- Refactor .exists (DEPRECATED)
         */
        fs.exists(newFileSrc, function(exists) {
            if (exists) {
                return console.log('File with name %s already exists', fileName);
            } else {
                /**
                 * TODO- Refactor this, as we already know the type exists at this point & its only a conditional on es6.
                 */
                switch(type) {
                    case 'rjs':
                    case 'cjs':
                        helpers.rigger(fileSrc, newFileSrc);
                        break;
                    case 'es6':
                        helpers.fileCopy(fileSrc, newFileSrc);
                        break;
                    default:
                        return console.log('Wrong module type');
                }
            }
        });
    }

};
