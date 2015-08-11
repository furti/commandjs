module CommandExecutorSpec
{
  describe('Autocomplete command', function()
  {
    var commands: Array<CommandJS.Command> = [{
      name: 'git',
      subCommands: [
        {
          name: 'init'
        }, {
          name: 'add'
        }, {
          name: 'commit'
        }, {
          name: 'remote',
          subCommands: [{ name: 'add' }, { name: 'rename' }, { name: 'remove' }]
        }
      ]
    }];

    var commandExecutor: CommandExecutor = require('../dist/index').executor(commands);
    var responseValidator: CommandJSSpec.ResponseValidator = require('./helpers/response-validator-helper');

    it('gi', function()
    {
      var response = commandExecutor.autocomplete('gi');

      responseValidator.successResponse(response);
      expect(response['possibleCommands']).toEqual(['git']);
    });

    it('git', function()
    {
      var response = commandExecutor.autocomplete('gi');

      responseValidator.successResponse(response);
      expect(response['possibleCommands']).toEqual(['git init', 'git add', 'git commit', 'git remote']);
    });

    it('git a', function()
    {
      var response = commandExecutor.autocomplete('git a');

      responseValidator.successResponse(response);
      expect(response['possibleCommands']).toEqual(['git add']);
    });

    it('git remote', function()
    {
      var response = commandExecutor.autocomplete('git remote');

      responseValidator.successResponse(response);
      expect(response['possibleCommands']).toEqual(['git remote add', 'git remote rename', 'git remote remove']);
    });

    it('git remote re', function()
    {
      var response = commandExecutor.autocomplete('git remote re');

      responseValidator.successResponse(response);
      expect(response['possibleCommands']).toEqual(['git remote rename', 'git remote remove']);
    });
  });
}
