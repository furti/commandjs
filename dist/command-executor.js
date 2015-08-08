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
        CommandExecutorImpl.prototype.execute = function (commandString) {
            var parsed = this.parse(commandString);
            var commandParts = this.getCommandParts(parsed);
            if (!commandParts) {
                return {
                    state: states.ExecutorResponseState.ERROR,
                    errorType: states.ExecutorErrorType.PARSER_ERROR,
                    commandString: commandString
                };
            }
            var commandResponse = this.findCommand(commandParts, true);
            if (commandResponse.state === states.ExecutorResponseState.ERROR) {
                commandResponse.commandString = commandString;
                return commandResponse;
            }
            try {
                var command = commandResponse.response;
                var executionResponse = command.execute(this.buildExecutionContext());
                return {
                    state: states.ExecutorResponseState.SUCCESS,
                    commandString: commandString,
                    response: executionResponse
                };
            }
            catch (e) {
                return {
                    state: states.ExecutorResponseState.ERROR,
                    errorType: states.ExecutorErrorType.COMMAND_EXECUTION_ERROR,
                    commandString: commandString,
                    response: e
                };
            }
        };
        CommandExecutorImpl.prototype.getCommand = function (commandString) {
            var commandParts = this.getCommandParts(this.parse(commandString));
            if (!commandParts) {
                return {
                    state: states.ExecutorResponseState.ERROR,
                    errorType: states.ExecutorErrorType.PARSER_ERROR,
                    commandString: commandString
                };
            }
            var commandResponse = this.findCommand(commandParts, false);
            commandResponse.commandString = commandString;
            return commandResponse;
        };
        CommandExecutorImpl.prototype.buildExecutionContext = function () {
            return {
                parameters: {},
                options: {}
            };
        };
        CommandExecutorImpl.prototype.findCommand = function (commandParts, paramsAllowed) {
            if (!commandParts) {
                return null;
            }
            var actualCommand;
            var current = this.commands;
            var i;
            var part;
            for (i in commandParts) {
                part = commandParts[i];
                if (current[part]) {
                    actualCommand = current[part];
                    if (actualCommand.subCommands) {
                        current = actualCommand.subCommands;
                    }
                    else if (!paramsAllowed && i < commandParts.length - 1) {
                        return {
                            state: states.ExecutorResponseState.ERROR,
                            errorType: states.ExecutorErrorType.COMMAND_NOT_FOUND
                        };
                    }
                }
                else {
                    var response = {
                        state: states.ExecutorResponseState.ERROR,
                        errorType: states.ExecutorErrorType.COMMAND_NOT_FOUND
                    };
                    if (current) {
                        response.response = Object.keys(current);
                    }
                    return response;
                }
            }
            return {
                state: states.ExecutorResponseState.SUCCESS,
                response: actualCommand.command
            };
        };
        CommandExecutorImpl.prototype.parse = function (commandString) {
            if (!commandString) {
                return [];
            }
            return commandParser.parse(commandString.trim());
        };
        CommandExecutorImpl.prototype.getCommandParts = function (parseResults) {
            if (!parseResults || parseResults.length === 0) {
                return null;
            }
            for (var _i = 0; _i < parseResults.length; _i++) {
                var result = parseResults[_i];
                if (result.type === 'COMMAND_PARAM') {
                    return result.values;
                }
            }
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
    CommandJS.CommandExecutorImpl = CommandExecutorImpl;
    module.exports = CommandExecutorImpl;
})(CommandJS || (CommandJS = {}));
