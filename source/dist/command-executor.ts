/// <reference path="../../typings/commandjs/command-definitions.d.ts"/>
module CommandJS
{
  "use strict"
  var states = require('./states');
  var commandParser = require('./command-parser');

  interface CommandWrapper
  {
    command: Command;
    subCommands?: { [k: string]: CommandWrapper };
  }

  export class CommandExecutorImpl implements CommandExecutor
  {
    private commands: { [k: string]: CommandWrapper };

    constructor(commands: Array<Command>)
    {
      if (commands && !(commands instanceof Array))
      {
        throw 'An array of commands is required';
      }

      this.commands = this.prepareCommands(commands);
    }

    /**
     * Return all commands registered on the Executor.
     *
     * @return {Object} Object with the command name as key and the command as value
     */
    public getCommands(): { [k: string]: CommandWrapper }
    {
      return this.commands;
    }

    public getCommand(commandString: string): CommandJS.ExecutorResponse
    {
      return {
        state: states.ExecutorResponseState.SUCCESS
      };
    }

    private prepareCommands(commands: Array<CommandJS.Command>): { [k: string]: CommandWrapper }
    {
      if (!commands)
      {
        return;
      }

      var self = this;
      var commandMap: { [k: string]: CommandWrapper } = {};

      commands.forEach(function(command)
      {
        commandMap[command.name] = {
          command: command
        };

        if (command.subCommands)
        {
          commandMap[command.name].subCommands = self.prepareCommands(command.subCommands);
        }
      });

      return commandMap;
    }
  }

  module.exports = CommandExecutorImpl;
}
