import path from 'path';
import Module from './Module.js';
import Parser from './Parser.js';

export type BundleGraph = {
  [filepath: string]: {
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
    const graph: Record<string, { code: string; dependencies: string[] }> = {};

    for (const module of this.dependencyGraph) {
      graph[module.filepath] = {
        code: module.code ?? '',
        dependencies: module.dependencies,
      };
    }

    return graph;
  }
}
