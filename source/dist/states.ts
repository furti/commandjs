module CommandJS
{

  export enum ExecutorResponseState
  {
    SUCCESS,
    ERROR
  }

  export enum ExecutorErrorType
  {
    COMMAND_NOT_FOUND
  }

  module.exports = {
    ExecutorResponseState: ExecutorResponseState,
    ExecutorErrorType: ExecutorErrorType
  }
}
