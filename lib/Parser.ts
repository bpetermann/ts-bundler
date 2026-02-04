const IMPORT_STATEMENT = 'import' as const;

export default class Parser {
  private indexExtension: string;

  constructor(indexExtension = '.js') {
    this.indexExtension = indexExtension;
  }

  parse(data: string): string[] {
    return data
      .split('\n')
      .map((line) => line.trim())
      .map((line) => this.extractImport(line))
      .filter((x): x is string => Boolean(x));
  }

  private extractImport(line: string): string | undefined {
    if (!line.startsWith(IMPORT_STATEMENT)) return;
    return this.extractImportPath(line);
  }

  private extractImportPath(line: string): string | undefined {
    const direct = line.match(/import\s+(['"`])([^]*?)\1/);
    if (direct) return this.normalizeImportPath(direct[2]);

    const from = line.match(/from\s+(['"`])([^]*?)\1/);
    if (from) return this.normalizeImportPath(from[2]);
  }

  private normalizeImportPath(file: string): string {
    return file.split('/').pop()?.includes('.')
      ? file
      : `${file}/index${this.indexExtension}`;
  }
}
