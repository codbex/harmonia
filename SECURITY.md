# Security Policy

## Supported versions

| Version | Status      | Security fixes     |
| ------- | ----------- | ------------------ |
| 3.x     | Current     | Yes                |
| 2.x     | End of life | No, upgrade to 3.x |
| 1.x     | End of life | No, upgrade to 3.x |
| 0.x     | End of life | No, upgrade to 3.x |

Harmonia supports the **current major version** and the **major before it**.

The previous major has no fixed end date. It stays supported for as long as it remains the
previous major, so if no new major arrives for two or three years, it is supported for that
whole time. Should majors arrive more quickly, a superseded major is still supported for
**at least 12 months** from the date its successor was released.

That 12 month minimum applies from 3.x onward. Versions 2.x and older predate this policy
and are end of life today.

A version past end of life keeps working. Every distribution channel is version-pinned, so
nothing changes underneath you. It simply stops receiving fixes of any kind.

### What a supported version receives

- **Security fixes** are guaranteed for the current major and for the previous major.
- **Bug fixes** land in the current major. They are backported only where the change is
  small enough to be worth carrying across, so they are considered case by case and are not
  guaranteed. Moving to the current major is the expected route to a fix.
- **New components and features** land in the current major only.

Harmonia follows [semantic versioning](https://semver.org/) strictly, so upgrading within a
major is safe. No minor or patch release will break existing usage. See
[CONTRIBUTING.md](CONTRIBUTING.md#versioning) for the full versioning rules.

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report it privately through GitHub's
[private vulnerability reporting](https://github.com/codbex/harmonia/security/advisories/new),
which opens a draft advisory visible only to the maintainers. If you cannot use GitHub,
email **support@codbex.com** instead.

A useful report includes:

- The affected Harmonia version, and the Alpine.js version alongside it.
- Which build you are using, the browser bundle or the ESM build.
- A minimal reproduction, ideally the smallest piece of markup that shows the problem.
- What an attacker gains, and any preconditions needed to get there.

You will get an acknowledgement within **5 business days**. Once the report is confirmed,
you will be told whether a fix is planned and roughly when to expect it. A fix ships in a
patch release on the current major, and on the previous major while it is still supported.

You are credited in the advisory and the changelog unless you would rather not be. Please
give us a chance to release a fix before disclosing publicly.

### Scope

Harmonia is a client-side component library, so the vulnerabilities that apply to it are
the ones a component can introduce into a page that uses it. Worth reporting:

- Markup or attribute values a component turns into executable script.
- A component that renders consumer data in a way that escapes its intended context.
- Anything that defeats a browser security boundary the library claims to respect.

Components build the DOM with `createElement` and `textContent` and never accept HTML from
consumers, which is deliberate and is the main defence here. A case where that rule is
broken is worth reporting even without a full exploit.

Out of scope are vulnerabilities in Alpine.js itself, which is a peer dependency whose
version you control, issues that require an already-compromised page, and anything in the
documentation site rather than the library.
