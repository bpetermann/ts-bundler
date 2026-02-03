import { describe, expect, it } from 'vitest';
import Graph from '../lib/Graph.js';
import { createTempDirs, createTempFiles } from './helper.js';

describe('Graph', () => {
  it('builds a graph from entry file', () => {
    const { root } = createTempFiles([
      {
        file: 'index.js',
        text: `import foo from "./foo.js";`,
      },

      {
        file: 'foo.js',
        text: `console.log("foo");`,
      },
    ]);

    const graph = new Graph(root, 'index.js');

    expect(graph.dependencyGraph).toHaveLength(2);

    const files = graph.dependencyGraph.map((m) => m.filepath);
    expect(files.some((f) => f.endsWith('index.js'))).toBe(true);
    expect(files.some((f) => f.endsWith('foo.js'))).toBe(true);
  });

  it('deduplicates shared dependencies', () => {
    const { root } = createTempFiles([
      {
        file: 'index.js',
        text: `
          import sum from './bar.js';
          import add from './foo.js';
        `,
      },
      {
        file: 'foo.js',
        text: `
          import sum from './bar.js';

          export default function add(a, b) {
            return sum(a, b);
          }
        `,
      },
      {
        file: 'bar.js',
        text: `
          export default function sum(a, b) {
            return a + b;
          }
        `,
      },
    ]);

    const graph = new Graph(root, 'index.js');

    expect(graph.dependencyGraph).toHaveLength(3);

    const files = graph.dependencyGraph.map((m) => m.filepath);

    expect(files.filter((f) => f.endsWith('index.js'))).toHaveLength(1);
    expect(files.filter((f) => f.endsWith('foo.js'))).toHaveLength(1);
    expect(files.filter((f) => f.endsWith('bar.js'))).toHaveLength(1);
  });

  it('recurse nested directories dependencies', () => {
    const { root } = createTempDirs([
      { dir: '/', file: 'index.js', text: "import baz from './foo/bar.js'" },
      { dir: 'foo', file: 'bar.js', text: 'export function foo(){}' },
    ]);

    const graph = new Graph(root, 'index.js');

    expect(graph.dependencyGraph).toHaveLength(2);

    const files = graph.dependencyGraph.map((m) => m.filepath);
    expect(files.some((f) => f.endsWith('index.js'))).toBe(true);
    expect(files.some((f) => f.endsWith('foo/bar.js'))).toBe(true);
  });

  it('resolves directory imports', () => {
    const { root } = createTempDirs([
      { dir: '/', file: 'index.js', text: "import baz from './foo'" },
      { dir: 'foo', file: 'index.js', text: 'export function foo(){}' },
    ]);

    const graph = new Graph(root, 'index.js');

    expect(graph.dependencyGraph).toHaveLength(2);

    const files = graph.dependencyGraph.map((m) => m.filepath);
    expect(files.some((f) => f.endsWith('index.js'))).toBe(true);
    expect(files.some((f) => f.endsWith('foo/index.js'))).toBe(true);
  });
});
