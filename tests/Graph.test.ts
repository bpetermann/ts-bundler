import { describe, expect, it } from 'vitest';
import Graph from '../lib/Graph.js';
import { createTempFiles } from './helper.js';

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
});
