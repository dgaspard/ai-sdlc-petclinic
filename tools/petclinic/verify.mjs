// Explicit local consumer entry point. Never discovers, fetches, pins or freezes.
import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import {factoryPath,consumerRoot} from "./factory-path.mjs";
const args = process.argv.slice(2),
  options = {};
try {
  while (args.length) {
    const key = args.shift();
    if (
      !["--factory", "--root", "--trust", "--mode"].includes(key) ||
      options[key] ||
      !args.length
    )
      throw Error(
        "Expected --factory PATH --root PATH --trust PATH [--mode full|fast]",
      );
    options[key] = args.shift();
  }
  for (const key of ["--factory", "--root", "--trust"])
    if (!options[key]) throw Error(`Required: ${key}`);
  if (fs.realpathSync(options["--root"])!==fs.realpathSync(consumerRoot)) throw Error("--root must identify this consumer checkout");
  process.env.FACTORY_CHECKOUT=options["--factory"];
  const verifiedFactory=factoryPath();
  const r = spawnSync(
    process.execPath,
    [
      path.join(
        verifiedFactory,
        "tools/factory/consumer.mjs",
      ),
      "verify",
      "--root",
      fs.realpathSync(options["--root"]),
      "--config",
      "spec/factory/petclinic/config.json",
      "--trust",
      fs.realpathSync(options["--trust"]),
      "--mode",
      options["--mode"] ?? "full",
    ],
    { stdio: "inherit" },
  );
  if (r.error) throw r.error;
  process.exitCode = r.status ?? 9;
} catch (e) {
  console.error(e.message);
  process.exitCode = 2;
}
