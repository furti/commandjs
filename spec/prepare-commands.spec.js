var CommandExecutorSpec;
(function (CommandExecutorSpec) {
    function commandExecutor(commands) {
        return require('../dist/index').executor(commands);
    }
    describe('Check CommandExecutors prepared commands', function () {
        it('Non Array commands should throw an error', function () {
            expect(function () {
                commandExecutor('test');
            }).toThrow('An array of commands is required');
        });
        it('Null commands should not throw an error.', function () {
            var executor = commandExecutor(null);
            expect(executor.getCommands()).toBeUndefined();
        });
        it('Undefined commands should not throw an error.', function () {
            var executor = commandExecutor(undefined);
            expect(executor.getCommands()).toBeUndefined();
        });
        it('List of Commands should be added', function () {
            var executor = commandExecutor([{
                    name: 'git',
                    subCommands: [{
                            name: 'init'
                        }]
                }]);
            var commands = executor.getCommands();
            expect(commands).toBeDefined();
            expect(commands['git']).toBeDefined();
            expect(commands['git'].command).toBeDefined();
            expect(commands['git'].command.name).toBe('git');
            expect(commands['git'].subCommands).toBeDefined();
            expect(commands['git'].subCommands['init']).toBeDefined();
            expect(commands['git'].subCommands['init'].command).toBeDefined();
            expect(commands['git'].subCommands['init'].command.name).toBe('init');
        });
    });
})(CommandExecutorSpec || (CommandExecutorSpec = {}));
