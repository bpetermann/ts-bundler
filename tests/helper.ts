import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const cleanupFns: Array<() => void> = [];

export function createTempRepo() {
  const root = mkdtempSync(join(tmpdir(), 'bundle-test-'));
  cleanupFns.push(() => rmSync(root, { recursive: true, force: true }));

  return { root };
}

export function createTempFile(text: string, index = 'index.js') {
  const { root } = createTempRepo();
  writeFileSync(join(root, index), text);

  return { root, index };
}

export function runCleanup() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;
}
