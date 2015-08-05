/// <reference path="../../typings/commandjs/command-definitions.d.ts"/>
module CommandJS
{
  "use strict";

  var states = require('./states');
  var commandParser: PEG.Parser = require('./command-parser');

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

    /**
     * Executes the given command
     * @param {string} commandString the command to parse
     * @return {ExecutorResponse} Response that contains the execution result
     */
    public execute(commandString: string): ExecutorResponse
    {
      var parsed = this.parse(commandString);
      var commandParts = this.getCommandParts(parsed);

      if (!commandParts)
      {
        return {
          state: states.ExecutorResponseState.ERROR,
          errorType: states.ExecutorErrorType.PARSER_ERROR,
          commandString: commandString
        };
      }

      var commandResponse = this.findCommand(commandParts, true);

      if (commandResponse.state === states.ExecutorResponseState.ERROR)
      {
        commandResponse.commandString = commandString;
        return commandResponse;
      }

      try
      {
        return commandResponse.response;
      } catch (e)
      {
        return {
          state: states.ExecutorResponseState.ERROR,
          errorType: states.ExecutorErrorType.COMMAND_EXECUTION_ERROR,
          commandString: commandString,
          response: e
        }
      }
    }

    /**
     * Return the command for the commandString
     * @param {string} commandString the command to parse
     * @return {CommandJS.ExecutorResponse} Response that contains the command
     */
    public getCommand(commandString: string): CommandJS.ExecutorResponse
    {
      var commandParts = this.getCommandParts(this.parse(commandString));

      if (!commandParts)
      {
        return {
          state: states.ExecutorResponseState.ERROR,
          errorType: states.ExecutorErrorType.PARSER_ERROR,
          commandString: commandString
        };
      }

      var commandResponse = this.findCommand(commandParts, false);
      commandResponse.commandString = commandString;

      return commandResponse;
    }

    /**
     * Find the command for the commandParts
     * @param {Array<string>} commandParts parts to check
     * @param {boolean} paramsAllowed if false COMMAND_NOT_FOUND is returned when there are more commandParts available after the last found command
     * @return {ExecutorResponse} Command
     */
    private findCommand(commandParts: Array<string>, paramsAllowed: boolean): ExecutorResponse
    {
      if (!commandParts)
      {
        return null;
      }

      var actualCommand: CommandWrapper;
      var current = this.commands;
      var i: any;
      var part: string;

      for (i in commandParts)
      {
        part = commandParts[i];

        if (current[part])
        {
          actualCommand = current[part];

          if (actualCommand.subCommands)
          {
            current = actualCommand.subCommands;
          }
          else if (!paramsAllowed && i < commandParts.length - 1)
          {
            /**
             * The actualCommand has no subcommands but there are more parts in the command string
             * --> command not found
             */
            return {
              state: states.ExecutorResponseState.ERROR,
              errorType: states.ExecutorErrorType.COMMAND_NOT_FOUND
            }
          }
        }
        else
        {
          //If the command was not found return a list of possible commands
          return {
            state: states.ExecutorResponseState.ERROR,
            errorType: states.ExecutorErrorType.COMMAND_NOT_FOUND,
            response: Object.keys(actualCommand.subCommands)
          }
        }
      }

      return {
        state: states.ExecutorResponseState.SUCCESS,
        response: actualCommand.command
      };
    }

    /**
     * trims the commandString before parsing
     * @param {string} commandString command to parse
     * @return {Array<PEG.ParseResult>} parse result
     */
    private parse(commandString: string): Array<PEG.ParseResult>
    {
      if (!commandString)
      {
        return [];
      }

      return commandParser.parse(commandString.trim());
    }

    private getCommandParts(parseResults: Array<PEG.ParseResult>): Array<string>
    {
      if (!parseResults || parseResults.length === 0)
      {
        return null;
      }

      for (let result of parseResults)
      {
        if (result.type === 'COMMAND_PARAM')
        {
          return result.values;
        }
      }

      return null;
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
