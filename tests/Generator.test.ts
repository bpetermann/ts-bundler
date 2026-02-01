import { describe, expect, it } from 'vitest';
import RuntimeGenerator from '../lib/Generator.js';
import { BundleGraph } from '../lib/Graph.js';

describe('RuntimeGenerator', () => {
  it('transforms export default into module.exports', () => {
    const graph: BundleGraph = {
      './foo.js': {
        id: './foo.js',
        code: `
          export default function add(a, b) {
            return a + b;
          }
        `,
        dependencies: [],
      },
    };

    const generator = new RuntimeGenerator();
    const runtime = generator.generateRuntimeGraph(graph);

    const module = { exports: {} };
    runtime['./foo.js'](() => undefined, module, module.exports);

    expect(typeof module.exports).toBe('function');
    expect((module.exports as (a: number, b: number) => number)?.(2, 3)).toBe(
      5,
    );
  });

  it('transforms imports into __require__ calls', () => {
    const graph: BundleGraph = {
      './bar.js': {
        id: './bar.js',
        code: `
          export default function sum(a, b) {
            return a + b;
          }
        `,
        dependencies: [],
      },
      './foo.js': {
        id: './foo.js',
        code: `
          import sum from './bar.js';
          export default function add(a, b) {
            return sum(a, b);
          }
        `,
        dependencies: ['./bar.js'],
      },
    };

    const generator = new RuntimeGenerator();
    const runtime = generator.generateRuntimeGraph(graph);

    function fakeRequire(id: string) {
      const module = { exports: {} };
      runtime[id](fakeRequire, module, module.exports);
      return module.exports;
    }

    const add = fakeRequire('./foo.js') as (a: number, b: number) => number;
    expect(add(2, 3)).toBe(5);
  });
});
