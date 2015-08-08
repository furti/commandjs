var CommandJSSpec;
(function (CommandJSSpec) {
    var states = require('../../dist/states').ExecutorResponseState;
    var ResponseValidator = (function () {
        function ResponseValidator() {
        }
        ResponseValidator.prototype.successResponse = function (response) {
            expect(response).toBeDefined();
            expect(response).not.toBeNull();
            expect(response.state).toBe(states.SUCCESS);
        };
        ResponseValidator.prototype.errorResponse = function (response, expectedResponse) {
            expect(response).toBeDefined();
            expect(response).not.toBeNull();
            expect(response.state).toBe(states.ERROR);
            expect(response.response).toEqual(expectedResponse);
        };
        ResponseValidator.prototype.checkCommand = function (command, expectedName) {
            expect(command).toBeDefined();
            expect(command).not.toBeNull();
            expect(command.name).toBe(expectedName);
        };
        return ResponseValidator;
    })();
    CommandJSSpec.ResponseValidator = ResponseValidator;
    module.exports = new ResponseValidator();
})(CommandJSSpec || (CommandJSSpec = {}));
