import { describe, expect, it } from 'vitest';
import Parser from '../lib/Parser.js';

describe('Parser', () => {
  it('returns no dependencies for code without imports', () => {
    const data = `console.log("hello");`;
    const parser = new Parser();

    const dependencies = parser.parse(data);

    expect(dependencies).toEqual([]);
  });

  it('extracts a single relative import', () => {
    const data = `import foo from "./foo.js";`;
    const parser = new Parser();

    const dependencies = parser.parse(data);

    expect(dependencies).toEqual(['./foo.js']);
  });

  it('extracts multiple imports', () => {
    const data = `
      import foo from "./foo.js";
      import bar from "./bar.js";
    `;
    const parser = new Parser();

    const dependencies = parser.parse(data);

    expect(dependencies).toEqual(['./foo.js', './bar.js']);
  });
});
