/**@license
The MIT License (MIT)

Copyright (c) 2015 Daniel Furtlehner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/// <reference path="../../typings/commandjs/command-definitions.d.ts"/>
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
        CommandExecutorImpl.prototype.getCommands = function () {
            return this.commands;
        };
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
