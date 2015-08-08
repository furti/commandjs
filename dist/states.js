var CommandJS;
(function (CommandJS) {
    var ExecutorResponseState = (function () {
        function ExecutorResponseState() {
            this.SUCCESS = 'SUCCESS';
            this.ERROR = 'ERROR';
        }
        return ExecutorResponseState;
    })();
    CommandJS.ExecutorResponseState = ExecutorResponseState;
    var ExecutorErrorType = (function () {
        function ExecutorErrorType() {
            this.COMMAND_NOT_FOUND = 'COMMAND_NOT_FOUND';
            this.PARSER_ERROR = 'PARSER_ERROR';
            this.COMMAND_EXECUTION_ERROR = 'COMMAND_EXECUTION_ERROR';
        }
        return ExecutorErrorType;
    })();
    CommandJS.ExecutorErrorType = ExecutorErrorType;
    module.exports = {
        ExecutorResponseState: new ExecutorResponseState(),
        ExecutorErrorType: new ExecutorErrorType()
    };
})(CommandJS || (CommandJS = {}));
