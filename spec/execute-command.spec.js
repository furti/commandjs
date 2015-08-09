var CommandExecutorSpec;
(function (CommandExecutorSpec) {
    describe('execute command', function () {
        var commandExecutorBuilder = require('../dist/index');
        var commandExecutor = commandExecutorBuilder.executor;
        var responseValidator = require('./helpers/response-validator-helper');
        var executeFunctionHelper = require('./helpers/execute-function-helper');
        var commands = [
            {
                name: 'first',
                subCommands: [{
                        name: 'firstSub',
                        parameters: [{
                                name: 'color'
                            }, {
                                name: 'size'
                            }],
                        execute: executeFunctionHelper.createExecutionFunction('moo')
                    }]
            }, {
                name: 'second',
                execute: executeFunctionHelper.createExecutionFunction('awesome test string')
            }];
        var executor = commandExecutor(commands);
        it('second', function () {
            var response = executor.execute('second');
            responseValidator.successResponse(response);
            executeFunctionHelper.validateResult(response['result'], {
                customReturnValue: 'awesome test string'
            });
        });
        it('first firstSub brown', function () {
            var response = executor.execute('first firstSub brown');
            responseValidator.successResponse(response);
            executeFunctionHelper.validateResult(response['result'], {
                customReturnValue: 'moo',
                parameters: {
                    color: 'brown'
                }
            });
        });
        it('first firstSub black small', function () {
            var response = executor.execute('first firstSub black small');
            responseValidator.successResponse(response);
            executeFunctionHelper.validateResult(response['result'], {
                customReturnValue: 'moo',
                parameters: {
                    color: 'black',
                    size: 'small'
                }
            });
        });
        it('first unkonwn', function () {
            var response = executor.execute('first unknown');
            responseValidator.errorResponse(response, ['firstSub']);
        });
        it('another unknown', function () {
            var response = executor.execute('another unknown');
            responseValidator.errorResponse(response, ['first', 'second']);
        });
    });
})(CommandExecutorSpec || (CommandExecutorSpec = {}));
