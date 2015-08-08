module CommandExecutorSpec
{
  describe('execute command', function()
  {
    var commandExecutorBuilder = require('../dist/index');
    var commandExecutor = commandExecutorBuilder.executor;
    var responseValidator: CommandJSSpec.ResponseValidator = require('./helpers/response-validator-helper');
    var executeFunctionHelper: CommandJSSpec.ExecuteFunctionHelper = require('./helpers/execute-function-helper');

    var commands: Array<CommandJS.Command> = [
      {
        name: 'first',
        subCommands: [{
          name: 'firstSub',
          execute: executeFunctionHelper.createExecutionFunction('moo')
        }]
      }, {
        name: 'second',
        execute: executeFunctionHelper.createExecutionFunction('awesome test string')
      }];

    var executor: CommandExecutor = commandExecutor(commands);

    it('second', function()
    {
      var response = executor.execute('second');

      responseValidator.successResponse(response);
      executeFunctionHelper.validateResult(response.response, {
        customReturnValue: 'awesome test string'
      });
    });

    it('first firstSub', function()
    {
      var response = executor.execute('first firstSub');

      responseValidator.successResponse(response);
    });

    it('first unkonwn', function()
    {
      var response = executor.execute('first unknown');

      responseValidator.errorResponse(response, ['firstSub']);
    });

    it('another unknown', function()
    {
      var response = executor.execute('another unknown');

      responseValidator.errorResponse(response, ['first', 'second']);
    });
  });
}
