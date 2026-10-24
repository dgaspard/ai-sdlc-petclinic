# Project-specific security checks and configuration

Everything here encodes a decision specific to *this* application's
architecture — its route dispatch model, its CORS policy, its auth wiring.
Don't try to generalize anything in this folder; if a piece of it turns out
to generalize, that's a signal to extract an engine into
[../portable/](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/tools/security/portable) and leave only the project's parameters here, not a reason to
rewrite this folder to look more abstract.

No CODEOWNERS protection beyond the project's normal review — unlike
[../portable/](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/tools/security/portable), changes here are expected to track this app's own evolving
architecture.

## What's here

- `cors-policy.json` — this app's actual CORS configuration, as implemented
  in `services/platform/runtime.js`, for comparison against what a portable
  CORS check (if one gets added) should be checking for.
- `auth-coverage-notes.md` — why SEC-01 defect #5 (a route skipping the auth
  hook) is structurally unusual in this app's current architecture, and why
  there's no automated "auth-coverage-engine" here yet.

## Factory tool paths after import

Portable engines live only in the pinned factory dependency. For shell commands,
replace a historical `tools/review/portable/` or `tools/security/portable/` path with
`"$FACTORY_CHECKOUT/tools/review/portable/"` or
`"$FACTORY_CHECKOUT/tools/security/portable/"`. The consumer calibration scripts
resolve this binding before calling the engine. Do not copy the engine into this
repository. The review prompt and historical review records remain in the
[pinned factory source](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/tools/review/review-prompt.md).
