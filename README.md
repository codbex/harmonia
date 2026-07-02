<p align="center">
  <a href="https://codbex.com/harmonia/" rel="noopener" target="_blank"><img width="256" height="256" src="docs/public/logo/harmonia.svg" alt="Harmonia logo"></a>
</p>

<h1 align="center">Harmonia</h1>

Harmonia is a modern UI Component Library for Alpine.js

## For coding agents

Harmonia ships an agent-readable skill so coding agents (Claude Code and others) know how to use every component. After `npm install @codbex/harmonia`, it lives at `node_modules/@codbex/harmonia/skills/harmonia/` (a `SKILL.md` router plus one reference file per component, and an `llms.txt` index).

**Claude Code plugin (recommended).** Install it so the skill is discovered automatically:

```
/plugin marketplace add codbex/harmonia
/plugin install harmonia@harmonia
```

**Manual (any agent that reads `.claude/skills`).**

Expose the shipped skill in your project.

On Linux/macOS/BSD:

```sh
ln -s node_modules/@codbex/harmonia/skills/harmonia .claude/skills/harmonia
```

On Windows:

```sh
cp -r node_modules/@codbex/harmonia/skills/harmonia .claude/skills/harmonia
```

Either way, point your agent at `skills/harmonia/SKILL.md` to start.

## Build steps

1. Install dependencies

```sh
npm install
```

2. Build the library

```sh
npm run build
```

## Build the documentation

1. Build the library
2. Install document dependencies

```sh
npm run docs:install
```

3. Build the library

Even if you did a library build before, you need to do this after you install the document dependencies

```sh
npm run build
```

3. Build the documentation

```sh
npm run docs:build
```

4. Run the preview

```sh
npm run docs:preview
```

If you are doing active development, then you should use the dev mode instead:

```sh
npm run docs:dev
```
