var fs = require('fs');
var Commander = require('./commander_');
var helpers = require('./helpers');

/**
 * Runs the command line interface / CLI
 *
 * @param {Array} options Command options
 */
exports.run = function(options) {
    /** Config files **/
    var config = JSON.parse(fs.readFileSync(helpers.determineFile(), 'utf8'));

    var program = new Commander();

    /** Hack to emulate process.argv **/
    if (options) options.unshift('', '');

    /** Process short command names **/
    var args = options || process.argv.slice();
    var command = args[2];
    var validCommand = config.aliases[command];

    if (validCommand) args[2] = validCommand;

    program.parse(args);
};