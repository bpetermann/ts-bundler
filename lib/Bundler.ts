import { writeFileSync } from 'fs';
import path from 'path';
import RuntimeModuleGenerator from './Generator.js';
import Graph from './Graph.js';

export const REQUIRE = '__require__' as const;

export default class Bundler {
  entryFile: string;
  rootDir: string;
  generator: RuntimeModuleGenerator;
  graph: Graph;

  constructor(rootDir?: string, entryFile?: string) {
    this.rootDir = rootDir ?? process.cwd();
    this.entryFile = entryFile ?? process.argv[2];
    this.generator = new RuntimeModuleGenerator();
    this.graph = new Graph(this.rootDir, this.entryFile);
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
    ${this.createRuntimeLoader()}
    })();
    `;
  }

  private createRuntimeLoader(): string {
    return `${this.createRequireFunction()}${this.emitEntryExecution()}`;
  }

  private createRequireFunction(): string {
    return `
  const cache = {};

  function ${REQUIRE}(id) {
    if (cache[id]) return cache[id].exports;

    const module = { exports: {} };
    cache[id] = module;

    graph[id](${REQUIRE}, module, module.exports);
    return module.exports;
  }
  `;
  }

  private emitEntryExecution(): string {
    return `const entry = './' + ${JSON.stringify(this.entryFile)}; ${REQUIRE}(entry);`;
  }
}
