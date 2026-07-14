# Coding Agents

Harmonia ships an agent-readable skill so coding agents (Claude Code, Hermes and others) know how to use every component correctly. Give your agent the skill, then describe what you want in plain language ("add a login form with an email and password field", "build a dashboard with a sidebar, stat cards and a data table") and it will reach for the right `x-h-*` directives instead of guessing.

::: info
The skill is generated from these same docs, so it always tracks the current version of the library.
:::

## Install

### Claude Code plugin

Install the plugin so the skill is discovered automatically:

```
/plugin marketplace add codbex/harmonia
/plugin install harmonia@harmonia
```

### Manual (any agent that reads `.claude/skills`, `.hermes/skills`, etc.)

Add Harmonia to your project, which ships the skill inside the package at `node_modules/@codbex/harmonia/skills/harmonia/`:

```bash
npm install @codbex/harmonia
```

Then expose it in your project's `.claude/skills` or `.hermes/skills` folder.

For Claude:

::: code-group

```sh [Linux / macOS]
ln -s node_modules/@codbex/harmonia/skills/harmonia .claude/skills/harmonia
```

```powershell [Windows]
Copy-Item -Recurse node_modules\@codbex\harmonia\skills\harmonia .claude\skills\harmonia
```

:::

For Hermes:

::: code-group

```sh [Linux / macOS]
ln -s node_modules/@codbex/harmonia/skills/harmonia .hermes/skills/harmonia
```

```powershell [Windows]
Copy-Item -Recurse node_modules\@codbex\harmonia\skills\harmonia .hermes\skills\harmonia
```

:::

Either way, point your agent at `skills/harmonia/SKILL.md` to start.

## What's included

- **`SKILL.md`** - the router. It describes the library, the conventions that apply to every component, and an index that links to each reference.
- **`references/<name>.md`** - one focused reference per component, chart, layout, utility and plugin. Each lists the directive set, its attributes, whether it binds with `x-model`, and working examples to adapt.
- **`references/utility-classes.md`** - the curated list of utility classes Harmonia actually ships, so an agent does not assume a Tailwind class that is not bundled.
- **`llms.txt`** - a compact index of the whole skill.

## How it works

An agent matches the skill on its description, then opens `SKILL.md` and reads the component index. From there it loads only the reference(s) it needs for the task at hand, rather than pulling the entire library into context.

Harmonia components are Alpine directives: you add `x-h-*` attributes to plain HTML elements. There is no JSX and no component-tag syntax, so the references show real, copy-ready markup that an agent can drop straight into a page.

## Learn more

- Browse the full documentation at [codbex.com/harmonia](https://www.codbex.com/harmonia/).
- The skill and plugin live in the [Harmonia repository](https://github.com/codbex/harmonia) and are regenerated from the docs on every release.
