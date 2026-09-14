# Versioning and Support

Harmonia follows [semantic versioning](https://semver.org/) strictly and supports the current major version alongside the one before it. This page explains which versions receive fixes, how long they keep receiving them, and what to expect when a new major arrives.

## Semantic versioning

Harmonia follows semantic versioning **with no exceptions**.

| Release             | What it may contain                               | Can it break your code? |
| ------------------- | ------------------------------------------------- | ----------------------- |
| **Major** (`4.0.0`) | Breaking changes, new components, features, fixes | Yes                     |
| **Minor** (`3.2.0`) | New components and features, fixes                | No                      |
| **Patch** (`3.1.3`) | Fixes only                                        | No                      |

A breaking change forces a major bump. There is no backwards-incompatible change small enough to ride along in a minor, so a caret range is safe to leave in place.

```json
{
  "dependencies": {
    "@codbex/harmonia": "^3.0.0"
  }
}
```

Everything that range resolves to will be compatible with the code you have written against 3.x. This is enforced in CI against the changelog, not just promised.

::: info
Prereleases are published to npm under the `next` tag rather than `latest`, so a version containing `alpha`, `beta` or `rc` never reaches you by default.
:::

## Supported versions

| Version | Status      | Bug fixes          | Security fixes     |
| ------- | ----------- | ------------------ | ------------------ |
| **3.x** | Current     | Yes                | Yes                |
| 2.x     | End of life | No, upgrade to 3.x | No, upgrade to 3.x |
| 1.x     | End of life | No, upgrade to 3.x | No, upgrade to 3.x |
| 0.x     | End of life | No, upgrade to 3.x | No, upgrade to 3.x |

The **current major** receives everything, meaning new components, features, bug fixes and security fixes.

The **previous major** receives guaranteed security fixes. Bug fixes are assessed one at a time against the size of the change needed, so they may be backported but are not guaranteed. Moving to the current major is the expected route to a bug fix.

Everything older receives nothing.

### How long the previous major lasts

The previous major has **no fixed end date**. It stays supported for as long as it remains the previous major, so if no new major arrives for two or three years, it is supported for that whole time.

If majors arrive more quickly, a superseded major is still supported for **at least 12 months** from the date its successor was released. That minimum applies from 3.x onward. Versions 2.x and older predate this policy and are end of life today.

### When a version reaches end of life

Nothing happens to your application. A release past end of life keeps working exactly as it did, because every distribution channel is version-pinned. The npm package, the [unpkg](https://unpkg.com/) snippets and the WebJar coordinates all name an exact version, so a release you depend on never changes underneath you.

What stops is the flow of fixes. No further patches are published for that line.

## Upgrading between majors

Every breaking change is recorded in the [changelog](https://github.com/codbex/harmonia/blob/main/CHANGELOG.md) with what broke, why, and how to migrate. A major release is announced at least four weeks ahead, with a prerelease on the npm `next` tag so you can try the upgrade before it becomes the default.

If you use a coding agent, the package ships a generated migration reference at `node_modules/@codbex/harmonia/skills/harmonia/references/migration.md` covering breaking changes only, grouped by version. See [Coding Agents](/agent-skill) for how to expose it.

## Documentation for older versions

This site always documents the **current** release. There is no per-version archive of it.

Documentation for the exact version you installed ships inside the package instead, at `node_modules/@codbex/harmonia/skills/harmonia/references/`, with one reference file per component. It is generated from these same pages at release time, so it stays accurate for that version long after this site has moved on, including for versions past end of life.

## Reporting a security issue

Do not open a public issue. Report it through [GitHub's private vulnerability reporting](https://github.com/codbex/harmonia/security/advisories/new), or email <support@codbex.com> if you cannot use GitHub. The full policy, including scope and what to expect, is in [SECURITY.md](https://github.com/codbex/harmonia/blob/main/SECURITY.md).

## Support beyond this policy

Longer support windows, guaranteed backports and response-time commitments are available commercially. Contact <support@codbex.com>.
