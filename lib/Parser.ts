const IMPORT_STATEMENT = 'import' as const;

export default class Parser {
  constructor() {}

  parse(data: string): string[] {
    return data
      .split('\n')
      .map((line) => line.trim())
      .map((line) => this.parseLine(line))
      .filter((x): x is string => Boolean(x));
  }

  parseLine(line: string): string | undefined {
    if (!line.startsWith(IMPORT_STATEMENT)) return;
    return this.resolveImport(line);
  }

  resolveImport(line: string): string | undefined {
    const fromPath = line.split('from ')?.[1];
    const file = fromPath?.match(/(['"`])([^]*?)\1/)?.[2];
    if (!file) return;
    return file;
  }
}
