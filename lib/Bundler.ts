import { writeFileSync } from 'fs';
import path from 'path';
import RuntimeModuleGenerator from './Generator.js';
import Graph from './Graph.js';
import Runtime from './Runtime.js';

export default class Bundler {
  entryFile: string;
  rootDir: string;
  generator: RuntimeModuleGenerator;
  graph: Graph;
  runtime: Runtime;

  constructor(rootDir?: string, entryFile?: string) {
    this.rootDir = rootDir ?? process.cwd();
    this.entryFile = entryFile ?? process.argv[2];
    this.generator = new RuntimeModuleGenerator();
    this.graph = new Graph(this.rootDir, this.entryFile);
    this.runtime = new Runtime(this.entryFile);
  }

  bundle() {
    try {
      const output = this.generateBundle();
      writeFileSync(path.join(this.rootDir, `dist-${this.entryFile}`), output);
    } catch (err) {
      console.error(`ts-bundler: ${err instanceof Error ? err.message : err}`);
    }
  }

  private generateBundle(): string {
    return this.emitRuntime(this.runtimeGraphSource());
  }

  private runtimeGraphSource(): string {
    const graph = this.graph.toJSON();
    const runtime = this.generator.generateRuntimeGraph(graph);
    return this.generator.serializeRuntimeGraph(runtime);
  }

  private emitRuntime(graphSource: string): string {
    return `
    (function () {
    const graph = {${graphSource}};
    ${this.runtime.createRuntimeLoader()}
    })();
    `;
  }
}
