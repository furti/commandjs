var CommandJS;
(function (CommandJS) {
    (function (ExecutorResponseState) {
        ExecutorResponseState[ExecutorResponseState["SUCCESS"] = 0] = "SUCCESS";
        ExecutorResponseState[ExecutorResponseState["ERROR"] = 1] = "ERROR";
    })(CommandJS.ExecutorResponseState || (CommandJS.ExecutorResponseState = {}));
    var ExecutorResponseState = CommandJS.ExecutorResponseState;
    (function (ExecutorErrorType) {
        ExecutorErrorType[ExecutorErrorType["COMMAND_NOT_FOUND"] = 0] = "COMMAND_NOT_FOUND";
        ExecutorErrorType[ExecutorErrorType["PARSER_ERROR"] = 1] = "PARSER_ERROR";
        ExecutorErrorType[ExecutorErrorType["COMMAND_EXECUTION_ERROR"] = 2] = "COMMAND_EXECUTION_ERROR";
    })(CommandJS.ExecutorErrorType || (CommandJS.ExecutorErrorType = {}));
    var ExecutorErrorType = CommandJS.ExecutorErrorType;
    module.exports = {
        ExecutorResponseState: ExecutorResponseState,
        ExecutorErrorType: ExecutorErrorType
    };
})(CommandJS || (CommandJS = {}));
