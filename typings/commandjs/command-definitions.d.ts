declare module CommandJS
{
  export interface Command
  {
    name: string;
    subCommands?: Array<Command>;
    execute?: (context: ExecutionContext) => any;
  }

  /**
   * Object that contains the parameters and options passed to a command
   * @type {ExecutionContext}
   */
  export interface ExecutionContext
  {
    parameters?: Array<any>,
    options?: { [name: string]: any }
  }

  /**
   * Response from a CommandExecutor method
   *
   * state is error and type is COMMAND_NOT_FOUND response contains a list of available commands. So you can display a "did you mean ... message"
   * state is error and type is PARSE_ERROR response is undefined
   *
   * @type {ExecutorResponse}
   */
  export interface ExecutorResponse
  {
    state: ExecutorResponseState;
    errorType?: ExecutorErrorType;
    commandString?: string,
    response?: any;
  }
}

interface CommandExecutor
{
  getCommand(commandString: string): CommandJS.ExecutorResponse;
  execute(commandString: string): CommandJS.ExecutorResponse;
}
