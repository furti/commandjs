## Command
A command is a object that consists of the following properties.

**name** `String`

The name of the command. This is the string a user enters to execute the command. E.g. `git`

**subCommands** `Command[]`
A list of subcommands for the given command.

**execute** `function(ExecutionContext)`

The function that will be called when the command is executed. A single argument with the execution data (parameters, options) will be passed to the function.

Errors thrown by the execute function will be catched by the CommandExecutor. The Executor wraps the error in an response object and returns it to the caller.

Objects returned by the execute method will be also wrapped in an response object and returned to the caller.

**parameters** `ParameterDefinition[]`

A list of objects that describe the parameters for a command. The order of the definitions in the array is the order of the parameters in the command.

## ParameterDefintion

**name** `String`

The name of the parameter. This is the string used as key of the parameter in the ExecutionContext;

## ExecutionContext

**parameters** `Object`

An object that contains the name of the parameter as key and the value the user entered for the parameter as value.

**options** `Object`

An object that contains the name of the option as key and the value the user entered for the option as value. **NOT IMPLEMENTED YET**
