import { readdirSync } from 'fs';
import { describe, expect, it } from 'vitest';
import Bundler from '../lib/Bundler.js';
import { createTempFile } from './helper.js';

describe('Bundler', () => {
  it('creates an output file', () => {
    const { root, index } = createTempFile('hello, world!');

    new Bundler(root, index).bundle();

    expect(readdirSync(root)).toHaveLength(2);
  });
});
