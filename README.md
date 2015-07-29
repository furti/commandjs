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

##License
CommandJS is licensed unter the [MIT license](https://github.com/furti/commandjs/blob/master/LICENSE).
