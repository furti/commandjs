declare module PEG
{
  export interface Parser
  {
    parse(input: string): Array<ParseResult>;
  }

  export interface ParseResult
  {
    type: string;
    values: Array<string>
  }

  class SyntaxError
  {
    line: number;
    column: number;
    offset: number;

    expected: any[];
    found: any;
    name: string;
    message: string;
  }
}
