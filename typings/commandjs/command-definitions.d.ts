declare module CommandJS {
  export interface Command {
    name: string;
    subCommands?: Array<Command>;
  }

  export interface ExecutorResponse {
    state: ExecutorResponseState;
    errorType?: ExecutorErrorType;
    response?: any;
  }
}

interface CommandExecutor {
  getCommand(commandString: string): CommandJS.ExecutorResponse;
}
