module CommandJS
{

  export class ExecutorResponseState
  {
    public SUCCESS = 'SUCCESS';
    public ERROR = 'ERROR';
  }

  export class ExecutorErrorType
  {
    public COMMAND_NOT_FOUND = 'COMMAND_NOT_FOUND';
    public PARSER_ERROR = 'PARSER_ERROR';
    public COMMAND_EXECUTION_ERROR = 'COMMAND_EXECUTION_ERROR';
  }

  module.exports = {
    ExecutorResponseState: new ExecutorResponseState(),
    ExecutorErrorType: new ExecutorErrorType()
  }
}
