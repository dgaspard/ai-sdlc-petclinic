# PetClinic backlog

Application-specific work belongs here. No new domain behavior is authorized by
repository separation. Existing requirements and their stable IDs are retained.

Factory START-02 status and historical backlog remain in the
[factory backlog](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/BACKLOG.md).
The reviewed import at `8c16963fcb9392907ebb14a62aa1537eca12bc43` passed its independent gate and CI. Factory milestone status remains in the canonical upstream backlog.

## D-67 — Preferred veterinarian conflict

Status: specification draft awaiting human review/freeze; application implementation is not authorized in this phase. Known inactive preference selection on profile PATCH returns 409 invalid_state atomically; unknown stays 400. Five new API/BDD scenarios exercise the existing Customer-to-Reservation roster boundary. The governed task grants only update of services/customer/server.js. No source creation/deletion, persistence or cloud change.

The current factory pin has no governed-change coordinator. A later real demonstration requires its released immutable revision, an explicit reviewed config pin upgrade, renewed consumer freeze/commit and external trust, plus an available OS-constrained coding runner. Protocol fixtures cannot substitute for that proof.

The optional `review-policy` suite remains blocked by REVIEW-02: the pinned factory
has no `tools/review-policy/evaluate.mjs` implementation. Its assertions remain and
now address the pinned factory; it is not part of the unchanged fourteen-suite full
application tier. This import does not activate approval automation or remove any
awaiting tags.

## Upstream delivery dependencies

These headings preserve the IDs referenced by frozen awaiting tags. Their status
is owned by the linked factory backlog, not duplicated here. No tag is activated.

### REVIEW-02 — Adopt the upstream capability when reviewed

Canonical work and status: [factory REVIEW-02](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/BACKLOG.md).

### ENV-03 — Adopt the upstream capability when reviewed

Canonical work and status: [factory ENV-03](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/BACKLOG.md).

### CI-02 — Adopt the upstream capability when reviewed

Canonical work and status: [factory CI-02](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/BACKLOG.md).

### ENV-02 — Adopt the upstream capability when reviewed

Canonical work and status: [factory ENV-02](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/BACKLOG.md).

### EVID-01 — Adopt the upstream capability when reviewed

Canonical work and status: [factory EVID-01](https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory/blob/9809c120cafd0ad867be6568621fac3ef54f1780/BACKLOG.md).
