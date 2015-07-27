function commandExecutor(commands) {
  return new require('../command.js').executor(commands);
}

describe('Check CommandExecutor', function() {
  it('Non Array commands should throw an error', function() {
    expect(function() {
      commandExecutor('test');
    }).toThrow('An array of commands is required');
  });

  it('Null commands should not throw an error.', function() {
    var executor = commandExecutor(null);
    expect(executor.commands).toBe(null);
  });

  it('Undefined commands should not throw an error.', function() {
    var executor = commandExecutor();
    expect(executor.commands).toBeUndefined();
  });

  it('List of Commands should be added', function() {
    var executor = commandExecutor([{
      name: 'git',
      subcommands: [{
        name: 'init'
      }]
    }]);

    expect(executor.commands).toBeDefined();
    expect(executor.commands.length).toBe(1);
    expect(executor.commands[0].name).toBe('git');

    //TODO: check subcommands
  });
});
