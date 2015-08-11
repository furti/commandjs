var CommandJS;
(function (CommandJS) {
    var CommandIndex = (function () {
        function CommandIndex(commands) {
        }
        CommandIndex.prototype.search = function (tokens) {
            return null;
        };
        return CommandIndex;
    })();
    CommandJS.CommandIndex = CommandIndex;
    module.exports = CommandIndex;
})(CommandJS || (CommandJS = {}));
