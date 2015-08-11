/// <reference path="../../typings/commandjs/command-definitions.d.ts"/>
var CommandJS;
(function (CommandJS) {
    "use strict";
    var states = require('./states');
    var commandParser = require('./command-parser');
    var commandIndex = require('./command-index');
    var CommandExecutorImpl = (function () {
        function CommandExecutorImpl(commands) {
            if (commands && !(commands instanceof Array)) {
                throw 'An array of commands is required';
            }
            this.commands = this.prepareCommands(commands);
            this.index = new commandIndex(commands);
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
                var command = commandResponse['command'];
                var result = command.execute(this.buildExecutionContext(command, commandResponse['parameters']));
                return {
                    state: states.ExecutorResponseState.SUCCESS,
                    commandString: commandString,
                    result: result
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
        CommandExecutorImpl.prototype.autocomplete = function (commandString) {
            var commandParts = this.getCommandParts(this.parse(commandString));
            if (!commandParts) {
                return {
                    state: states.ExecutorResponseState.ERROR,
                    errorType: states.ExecutorErrorType.PARSER_ERROR,
                    commandString: commandString
                };
            }
            var possibleCommands = this.index.search(commandParts);
            if (!possibleCommands || possibleCommands.length === 0) {
                return {
                    state: states.ExecutorResponseState.ERROR,
                    errorType: states.ExecutorErrorType.COMMAND_NOT_FOUND,
                    commandString: commandString
                };
            }
            return {
                state: states.ExecutorResponseState.SUCCESS,
                commandString: commandString,
                possibleCommands: possibleCommands
            };
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
        CommandExecutorImpl.prototype.buildExecutionContext = function (command, paramValues) {
            var parameters = {};
            if (paramValues) {
                for (var i in paramValues) {
                    parameters[command.parameters[i].name] = paramValues[i];
                }
            }
            return {
                parameters: parameters,
                options: {}
            };
        };
        CommandExecutorImpl.prototype.findCommand = function (commandParts, paramsAllowed) {
            if (!commandParts) {
                return null;
            }
            var actualCommand;
            var params;
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
                    if (!paramsAllowed || !actualCommand || !actualCommand.command.parameters) {
                        var response = {
                            state: states.ExecutorResponseState.ERROR,
                            errorType: states.ExecutorErrorType.COMMAND_NOT_FOUND
                        };
                        if (current) {
                            response['availableCommands'] = Object.keys(current);
                        }
                        return response;
                    }
                    else {
                        params = commandParts.slice(i);
                        break;
                    }
                }
            }
            return {
                state: states.ExecutorResponseState.SUCCESS,
                command: actualCommand.command,
                parameters: params
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
