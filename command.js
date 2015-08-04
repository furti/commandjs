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
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.CommandJS=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/// <reference path="../../typings/commandjs/command-definitions.d.ts"/>
var CommandJS;
(function (CommandJS) {
    "use strict";
    var states = _dereq_('./states');
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

},{"./states":3}],2:[function(_dereq_,module,exports){
var CommandJS;
(function (CommandJS) {
    "use strict";
    var CommandExecutor = _dereq_('./command-executor');
    var states = _dereq_('./states');
    module.exports = {
        ExecutorResponseState: states.ExecutorResponseState,
        ExecutorErrorType: states.ExecutorErrorType,
        executor: function (commands) {
            return new CommandExecutor(commands);
        }
    };
})(CommandJS || (CommandJS = {}));

},{"./command-executor":1,"./states":3}],3:[function(_dereq_,module,exports){
var CommandJS;
(function (CommandJS) {
    (function (ExecutorResponseState) {
        ExecutorResponseState[ExecutorResponseState["SUCCESS"] = 0] = "SUCCESS";
        ExecutorResponseState[ExecutorResponseState["ERROR"] = 1] = "ERROR";
    })(CommandJS.ExecutorResponseState || (CommandJS.ExecutorResponseState = {}));
    var ExecutorResponseState = CommandJS.ExecutorResponseState;
    (function (ExecutorErrorType) {
        ExecutorErrorType[ExecutorErrorType["COMMAND_NOT_FOUND"] = 0] = "COMMAND_NOT_FOUND";
    })(CommandJS.ExecutorErrorType || (CommandJS.ExecutorErrorType = {}));
    var ExecutorErrorType = CommandJS.ExecutorErrorType;
    module.exports = {
        ExecutorResponseState: ExecutorResponseState,
        ExecutorErrorType: ExecutorErrorType
    };
})(CommandJS || (CommandJS = {}));

},{}]},{},[2])
(2)
});