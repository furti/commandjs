module CommandJs {
  "use strict"
  declare var exports: any;
  declare var module: any;
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = {
      executor: function(commands: Array<Command>): CommandExecutor {
        return new CommandJs.CommandExecutorImpl(commands);
      }
    };
  }
}
