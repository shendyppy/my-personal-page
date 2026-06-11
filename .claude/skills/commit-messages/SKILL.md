---
name: commit-messages
description: Standards for writing commit messages in this repo. Invoke when staging, committing, or helping the user craft a commit message. Ensures conventional-commit format, scope accuracy, and clear descriptions.
---

# Commit message standards

Every commit in this repo follows **Conventional Commits** with scoped prefixes. These rules apply to all AI-authored commits and to any commit message suggestions given to the user.

## Format

```
<type>(<scope>): <subject>
```

- **Subject** is imperative present tense: "add X", "fix Y", "refactor Z" — not "added" or "adding".
- **Subject** starts lowercase, no trailing period, max ~70 chars.
- No blank body is needed for small, self-explanatory changes. Add a body (separated by a blank line) only when the "why" isn't obvious from the diff.

## Types

| Type       | When to use                                                       |
| ---------- | ----------------------------------------------------------------- |
| `feat`     | New feature, new component, new section, new API                  |
| `fix`      | Bug fix, broken layout, runtime error, wrong data                 |
| `refactor` | Code restructure with no behavior change                          |
| `style`    | Visual/CSS-only changes — colors, spacing, animations, fonts      |
| `chore`    | Tooling, config, deps, CI, seed data, scripts                     |
| `docs`     | README, AGENTS.md, comments, JSDocs                               |
| `perf`     | Performance improvement (lazy load, code split, image optimize)   |
| `test`     | Adding or updating tests                                          |

## Scopes

Scope narrows _where_ the change lives. Use the **most specific** scope that still reads naturally:

| Scope          | Covers                                                     |
| -------------- | ---------------------------------------------------------- |
| `hero`         | Hero section, HeroSceneIsland, HeroBodyIsland              |
| `skills`       | Skills section, SkillCanvas, SkillCard, SkillInfo           |
| `projects`     | Projects section, ProjectTile, project detail pages         |
| `about`        | About section, BioCard, ProfilePhoto, etc.                  |
| `experience`   | Experience section, ExperienceCard                          |
| `nav`          | Navigation, theme toggle, scroll behavior                   |
| `3d`           | Three.js / R3F / Spline / GLTF model changes               |
| `ui`           | Shared UI primitives (shadcn, Button, Card, etc.)           |
| `css`          | globals.css, theme tokens, keyframes                        |
| `db`           | Prisma schema, migrations, seed                             |
| `api`          | API route handlers                                          |
| `types`        | TypeScript type definitions                                 |
| `deps`         | package.json, lock file, dependency updates                 |
| `config`       | next.config, tsconfig, ESLint, Tailwind config              |
| `skills`       | .claude/skills/ agent skill files                           |

When a change spans multiple areas, use the **primary** scope. If truly cross-cutting, omit the scope: `feat: add dark mode support`.

## Examples

```
feat(hero): add mobile nudge card for wider-screen experience
fix(skills): resolve canvas not shrinking on viewport resize
style(css): add icon-float keyframe and dismiss animation
refactor(skills): remove ForceCanvasResize in favor of CSS fix
chore(deps): update @react-three/fiber to 9.3.1
docs(agents): add commit-messages skill
perf(hero): lazy-load Spline scene behind sm breakpoint
test(projects): add Playwright smoke test for project tiles
```

## Multi-file commits

When a single logical change spans 2–4 files (common in this repo), **one commit** is fine — use the scope of the primary change. Don't split into micro-commits per file unless the changes are genuinely independent.

## Don'ts

- Don't use `WIP`, `misc`, `update`, or `changes` as subjects.
- Don't commit generated files (`generated/prisma/`) — they're in `.gitignore`.
- Don't combine unrelated changes in one commit — split them.
- Don't write essay-length bodies. If a commit needs a paragraph of explanation, the change may be too big — consider splitting.
