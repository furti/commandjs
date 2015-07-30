module CommandExecutorSpec {
  var commandExecutorBuilder = require('../../command.js');
  var commandExecutor = commandExecutorBuilder.executor;
  var ExecutorResponseState = commandExecutorBuilder.ExecutorResponseState;

  describe('Test getCommand function', function() {
    function successResponse(response: CommandJS.ExecutorResponse) {
      expect(response).toBeDefined();
      expect(response).not.toBeNull();
      expect(response.state).toBe(ExecutorResponseState.SUCCESS);
    }

    function errorResponse(response: CommandJS.ExecutorResponse) {
      expect(response).toBeDefined();
      expect(response).not.toBeNull();
      expect(response.state).toBe(ExecutorResponseState.ERROR);
    }

    function checkCommand(command: CommandJS.Command, expectedName: string) {
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
          }]
        }]
    }]);

    it('git', function() {
      var response = executor.getCommand('git');

      successResponse(response);
      checkCommand(response.response, 'git');
    });

    it('git init', function() {
      var response = executor.getCommand('git init');

      successResponse(response);
      checkCommand(response.response, 'init');
    });

    it('git remote add', function() {
      var response = executor.getCommand('git remote add');

      successResponse(response);
      checkCommand(response.response, 'add');
    });

    it('git remote rename', function() {
      var response = executor.getCommand('git remote rename');

      errorResponse(response);
      //TODO validate error response
    });
  });
}
