import { join } from 'path';
import { describe, expect, it } from 'vitest';
import Module from '../lib/Module.js';
import Parser from '../lib/Parser.js';
import { createTempFile } from './helper.js';

describe('Module', () => {
  it('reads file and extracts dependencies', () => {
    const { root, file } = createTempFile(
      `import foo from "./foo.js";\nconsole.log(foo);`,
    );
    const module = new Module(new Parser(), join(root, file));

    expect(module.code).toContain('console.log');
    expect(module.dependencies).toEqual(['./foo.js']);
  });
});
