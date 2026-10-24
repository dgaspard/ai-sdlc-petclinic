# PetClinic

PetClinic owns this application's code, requirements, tests, fixtures, workloads and
trust. The Software Factory supplies shared mechanisms at the immutable revision
in `spec/factory/petclinic/config.json`: `9809c120cafd0ad867be6568621fac3ef54f1780`.

## Install from a clean checkout

Use Node 22 or 24 and Docker for the pinned Playwright browser image. From this
consumer checkout, fetch the public factory into an **external dependency cache**:

```sh
FACTORY_PIN=$(node -p "require('./spec/factory/petclinic/config.json').factory.revision")
FACTORY_CACHE="$HOME/.cache/ai-sdlc-factory/$FACTORY_PIN"
test ! -e "$FACTORY_CACHE" && mkdir -p "$FACTORY_CACHE" &&
git -C "$FACTORY_CACHE" init &&
git -C "$FACTORY_CACHE" fetch --depth=1 https://github.com/dgaspard/AI-SDLC-ATDD-SoftwareFactory.git "$FACTORY_PIN" &&
git -C "$FACTORY_CACHE" checkout --detach FETCH_HEAD &&
test "$(git -C "$FACTORY_CACHE" rev-parse HEAD)" = "$FACTORY_PIN"
export FACTORY_CHECKOUT="$(cd "$FACTORY_CACHE" && pwd -P)"
(cd "$FACTORY_CHECKOUT/spec" && npm ci)
npm --prefix spec ci
npm --prefix spec/delivery ci
for setup in services/*/setup frontend/setup; do (cd "$(dirname "$setup")" && ./setup); done
```

An existing cache must be checked for exact HEAD and a clean tree before reuse;
never reset or overwrite it. The consumer resolver refuses wrong/dirty revisions.
The fetch is a pinned dependency installation, not a sibling source checkout.
Agents performing authenticated operations must use the GitHub App wrapper in the
factory; never fall back to a personal login. Public installation needs no credentials.

## Run and verify

Each project's `start` script runs it using its runtime contract. `docker compose up
--build` starts the local application; open the frontend on port 3000. The application
uses demo credentials and in-memory data; this is not a production deployment.

```sh
npm test
npm run test:verify
```

These normal entry points invoke the pinned factory runner and preserve evidence-v1.
For the complete seven-project consumer verification and separate evidence envelope,
first have the owner freeze and commit the reviewed consumer inputs. Materialize an
external trust snapshot from that explicit reviewed consumer commit:

```sh
node tools/petclinic/trust-snapshot.mjs --root "$PWD" \
  --reviewed-revision FULL_REVIEWED_CONSUMER_COMMIT \
  --output /absolute/external-directory/petclinic-trust.json
node tools/petclinic/verify.mjs --root "$PWD" --factory "$FACTORY_CHECKOUT" \
  --trust /absolute/external-directory/petclinic-trust.json
```

Do not substitute an unreviewed HEAD. Only the human runs
`npm --prefix spec run guard:freeze`. This import carries the source manifest solely
as a historical baseline; the new consumer needs its own reviewed human freeze.

## CI and trust setup

Preserve the required checks `Protected specs and tests unchanged`, `Delivery spec`
and `Application suite`, with human CODEOWNERS review and no agent bypass. The owner
must bootstrap the reviewed workflow (the App has no workflow-write permission),
configure the ruleset, and set repository variable `PETCLINIC_TRUST_REVISION` to the
full reviewed consumer commit containing the approved trust source and manifest.
CI fails if this independent authority is absent. No cloud or approval automation
is activated. See MIGRATION.json for exact original provenance; historical factory
test records are not proof of this consumer's gate.
