module CommandJSSpec
{
  var states: CommandJS.ExecutorResponseState = require('../../dist/states').ExecutorResponseState;

  export class ResponseValidator
  {
    successResponse(response: CommandJS.ExecutorResponse): void
    {
      expect(response).toBeDefined();
      expect(response).not.toBeNull();
      expect(response.state).toBe(states.SUCCESS);
    }

    errorResponse(response: CommandJS.ExecutorResponse, availableCommands: Array<String>)
    {
      expect(response).toBeDefined();
      expect(response).not.toBeNull();
      expect(response.state).toBe(states.ERROR);

      expect(response['availableCommands']).toEqual(availableCommands);
    }

    checkCommand(command: CommandJS.Command, expectedName: string)
    {
      expect(command).toBeDefined();
      expect(command).not.toBeNull();
      expect(command.name).toBe(expectedName);
    }
  }

  module.exports = new ResponseValidator();
}
