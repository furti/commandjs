var CommandExecutorSpec;
(function (CommandExecutorSpec) {
    describe('Test getCommand function', function () {
        var commandExecutorBuilder = require('../dist/index');
        var commandExecutor = commandExecutorBuilder.executor;
        var states = commandExecutorBuilder.ExecutorResponseState;
        function successResponse(response) {
            expect(response).toBeDefined();
            expect(response).not.toBeNull();
            expect(response.state).toBe(states['SUCCESS']);
        }
        function errorResponse(response) {
            expect(response).toBeDefined();
            expect(response).not.toBeNull();
            expect(response.state).toBe(states['ERROR']);
        }
        function checkCommand(command, expectedName) {
            expect(command).toBeDefined();
            expect(command).not.toBeNull();
            expect(command.name).toBe(expectedName);
        }
        var executor = commandExecutor([{
                name: 'git',
                subCommands: [{
                        name: 'init'
                    }, {
                        name: 'remote',
                        subCommands: [{
                                name: 'add'
                            }]
                    }]
            }]);
        it('git', function () {
            var response = executor.getCommand('git');
            successResponse(response);
            checkCommand(response.response, 'git');
        });
        it('git init', function () {
            var response = executor.getCommand('git init');
            successResponse(response);
            checkCommand(response.response, 'init');
        });
        it('git remote add', function () {
            var response = executor.getCommand('git remote add');
            successResponse(response);
            checkCommand(response.response, 'add');
        });
        it('git remote rename', function () {
            var response = executor.getCommand('git remote rename');
            errorResponse(response);
        });
    });
})(CommandExecutorSpec || (CommandExecutorSpec = {}));
