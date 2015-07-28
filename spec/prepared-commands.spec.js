function commandExecutor(commands) {
  return new require('../command.js').executor(commands);
}

describe('Check CommandExecutors prepared commands', function() {
  it('Non Array commands should throw an error', function() {
    expect(function() {
      commandExecutor('test');
    }).toThrow('An array of commands is required');
  });

  it('Null commands should not throw an error.', function() {
    var executor = commandExecutor(null);
    expect(executor.commands).toBeUndefined();
  });

  it('Undefined commands should not throw an error.', function() {
    var executor = commandExecutor();
    expect(executor.commands).toBeUndefined();
  });

  it('List of Commands should be added', function() {
    var executor = commandExecutor([{
      name: 'git',
      subCommands: [{
        name: 'init'
      }]
    }]);

    expect(executor.commands).toBeDefined();
    expect(executor.commands.git).toBeDefined();
    expect(executor.commands.git.command).toBeDefined();
    expect(executor.commands.git.command.name).toBe('git');

    expect(executor.commands.git.subCommands).toBeDefined();
    expect(executor.commands.git.subCommands.init).toBeDefined();
    expect(executor.commands.git.subCommands.init.command).toBeDefined();
    expect(executor.commands.git.subCommands.init.command.name).toBe('init');
  });
});
