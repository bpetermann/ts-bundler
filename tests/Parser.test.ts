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

  it('resolves directory imports to index.js', () => {
    const data = `import baz from "./foo"`;
    const parser = new Parser();

    const dependencies = parser.parse(data);

    expect(dependencies).toEqual(['./foo/index.js']);
  });

  it('ignores non-import lines', () => {
    const parser = new Parser();

    const code = `
      const x = 1;
      function test() {}
      console.log(x);
    `;

    const deps = parser.parse(code);

    expect(deps).toEqual([]);
  });

  it('handles mixed imports and code', () => {
    const parser = new Parser();

    const code = `
      import foo from './foo'
      const x = foo();
      import bar from './bar.js'
    `;

    const deps = parser.parse(code);

    expect(deps).toEqual(['./foo/index.js', './bar.js']);
  });

  it('extracts side-effect imports', () => {
    const parser = new Parser();

    const code = `
    import './setup.js'
  `;

    const deps = parser.parse(code);

    expect(deps).toEqual(['./setup.js']);
  });

  it('resolves nested directory imports', () => {
    const parser = new Parser();

    const code = `
    import util from './foo/bar'
  `;

    const deps = parser.parse(code);

    expect(deps).toEqual(['./foo/bar/index.js']);
  });
});
