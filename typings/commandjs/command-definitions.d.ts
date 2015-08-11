declare module CommandJS
{
  export interface Command
  {
    name: string;
    subCommands?: Array<Command>;
    parameters?: Array<ParameterDefintion>;
    execute?: (context: ExecutionContext) => any;
  }

  export interface ParameterDefintion
  {
    name: string;
  }

  /**
   * Object that contains the parameters and options passed to a command
   * @type {ExecutionContext}
   */
  export interface ExecutionContext
  {
    parameters: { [name: string]: any },
    options: { [name: string]: any }
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
    commandString?: string;
    [name: string]: any;
  }
}

interface CommandExecutor
{
  getCommand(commandString: string): CommandJS.ExecutorResponse;
  execute(commandString: string): CommandJS.ExecutorResponse;
  autocomplete(commandString: string): CommandJS.ExecutorResponse;
}
