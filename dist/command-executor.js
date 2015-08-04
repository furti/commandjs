/// <reference path="../../typings/commandjs/command-definitions.d.ts"/>
var CommandJS;
(function (CommandJS) {
    "use strict";
    var states = require('./states');
    var commandParser = require('./command-parser');
    var CommandExecutorImpl = (function () {
        function CommandExecutorImpl(commands) {
            if (commands && !(commands instanceof Array)) {
                throw 'An array of commands is required';
            }
            this.commands = this.prepareCommands(commands);
        }
        CommandExecutorImpl.prototype.getCommands = function () {
            return this.commands;
        };
        CommandExecutorImpl.prototype.getCommand = function (commandString) {
            return {
                state: states.ExecutorResponseState.SUCCESS
            };
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
    CommandJS.CommandExecutorImpl = CommandExecutorImpl;
    module.exports = CommandExecutorImpl;
})(CommandJS || (CommandJS = {}));
