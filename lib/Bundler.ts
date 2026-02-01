import { writeFileSync } from 'fs';
import path from 'path';
import Graph from './Graph.js';

export default class Bundler {
  entryFile: string;
  rootDir: string;

  constructor(rootDir?: string, entryFile?: string) {
    this.rootDir = rootDir ?? process.cwd();
    this.entryFile = entryFile ?? process.argv[2];
  }

  bundle() {
    try {
      const output = this.generateBundle();

      writeFileSync(path.join(this.rootDir, `dist-${this.entryFile}`), output);
    } catch (err) {
      console.error(`ts-bundler: ${err.message}`);
    }
  }

  private generateBundle(): string {
    const graph = new Graph(this.rootDir, this.entryFile);
    const graphData = graph.toJSON();

    return `(function(){const graph =${JSON.stringify(graphData, null, 2)}})();`;
  }
}
