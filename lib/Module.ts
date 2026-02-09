import { readFileSync } from 'fs';
import Parser from './Parser.js';

export default class Module {
  filepath: string;
  code?: string = undefined;
  dependencies: string[] = [];
  parser: Parser;

  constructor(parser: Parser, file: string) {
    this.parser = parser;
    this.filepath = file;
    this.build();
  }

  build() {
    const data = this.readFile(this.filepath);
    const dependencies = this.parser.parse(data);
    this.dependencies = dependencies;
    this.code = data;
  }

  readFile(filePath: string): string {
    try {
      return readFileSync(filePath, {
        encoding: 'utf8',
        flag: 'r',
      });
    } catch (err) {
      throw Error(err instanceof Error ? err.message : String(err));
    }
  }
}
