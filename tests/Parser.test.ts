import { writeFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import Parser from '../lib/Parser.js';
import { createTempFile } from './helper.js';

describe('Parser', () => {
  it('leaves non-import lines untouched', () => {
    const { root } = createTempFile('console.log("hello");');
    const data = `console.log("hello");`;
    const parser = new Parser(root, data);
    const result = parser.parse();
    expect(result).toBe(data);
  });

  it('resolves a relative import', () => {
    const { root } = createTempFile('import foo from "./foo.js";');
    writeFileSync(join(root, 'foo.js'), 'export const foo = 42;');

    const data = `import foo from "./foo.js";`;
    const parser = new Parser(root, data);
    const result = parser.parse();
    expect(result).toBe('export const foo = 42;');
  });
});
