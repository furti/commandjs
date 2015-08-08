module CommandJSSpec
{
  export interface ExecutionFunctionData
  {
    customReturnValue: any;
    parameters?: { [name: string]: any };
    options?: { [name: string]: any };
  }

  export class ExecuteFunctionHelper
  {
    /**
     * Retuns the execute Function for tests.
     * The function uses the context information and adds them to the return value.
     *
     * @param {any} customReturnValue Object that is added to the return value of the execute function. So we can test if the function gets executed properly.
     * @return {[type]} Execution function
     */
    createExecutionFunction(customReturnValue: any): (context: CommandJS.ExecutionContext) => any
    {
      return function(context: CommandJS.ExecutionContext): any
      {
        return {
          returnValue: customReturnValue,
          params: context.parameters,
          options: context.options
        }
      };
    }

    public validateResult(result: any, expected: ExecutionFunctionData): void
    {
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result.returnValue).toEqual(expected.customReturnValue);

      expect(result.parameters).toBeDefined();
      expect(result.parameters).not.toBeNull();

      expect(result.options).toBeDefined();
      expect(result.otions).not.toBeNull();

      if (expected.parameters)
      {
        expect(Object.keys(result.parameters).length).toEqual(Object.keys(expected.parameters).length);

        for (var paramName in expected.parameters)
        {
          expect(result.parameters[paramName]).toBe(expected.parameters[paramName]);
        }
      }
      else
      {
        expect(Object.keys(result.parameters).length).toBe(0);
      }

      if (expected.options)
      {
        expect(Object.keys(result.options).length).toEqual(Object.keys(expected.options).length);

        for (var optionName in expected.options)
        {
          expect(result.options[optionName]).toBe(expected.options[optionName]);
        }
      }
      else
      {
        expect(Object.keys(result.options).length).toBe(0);
      }
    }
  }

  module.exports = new ExecuteFunctionHelper();
}
