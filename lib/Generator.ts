import { BundleGraph } from './Graph.js';

export type RuntimeModule = (
  require: (id: string) => unknown,
  module: { exports: unknown },
  exports: unknown,
) => void;

export default class RuntimeModuleGenerator {
  generateRuntimeGraph(graph: BundleGraph): Record<string, RuntimeModule> {
    const runtimeGraph: Record<string, RuntimeModule> = {};

    for (const module of Object.values(graph)) {
      const transformedCode = this.transformModuleCode(module.code);
      runtimeGraph[module.id] = new Function(
        'require',
        'module',
        'exports',
        transformedCode,
      ) as RuntimeModule;
    }

    return runtimeGraph;
  }

  serializeRuntimeGraph(runtimeGraph: Record<string, RuntimeModule>): string {
    return Object.entries(runtimeGraph)
      .map(([key, value]) => `'${key}': ${value.toString()}`)
      .join(',\n');
  }

  private transformModuleCode(code: string): string {
    return this.replaceImportStatements(this.replaceExportDefaults(code));
  }

  private replaceExportDefaults(data: string): string {
    return data.replace(/export\s+default\s+/g, 'module.exports = ');
  }

  private replaceImportStatements(data: string): string {
    return data.replace(
      /import\s+(\w+)\s+from\s+(['"`].+?['"`])/g,
      `const $1 = require($2)`,
    );
  }
}
