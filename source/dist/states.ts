module CommandJS
{

  export enum ExecutorResponseState
  {
    SUCCESS,
    ERROR
  }

  export enum ExecutorErrorType
  {
    COMMAND_NOT_FOUND,
    PARSER_ERROR,
    COMMAND_EXECUTION_ERROR
  }

  module.exports = {
    ExecutorResponseState: ExecutorResponseState,
    ExecutorErrorType: ExecutorErrorType
  }
}
