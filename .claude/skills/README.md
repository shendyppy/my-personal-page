# Project skills

Project-specific Claude skills that codify recurring workflows in this repo. They're discovered automatically by Claude Code when relevant.

| Skill                 | When to invoke                                                          |
| --------------------- | ----------------------------------------------------------------------- |
| `add-content-model`   | Adding a new DB-backed content type (model + types + seed + query)      |
| `add-section`         | Adding a new visible landing-page section                               |
| `commit-messages`     | Writing commit messages — conventional-commit format, scopes, examples  |
| `optimize-images`     | New image assets dropped, or asked to re-process WebP                   |
| `pr-review`           | Reviewing PRs, self-reviewing before push, writing PR descriptions      |
| `refactor-to-rsc`     | Modernizing a legacy `useEffect + fetch` section                        |
| `update-cv`           | Replacing the downloadable CV PDF                                       |
| `visual-craft`        | Any UI/visual/animation/3D work — craft standards & review checklist    |

## Adding a new skill

1. Create `.claude/skills/<kebab-name>/SKILL.md`
2. Front-matter must include `name` and `description`. Description is what Claude reads to decide when to invoke — be specific about triggers.
3. Body is the runbook. Keep it tight; reference `AGENTS.md` for shared context.
4. Update this index.
