module CommandExecutorSpec
{
  describe('Test getCommand function', function()
  {
    var commandExecutorBuilder = require('../dist/index');
    var commandExecutor = commandExecutorBuilder.executor;
    var states: CommandJS.ExecutorResponseState = commandExecutorBuilder.ExecutorResponseState;

    function successResponse(response: CommandJS.ExecutorResponse)
    {
      expect(response).toBeDefined();
      expect(response).not.toBeNull();
      expect(response.state).toBe(states['SUCCESS']);
    }

    function errorResponse(response: CommandJS.ExecutorResponse, expectedResponse: Array<String>)
    {
      expect(response).toBeDefined();
      expect(response).not.toBeNull();
      expect(response.state).toBe(states['ERROR']);

      expect(response.response).toEqual(expectedResponse);
    }

    function checkCommand(command: CommandJS.Command, expectedName: string)
    {
      expect(command).toBeDefined();
      expect(command).not.toBeNull();
      expect(command.name).toBe(expectedName);
    }

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

      successResponse(response);
      checkCommand(response.response, 'git');
    });

    it('git init', function()
    {
      var response = executor.getCommand('git init');

      successResponse(response);
      checkCommand(response.response, 'init');
    });

    it('git remote add', function()
    {
      var response = executor.getCommand('git remote add');

      successResponse(response);
      checkCommand(response.response, 'add');
    });

    it('git remote rename', function()
    {
      var response = executor.getCommand('git remote rename');

      errorResponse(response, ['add', 'remove']);
    });

    it('git init test', function()
    {
      var response = executor.getCommand('git init test');

      errorResponse(response, undefined);
    });
  });
}
