import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const cleanupFns: Array<() => void> = [];

export function runCleanup() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;
}

export function createTempRepo() {
  const root = mkdtempSync(join(tmpdir(), 'bundle-test-'));
  cleanupFns.push(() => rmSync(root, { recursive: true, force: true }));

  return { root };
}

export function createTempDirs(
  dirs: { dir: string; file: string; text: string }[],
) {
  const { root } = createTempRepo();

  dirs.forEach(({ dir, file, text }) => {
    const fullDir = join(root, dir);
    mkdirSync(fullDir, { recursive: true });
    writeFileSync(join(fullDir, file), text);
  });

  return { root };
}
export function createTempFile(text: string, file = 'index.js') {
  const { root } = createTempRepo();
  writeFileSync(join(root, file), text);

  return { root, file };
}

export function createTempFiles(files: { file: string; text: string }[]): {
  root: string;
} {
  const { root } = createTempRepo();
  files.forEach(({ file, text }) => writeFileSync(join(root, file), text));

  return { root };
}
