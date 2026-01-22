import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export default class Bundler {
  entryFile: string;
  rootDir: string;

  constructor(rootDir?: string, entryFile?: string) {
    this.rootDir = rootDir ?? process.cwd();
    this.entryFile = entryFile ?? process.argv[2];
  }

  bundle() {
    try {
      const data = this.getFileData();

      writeFileSync(path.join(this.rootDir, `dist-${this.entryFile}`), data);
    } catch (err) {
      console.error(`ts-bundler: ${err.message}`);
    }
  }

  getFileData(): string {
    try {
      return readFileSync(path.join(this.rootDir, this.entryFile), {
        encoding: 'utf8',
        flag: 'r',
      });
    } catch (err) {
      throw Error(err.message);
    }
  }
}
