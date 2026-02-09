export const REQUIRE = '__require__' as const;

export default class Runtime {
  constructor(private readonly entryFile: string) {}

  createRuntimeLoader(): string {
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
    const normalized = this.entryFile.replace(/^\.\//, '');
    return `const entry = './' + ${JSON.stringify(normalized)}; ${REQUIRE}(entry);`;
  }
}
