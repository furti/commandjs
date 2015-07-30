declare module CommandJS {
  export interface Command {
    name: string;
    subCommands?: Array<Command>;
  }

  enum ExecutorResponseState { }

  enum ExecutorErrorType { }

  export interface ExecutorResponse {
    state: ExecutorResponseState;
    errorType?: ExecutorErrorType;
    response?: any;
  }
}

interface CommandExecutor {
  getCommand(commandString: string): CommandJS.ExecutorResponse;
}
