var CommandJS;
(function (CommandJS) {
    "use strict";
    var CommandExecutor = require('./command-executor');
    var states = require('./states');
    module.exports = {
        ExecutorResponseState: states.ExecutorResponseState,
        ExecutorErrorType: states.ExecutorErrorType,
        executor: function (commands) {
            return new CommandExecutor(commands);
        }
    };
})(CommandJS || (CommandJS = {}));
