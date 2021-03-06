/// <reference path="../../typings/commandjs/command-definitions.d.ts"/>
module CommandJS
{
  "use strict";

  var states = require('./states');
  var commandParser: PEG.Parser = require('./command-parser');
  var commandIndex = require('./command-index');

  interface CommandWrapper
  {
    command: Command;
    subCommands?: { [k: string]: CommandWrapper };
  }

  export class CommandExecutorImpl implements CommandExecutor
  {
    private commands: { [k: string]: CommandWrapper };
    private index: CommandJS.CommandIndex;

    constructor(commands: Array<Command>)
    {
      if (commands && !(commands instanceof Array))
      {
        throw 'An array of commands is required';
      }

      this.commands = this.prepareCommands(commands);
      this.index = new commandIndex(commands);
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

      //Command was not found
      if (commandResponse.state === states.ExecutorResponseState.ERROR)
      {
        commandResponse.commandString = commandString;
        return commandResponse;
      }

      try
      {
        var command = commandResponse['command'];
        var result = command.execute(this.buildExecutionContext(command, commandResponse['parameters']));

        return {
          state: states.ExecutorResponseState.SUCCESS,
          commandString: commandString,
          result: result
        };
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
     * Autocomplete the commandString
     * @param {string} commandString to check
     * @return {CommandJS.ExecutorResponse} Response with possible commands
     */
    public autocomplete(commandString: string): CommandJS.ExecutorResponse
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

      var possibleCommands = this.index.search(commandParts);

      if (!possibleCommands || possibleCommands.length === 0)
      {
        return {
          state: states.ExecutorResponseState.ERROR,
          errorType: states.ExecutorErrorType.COMMAND_NOT_FOUND,
          commandString: commandString
        }
      }

      return {
        state: states.ExecutorResponseState.SUCCESS,
        commandString: commandString,
        possibleCommands: possibleCommands
      };
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

    private buildExecutionContext(command: Command, paramValues: Array<string>): ExecutionContext
    {
      var parameters: { [name: string]: string } = {};

      if (paramValues)
      {
        for (var i in paramValues)
        {
          parameters[command.parameters[i].name] = paramValues[i];
        }
      }

      return {
        parameters: parameters,
        options: {}
      }
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
      var params: Array<string>;
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
          if (!paramsAllowed || !actualCommand || !actualCommand.command.parameters)
          {
            var response: CommandJS.ExecutorResponse = {
              state: states.ExecutorResponseState.ERROR,
              errorType: states.ExecutorErrorType.COMMAND_NOT_FOUND
            };

            if (current)
            {
              response['availableCommands'] = Object.keys(current)
            }

            //If the command was not found return a list of possible commands
            return response;
          }
          else
          {
            params = commandParts.slice(i);
            break;
          }
        }
      }

      return {
        state: states.ExecutorResponseState.SUCCESS,
        command: actualCommand.command,
        parameters: params
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
