var Commander = require('./commander_');
var config = require('./config.json');

/**
 * Runs the command line interface / CLI
 *
 * @param {Array} options Command options
 */
exports.run = function(options) {
    var program = new Commander();

    if (options) {
        /** Hack to emulate process.argv **/
        options.unshift('', '');
    }

    /** Process short command names **/
    var args = options || process.argv.slice();
    var command = args[2];
    var validCommand = config.aliases[command];

    if (validCommand) args[2] = validCommand;

    program.parse(args);
};