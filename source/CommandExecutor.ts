/// <reference path="../definitions/command-definitions.d.ts"/>

module CommandJs {
  "use strict"

  interface CommandWrapper {
    command: Command;
    subCommands?: { [k: string]: CommandWrapper };
  }

  export class CommandExecutorImpl implements CommandExecutor {
    private commands: { [k: string]: CommandWrapper };

    constructor(commands: Array<Command>) {
      if (commands && !(commands instanceof Array)) {
        throw 'An array of commands is required';
      }

      this.commands = this.prepareCommands(commands);
    }

    public getCommand(commandString: string): Command {
      return null;
    }

    private prepareCommands(commands: Array<Command>): { [k: string]: CommandWrapper } {
      if (!commands) {
        return;
      }

      var self = this;
      var commandMap: { [k: string]: CommandWrapper } = {};

      commands.forEach(function(command) {
        commandMap[command.name] = {
          command: command
        };

        if (command.subCommands) {
          commandMap[command.name].subCommands = self.prepareCommands(command.subCommands);
        }
      });

      return commandMap;
    }
  }
}
