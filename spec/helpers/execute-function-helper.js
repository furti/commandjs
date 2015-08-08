var CommandJSSpec;
(function (CommandJSSpec) {
    var ExecuteFunctionHelper = (function () {
        function ExecuteFunctionHelper() {
        }
        ExecuteFunctionHelper.prototype.createExecutionFunction = function (customReturnValue) {
            return function (context) {
                return {
                    returnValue: customReturnValue,
                    parameters: context.parameters,
                    options: context.options
                };
            };
        };
        ExecuteFunctionHelper.prototype.validateResult = function (result, expected) {
            expect(result).toBeDefined();
            expect(result).not.toBeNull();
            expect(result.returnValue).toEqual(expected.customReturnValue);
            expect(result.parameters).toBeDefined();
            expect(result.parameters).not.toBeNull();
            expect(result.options).toBeDefined();
            expect(result.otions).not.toBeNull();
            if (expected.parameters) {
                expect(Object.keys(result.parameters).length).toEqual(Object.keys(expected.parameters).length);
                for (var paramName in expected.parameters) {
                    expect(result.parameters[paramName]).toBe(expected.parameters[paramName]);
                }
            }
            else {
                expect(Object.keys(result.parameters).length).toBe(0);
            }
            if (expected.options) {
                expect(Object.keys(result.options).length).toEqual(Object.keys(expected.options).length);
                for (var optionName in expected.options) {
                    expect(result.options[optionName]).toBe(expected.options[optionName]);
                }
            }
            else {
                expect(Object.keys(result.options).length).toBe(0);
            }
        };
        return ExecuteFunctionHelper;
    })();
    CommandJSSpec.ExecuteFunctionHelper = ExecuteFunctionHelper;
    module.exports = new ExecuteFunctionHelper();
})(CommandJSSpec || (CommandJSSpec = {}));
