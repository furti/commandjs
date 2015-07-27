interface Command {
    name: string;
    subCommands?: Array<Command>;
}

interface CommandExecutor {
}
