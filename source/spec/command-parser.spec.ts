module CommandExecutorSpec
{
  describe('Parse command', function()
  {
    var commandParser: PEG.Parser = require('../dist/command-parser');

    function findResult(results: Array<PEG.ParseResult>, type: string): PEG.ParseResult
    {
      for (var i in results)
      {
        if (results[i].type === type)
        {
          return results[i];
        }
      }
    }

    function validateResult(actual: Array<PEG.ParseResult>, expected: Array<PEG.ParseResult>): void
    {
      expect(actual).toBeDefined();
      expect(actual).not.toBeNull();
      expect(actual.length).toBe(expected.length);

      expected.forEach(function(expectedResult)
      {
        var actualResult = findResult(actual, expectedResult.type);

        expect(actualResult).toBeDefined();
        expect(actualResult).not.toBeNull();
        expect(actualResult.values).toEqual(expectedResult.values);
      });
    }

    it('git', function()
    {
      var result = commandParser.parse('git');
      validateResult(result, [{
        type: 'COMMAND_PARAM',
        values: ['git']
      }]);
    });

    it('git init', function()
    {
      var result = commandParser.parse('git init');
      validateResult(result, [{
        type: 'COMMAND_PARAM',
        values: ['git', 'init']
      }]);
    });

    it('git remote add', function()
    {
      var result = commandParser.parse('git remote add');
      validateResult(result, [{
        type: 'COMMAND_PARAM',
        values: ['git', 'remote', 'add']
      }]);
    });
  });
}
