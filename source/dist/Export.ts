module CommandJS {
  "use strict"
  declare var exports: any;
  declare var module: any;
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = {
      ExecutorResponseState: CommandJS.ExecutorResponseState,
      ExecutorErrorType: CommandJS.ExecutorErrorType,
      executor: function(commands: Array<CommandJS.Command>): CommandExecutor {
        return new CommandJS.CommandExecutorImpl(commands);
      }
    };
  }
}
