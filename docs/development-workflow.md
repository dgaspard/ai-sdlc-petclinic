# PetClinic development workflow

Read AGENTS.md, BACKLOG.md and the affected protected contracts/features first.
Humans review specification changes and run guard:freeze. Agents implement against
the frozen inputs without changing assertions, accepted-risk tags or thresholds.

Install the exact factory pin and package lockfiles as described in README.md.
Run `npm run test:fast` during implementation, `npm run test:gate` before completion,
and `npm run test:verify` on the final tree. CI must independently run the full gate
and the separate consumer evidence envelope. Cached local evidence cannot replace CI.
Use focused suite commands to diagnose failures; never change tests to obtain green.

Review domain/API/observability contracts before changing behavior. Preserve stable
D/OBS/CTL IDs. Require an independent engineering review and fresh documentation pass.
Factory upgrades change the protected full commit pin through separate human review,
freeze and complete gate verification. Never update a pin automatically at runtime.
Historical process: [source workflow](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/docs/development-workflow.md).
