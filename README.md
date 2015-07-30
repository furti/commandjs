#CommandJS
CommandJs is a library that helps you to parse command strings and execute the underlying commands. It works as a node module and in the browser.

I think the best way to explain CommandJS is a small example.

Imagine we have the `git` command and two of his subcommands `init` and `commit` and we want to execute them when the user enters the corresponding command.

At first we need to register our commands so that the CommandExecutor knows about them.

```javascript
var commands = [{
  name: 'git',
  subCommands: [{
    name: 'init',
    execute: function() {
      console.log('Initialized empty Git repository');
    }
  },{
    name: 'commit',
    options: [{
      name: 'm',
      aliases: 'message',
      type: 'string'
    }],
    execute: function(context) {
      console.log('Commit message was ' + context.options.m);
    }
  }]
}];

var commandExecutor = require('commandjs').executor(commands);
```

Then we can start executing commands.

```javascript
commandExecutor.execute('git init');
commandExecutor.execute('git commit -m "Awesome commit message"');
commandExecutor.execute('git commit --mesage "Another commit"');
```

###Create and configure a CommandExecutor
CommandJS is available for node and for the Browser.

In a node environment simply require ```commandjs``` and use it to configure and create CommandExecutors;
```javascript
var commandExecutorBuilder = require('commandjs');

var commandExecutor = commandExecutorBuilder.executor(commands);
```

In the browser use the global CommandJS object to configure and Create CommandExecutors.
```javascript
var commandExecutor = CommandJS.executor(commands);
```

####Configuration
You can customize the builder before creating a CommandExecutor. Therefore the builder offers some configuration functions. Each function, except for the ```executor``` function, returns the builder for a fluent API.

**exceptionHandler(handler)** _not implemented yet_
Configures the exeption handler to use when a exception, e.g. CommandNotFound, occurs. See **Exception handling** for further details.

**executor(commands)**
The executor method takes a array of commands and returns a CommandExecutor initialized with the given commands.

###Command
A command is a object that consists of the following properties.

**name** _String_
The name of the command. This is the string a user enters to execute the command. E.g. ```git```

**subCommands** _Array<Command>_
A list of subcommands for the given command. E.g. ```init```, ```commit```.

**execute** _function(executionContext)_
A function that will be called when the command is executed. A single argument with the execution data (params, options) will be passed to the function.

Errors thrown by the execute function will be catched by the CommandExecutor. The Executor wraps the error in an response object and returns it to the caller.

Objects returned by the execute method will be also wrapped in an response object and returned to the caller.

###Command processing
If a command String is executed it will be split into the commands or parameters and options. After that the Executor will search for the given command. If a command has the subCommands property defined the executor tries to find the given subcommand and will return an error if it can't be found. If no subCommands property is defined the rest of the command string will be treated as params and will be passed to the commands execute method.

###Exception handling
TODO :)

##License
CommandJS is licensed unter the [MIT license](https://github.com/furti/commandjs/blob/master/LICENSE).
