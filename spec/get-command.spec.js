var CommandExecutorSpec;
(function (CommandExecutorSpec) {
    describe('Test getCommand function', function () {
        var commandExecutorBuilder = require('../dist/index');
        var commandExecutor = commandExecutorBuilder.executor;
        var states = commandExecutorBuilder.ExecutorResponseState;
        var responseValidator = require('./helpers/response-validator-helper');
        var executor = commandExecutor([{
                name: 'git',
                subCommands: [{
                        name: 'init'
                    }, {
                        name: 'remote',
                        subCommands: [{
                                name: 'add'
                            }, {
                                name: 'remove'
                            }]
                    }]
            }]);
        it('git', function () {
            var response = executor.getCommand('git');
            responseValidator.successResponse(response);
            responseValidator.checkCommand(response.response, 'git');
        });
        it('git init', function () {
            var response = executor.getCommand('git init');
            responseValidator.successResponse(response);
            responseValidator.checkCommand(response.response, 'init');
        });
        it('git remote add', function () {
            var response = executor.getCommand('git remote add');
            responseValidator.successResponse(response);
            responseValidator.checkCommand(response.response, 'add');
        });
        it('git remote rename', function () {
            var response = executor.getCommand('git remote rename');
            responseValidator.errorResponse(response, ['add', 'remove']);
        });
        it('git init test', function () {
            var response = executor.getCommand('git init test');
            responseValidator.errorResponse(response, undefined);
        });
    });
})(CommandExecutorSpec || (CommandExecutorSpec = {}));
