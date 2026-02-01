import { readdirSync } from 'fs';
import { describe, expect, it } from 'vitest';
import Bundler from '../lib/Bundler.js';
import { createTempFile } from './helper.js';

describe('Bundler', () => {
  it('creates an output file', () => {
    const { root, file } = createTempFile('console.log("hello, world!");');

    new Bundler(root, file).bundle();

    expect(readdirSync(root)).toHaveLength(2);
  });
});

describe('Bundler', () => {
  it('creates an dist output file', () => {
    const { root, file } = createTempFile('');

    new Bundler(root, file).bundle();

    expect(readdirSync(root)).toContain(`dist-${file}`);
  });
});
