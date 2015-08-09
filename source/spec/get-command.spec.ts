module CommandExecutorSpec
{
  describe('Test getCommand function', function()
  {
    var commandExecutorBuilder = require('../dist/index');
    var commandExecutor = commandExecutorBuilder.executor;
    var responseValidator: CommandJSSpec.ResponseValidator = require('./helpers/response-validator-helper');

    var executor: CommandExecutor = commandExecutor([{
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

    it('git', function()
    {
      var response = executor.getCommand('git');

      responseValidator.successResponse(response);
      responseValidator.checkCommand(response['command'], 'git');
    });

    it('git init', function()
    {
      var response = executor.getCommand('git init');

      responseValidator.successResponse(response);
      responseValidator.checkCommand(response['command'], 'init');
    });

    it('git remote add', function()
    {
      var response = executor.getCommand('git remote add');

      responseValidator.successResponse(response);
      responseValidator.checkCommand(response['command'], 'add');
    });

    it('git remote rename', function()
    {
      var response = executor.getCommand('git remote rename');

      responseValidator.errorResponse(response, ['add', 'remove']);
    });

    it('git init test', function()
    {
      var response = executor.getCommand('git init test');

      responseValidator.errorResponse(response, undefined);
    });

    it('really unknown', function()
    {
      var response = executor.getCommand('really unknown');

      responseValidator.errorResponse(response, ['git']);
    });
  });
}
