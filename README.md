# ts-bundler

A tiny **JavaScript/TypeScript** bundler implemented as a learning project to explore how bundlers work.

This repository is a minimal bundler written in TypeScript. It’s intended as an educational project to understand **module graph construction, parsing, code transformation, and runtime execution**.

## Features

- Parses import statements and builds a dependency graph.
- Supports nested directories and directory imports (./foo → ./foo/index.js).
- Transforms export default to module.exports.
- Transforms import X from './file.js' into runtime require calls.
- Generates a single bundled IIFE runtime with a custom **require** function.
- Pure TypeScript implementation with minimal dependencies.

## Installation

**Build**

```bash
npm install
npm run build
```

Build output is under `dist/`

**Global CLI (optional)**

```bash
npm link
```

After linking, the bundle command becomes available globally.

**Run without linking**

```bash
node ./dist/index.js <entry-file>
```

Replace `<entry-file>` with the path to your entry JavaScript/TypeScript file.

## 📝 Example

Project structure:

```
/project
  ├─ index.js
  └─ foo/
      └─ bar.js
```

index.js`:

```js
import sum from './foo/bar.js';

console.log(sum(2, 3));
```

After running:

```bash
bundle ./project/index.js

```

The output bundle contains all modules and executes:

```js
(function () {
  const graph = {
    './index.js': function(require, module, exports) { ... },
    './foo/bar.js': function(require, module, exports) { ... }
  };

  const cache = {};
  function __require__(id) { ... }
  __require__('./index.js');
})();

```

### 🛠️ Contributing

Contributions, questions, or suggestions are welcome

### License

MIT
