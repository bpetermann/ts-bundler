import path from 'path';
import Module from './Module.js';
import Parser from './Parser.js';

export type BundleGraph = {
  [filepath: string]: {
    id: string;
    code: string;
    dependencies: string[];
  };
};

export default class Graph {
  dependencyGraph: Array<Module> = [];
  private visited = new Set<string>();
  parser: Parser;

  constructor(
    private readonly rootDir: string,
    private readonly entryFile: string,
  ) {
    this.parser = new Parser();
    this.createModule(path.join(this.rootDir, this.entryFile));
  }

  createModule(file: string) {
    if (this.visited.has(file)) return;

    this.visited.add(file);

    const module = new Module(this.parser, file);
    this.dependencyGraph.push(module);

    this.traverse(module.dependencies);
  }

  traverse(dependencies: string[]): void {
    dependencies?.forEach((dep) =>
      this.createModule(path.join(this.rootDir, dep)),
    );
  }

  toJSON(): BundleGraph {
    const graph: BundleGraph = {};

    for (const module of this.dependencyGraph) {
      graph[module.filepath] = {
        code: module.code ?? '',
        id: this.normalizeId(module.filepath),
        dependencies: module.dependencies.map((dep) =>
          this.normalizeId(path.join(this.rootDir, dep)),
        ),
      };
    }

    return graph;
  }

  private normalizeId(file: string): string {
    return './' + path.relative(this.rootDir, file).replace(/\\/g, '/');
  }
}
