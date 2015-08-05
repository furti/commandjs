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
    var commandParser = _dereq_('./command-parser');
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
                return commandResponse.response;
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
                    return {
                        state: states.ExecutorResponseState.ERROR,
                        errorType: states.ExecutorErrorType.COMMAND_NOT_FOUND,
                        response: Object.keys(actualCommand.subCommands)
                    };
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

},{"./command-parser":2,"./states":4}],2:[function(_dereq_,module,exports){
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = [],
        peg$c1 = peg$FAILED,
        peg$c2 = " ",
        peg$c3 = { type: "literal", value: " ", description: "\" \"" },
        peg$c4 = function(c) {return c;},
        peg$c5 = function(c, c1) {
            if(c1) {
              return toCommand([c].concat(c1))
            }
            else {
              return toCommand([c])
            }
          },
        peg$c6 = /^[^" "]/,
        peg$c7 = { type: "class", value: "[^\" \"]", description: "[^\" \"]" },
        peg$c8 = function(c) {return c.join("")},

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0, s1;

      s0 = [];
      s1 = peg$parsecommandsOrParams();
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$parsecommandsOrParams();
        }
      } else {
        s0 = peg$c1;
      }

      return s0;
    }

    function peg$parsecommandsOrParams() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsecommandOrParam();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = [];
        if (input.charCodeAt(peg$currPos) === 32) {
          s5 = peg$c2;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c3); }
        }
        if (s5 !== peg$FAILED) {
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (input.charCodeAt(peg$currPos) === 32) {
              s5 = peg$c2;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c3); }
            }
          }
        } else {
          s4 = peg$c1;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parsecommandOrParam();
          if (s5 !== peg$FAILED) {
            peg$reportedPos = s3;
            s4 = peg$c4(s5);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c1;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c1;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = [];
          if (input.charCodeAt(peg$currPos) === 32) {
            s5 = peg$c2;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c3); }
          }
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              if (input.charCodeAt(peg$currPos) === 32) {
                s5 = peg$c2;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c3); }
              }
            }
          } else {
            s4 = peg$c1;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsecommandOrParam();
            if (s5 !== peg$FAILED) {
              peg$reportedPos = s3;
              s4 = peg$c4(s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c1;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c1;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c5(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c1;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c1;
      }

      return s0;
    }

    function peg$parsecommandOrParam() {
      var s0;

      s0 = peg$parsecharacters();

      return s0;
    }

    function peg$parsecharacters() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c6.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c7); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c6.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c7); }
          }
        }
      } else {
        s1 = peg$c1;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c8(s1);
      }
      s0 = s1;

      return s0;
    }


      function toCommand(c) {
        return {
          type: "COMMAND_PARAM",
          values: c
        };
      }



    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();
},{}],3:[function(_dereq_,module,exports){
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

},{"./command-executor":1,"./states":4}],4:[function(_dereq_,module,exports){
var CommandJS;
(function (CommandJS) {
    (function (ExecutorResponseState) {
        ExecutorResponseState[ExecutorResponseState["SUCCESS"] = 0] = "SUCCESS";
        ExecutorResponseState[ExecutorResponseState["ERROR"] = 1] = "ERROR";
    })(CommandJS.ExecutorResponseState || (CommandJS.ExecutorResponseState = {}));
    var ExecutorResponseState = CommandJS.ExecutorResponseState;
    (function (ExecutorErrorType) {
        ExecutorErrorType[ExecutorErrorType["COMMAND_NOT_FOUND"] = 0] = "COMMAND_NOT_FOUND";
        ExecutorErrorType[ExecutorErrorType["PARSER_ERROR"] = 1] = "PARSER_ERROR";
        ExecutorErrorType[ExecutorErrorType["COMMAND_EXECUTION_ERROR"] = 2] = "COMMAND_EXECUTION_ERROR";
    })(CommandJS.ExecutorErrorType || (CommandJS.ExecutorErrorType = {}));
    var ExecutorErrorType = CommandJS.ExecutorErrorType;
    module.exports = {
        ExecutorResponseState: ExecutorResponseState,
        ExecutorErrorType: ExecutorErrorType
    };
})(CommandJS || (CommandJS = {}));

},{}]},{},[3])
(3)
});