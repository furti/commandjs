/// <reference path="../definitions/command-definitions.d.ts"/>
var CommandJs;
(function (CommandJs) {
    "use strict";
    var CommandExecutorImpl = (function () {
        function CommandExecutorImpl(commands) {
            if (commands && !(commands instanceof Array)) {
                throw 'An array of commands is required';
            }
            this.commands = this.prepareCommands(commands);
        }
        CommandExecutorImpl.prototype.getCommand = function (commandString) {
            return null;
        };
        CommandExecutorImpl.prototype.prepareCommands = function (commands) {
            if (!commands) {
                return;
            }
            var self = this;
            var commandMap = {};
            commands.forEach(function (command) {
                commandMap[command.name] = {
                    command: command
                };
                if (command.subCommands) {
                    commandMap[command.name].subCommands = self.prepareCommands(command.subCommands);
                }
            });
            return commandMap;
        };
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
