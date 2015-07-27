/// <reference path="../definitions/command-definitions.d.ts"/>
var CommandJs;
(function (CommandJs) {
    "use strict";
    var CommandExecutorImpl = (function () {
        function CommandExecutorImpl(commands) {
            if (commands && !(commands instanceof Array)) {
                throw 'An array of commands is required';
            }
            this.commands = commands;
        }
        return CommandExecutorImpl;
    })();
    CommandJs.CommandExecutorImpl = CommandExecutorImpl;
})(CommandJs || (CommandJs = {}));

var CommandJs;
(function (CommandJs) {
    "use strict";
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = {
            executor: function (commands) {
                return new CommandJs.CommandExecutorImpl(commands);
            }
        };
    }
})(CommandJs || (CommandJs = {}));
