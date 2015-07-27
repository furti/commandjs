/// <reference path="../definitions/command-definitions.d.ts"/>

module CommandJs {
  "use strict"
  export class CommandExecutorImpl implements CommandExecutor {
    private commands: Array<Command>;

    constructor(commands: Array<Command>) {
      if (commands && !(commands instanceof Array)) {
        throw 'An array of commands is required';
      }

      this.commands = commands;
    }
  }
}
